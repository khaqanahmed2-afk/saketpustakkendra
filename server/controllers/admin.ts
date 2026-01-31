import { Request, Response } from "express";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { XMLParser } from "fast-xml-parser";
import { supabase } from "../services/supabase";
import fs from "fs";
import path from "path";
import crypto from "crypto";


const BATCH_SIZE = 500;

function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

import {
    TallyRowSchema,
    getFieldValue,
    normalizePhoneNumber,
    parseFlexibleDate
} from "../services/tally";

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
});

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export async function uploadTally(req: MulterRequest, res: Response) {
    const sessionId = crypto.randomUUID();
    let filePathStr = "";

    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        filePathStr = req.file.path;

        // 1. Concurrency Check (Lock)
        const { data: lock, error: lockError } = await supabase
            .from('import_meta')
            .select('value')
            .eq('key', 'is_importing')
            .maybeSingle();

        if (lock?.value) {
            return res.status(429).json({ message: "Another import is already in progress. Please wait." });
        }

        // Acquire Lock
        await supabase.from('import_meta').upsert({ key: 'is_importing', value: true });

        const xmlContent = fs.readFileSync(filePathStr, 'utf-8');
        const jsonObj = parser.parse(xmlContent);

        // DEBUG: Write structure
        try {
            fs.writeFileSync(path.join(process.cwd(), 'debug_structure.json'), JSON.stringify(jsonObj, null, 2));
        } catch (e) { console.error("Write debug fail", e); }

        // --- ROBUST XML PARSING ---
        // Safely navigate the structure: ENVELOPE -> BODY -> IMPORTDATA -> REQUESTDATA -> TALLYMESSAGE
        const envelope = jsonObj?.ENVELOPE;
        const body = envelope?.BODY;

        // 1. Check for basic Tally XML structure
        if (!envelope || !body) {
            throw new Error("Invalid Tally XML: Missing ENVELOPE or BODY tag.");
        }

        // 2. Extract Tally Messages (Handle single vs array vs undefined)
        // Master import usually comes in IMPORTDATA, Voucher in DATA.COLLECTION or IMPORTDATA
        const importData = body.IMPORTDATA;
        const requestData = importData?.REQUESTDATA;
        const tallyMsgRaw = requestData?.TALLYMESSAGE;

        // Sometimes Vouchers are under BODY.DATA.COLLECTION.VOUCHER
        const dataCollectionVoucher = body.DATA?.COLLECTION?.VOUCHER;

        let messages: any[] = [];

        if (tallyMsgRaw) {
            messages = Array.isArray(tallyMsgRaw) ? tallyMsgRaw : [tallyMsgRaw];
        } else if (dataCollectionVoucher) {
            // If it's the specific voucher export format
            messages = Array.isArray(dataCollectionVoucher) ? dataCollectionVoucher : [dataCollectionVoucher];
        }

        if (messages.length === 0) {
            throw new Error("No TALLYMESSAGE or VOUCHER data found in XML.");
        }

        console.log(`[${sessionId}] Found ${messages.length} Tally messages/vouchers.`);

        // 3. Detect Import Type
        const isMaster = messages.some((m: any) => m.GROUP || m.LEDGER);
        const isVoucher = messages.some((m: any) => m.VOUCHER) || !!dataCollectionVoucher;

        // 4. Dependency Check (Masters before Vouchers)
        const { data: importStatus } = await supabase
            .from('import_meta')
            .select('value')
            .eq('key', 'first_import_done')
            .maybeSingle();

        if (isVoucher && !importStatus?.value) {
            return res.status(400).json({
                message: "First-time Master import required. Please upload your Tally Masters XML first.",
                code: "MASTERS_REQUIRED"
            });
        }

        if (isMaster) {
            console.log(`[${sessionId}] Processing MASTER import...`);
            const result = await handleMasterImport(messages, sessionId); // Pass sessionId

            // Mark masters as done if successful
            if (result.stats.processed > 0 && result.stats.errors === 0) {
                await supabase.from('import_meta').upsert({ key: 'first_import_done', value: true });
            }

            return res.json({ ...result, sessionId });
        } else {
            console.log(`[${sessionId}] Processing VOUCHER import...`);
            // We pass the ALREADY parsed messages usually, but existing function expects file+json
            // Let's optimize: reuse the messages we extracted if it's XML
            const voucherData = await parseVoucherData(req.file, jsonObj, messages);
            const result = await handleVoucherImport(voucherData);
            return res.json(result);
        }

    } catch (error) {
        console.error(`[${sessionId}] CRITICAL: Upload handler failed:`, error);

        // Write error to file for debugging
        try {
            const errorLog = {
                message: (error as Error).message,
                stack: (error as Error).stack,
                sessionId,
                timestamp: new Date().toISOString()
            };
            fs.writeFileSync(path.join(process.cwd(), 'error.log'), JSON.stringify(errorLog, null, 2));
        } catch (e) { console.error("Failed to write error.log", e); }

        res.status(500).json({
            message: "Internal server error during upload",
            error: (error as Error).message,
            sessionId
        });
    } finally {
        // Release Lock
        await supabase.from('import_meta').upsert({ key: 'is_importing', value: false });

        // Safe cleanup
        if (filePathStr) {
            try {
                if (fs.existsSync(filePathStr)) {
                    fs.unlinkSync(filePathStr);
                }
            } catch (cleanupError) {
                console.error("Failed to cleanup uploaded file:", cleanupError);
            }
        }
    }
}


async function handleMasterImport(messages: any[], sessionId: string) {
    let groupsCount = 0;
    let ledgersCount = 0;
    let errors = 0;

    console.log(`[${sessionId}] Starting Master Import...`);

    // 1. Batch Process Groups
    const groupData = messages
        .filter(m => m.GROUP)
        .map(m => ({
            name: m.GROUP['@_NAME'],
            parent_group: m.GROUP.PARENT
        }));

    const groupChunks = chunkArray(groupData, BATCH_SIZE);
    for (const chunk of groupChunks) {
        const { error } = await supabase.from('groups').upsert(chunk, { onConflict: 'name' });
        if (error) {
            console.error(`[${sessionId}] Group batch insert error:`, error);
            errors += chunk.length;
        } else {
            groupsCount += chunk.length;
        }
    }

    // 2. Batch Process Ledgers (Map to Customers)
    const ledgerData = messages
        .filter(m => m.LEDGER)
        .map(m => {
            const l = m.LEDGER;
            // Handle cases where LEDGERMOBILE might be an object/array or missing
            const rawMobile = l.LEDGERMOBILE?.toString() || l.LEDGERPHONE?.toString() || "";
            const mobile = normalizePhoneNumber(rawMobile);
            if (mobile && mobile.length >= 10) {
                return {
                    name: l['@_NAME'],
                    mobile,
                    role: 'user' as const
                };
            }
            return null;
        })
        .filter(Boolean);

    const ledgerChunks = chunkArray(ledgerData as any[], BATCH_SIZE);
    for (const chunk of ledgerChunks) {
        const { error } = await supabase.from('customers').upsert(chunk, { onConflict: 'mobile' });
        if (error) {
            console.error(`[${sessionId}] Ledger/Customer batch insert error:`, error);
            errors += chunk.length;
        } else {
            ledgersCount += chunk.length;
        }
    }


    // Mark first import as done if we processed anything
    if (groupsCount > 0 || ledgersCount > 0) {
        await supabase.from('import_meta').upsert({ key: 'first_import_done', value: true });
    }

    // Log Import Session for Audit
    await supabase.from('import_logs').insert({
        session_id: sessionId,
        import_type: 'MASTER',
        status: errors === 0 ? 'SUCCESS' : (groupsCount + ledgersCount > 0 ? 'PARTIAL' : 'FAILED'),
        total_rows: messages.length,
        processed_rows: groupsCount + ledgersCount,
        error_summary: errors > 0 ? `Failed to process ${errors} master records.` : null
    });

    return {
        message: "Masters imported successfully",
        type: 'MASTER',
        sessionId,
        stats: {
            total: messages.length,
            processed: groupsCount + ledgersCount,
            groups: groupsCount,
            ledgers: ledgersCount,
            skippedInvalid: 0,
            duplicates: 0,
            errors
        }
    };
}




async function parseVoucherData(file: Express.Multer.File, jsonObj: any, preParsedMessages?: any[]): Promise<any[]> {
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    let data: any[] = [];

    if (fileExtension === 'xml') {
        let collection = preParsedMessages;

        if (!collection) {
            collection =
                jsonObj?.ENVELOPE?.BODY?.IMPORTDATA?.REQUESTDATA?.TALLYMESSAGE ||
                jsonObj?.ENVELOPE?.BODY?.DATA?.COLLECTION?.VOUCHER;
        }

        if (Array.isArray(collection)) {
            data = collection.filter(v => v.VOUCHER || v.DATE).map((v) => {
                const actualV = v.VOUCHER || v;
                return {
                    Mobile: actualV.BASICBUYERADDRESS?.ADDRESS || actualV.PARTYNAME,
                    Name: actualV.PARTYNAME,
                    Date: actualV.DATE,
                    VoucherNo: actualV.VOUCHERNUMBER,
                    VoucherType: actualV.VOUCHERTYPENAME,
                    Debit: actualV.ALLLEDGERENTRIES_LIST?.[0]?.AMOUNT || actualV.LEDGERENTRIES_LIST?.[0]?.AMOUNT,
                    Credit: actualV.ALLLEDGERENTRIES_LIST?.[1]?.AMOUNT || actualV.LEDGERENTRIES_LIST?.[1]?.AMOUNT,
                    Balance: actualV.BALANCE,
                    Amount: actualV.AMOUNT,
                    Reference: actualV.REFERENCE,
                    Mode: actualV.MODE,
                };
            });
        }
    } else {
        const workbook = XLSX.read(fs.readFileSync(file.path), { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(sheet);
    }
    return data;
}

async function handleVoucherImport(data: any[]) {
    const totalRows = data.length;
    let processed = 0;
    let errors = 0;
    let duplicates = 0;
    let skippedInvalid = 0;

    console.log(`Processing ${totalRows} vouchers in batches...`);

    const ledgerEntries: any[] = [];
    const customerMap = new Map<string, string>(); // mobile -> customer_id

    // 1. Sync all involved customers first (Batch)
    const uniqueCustomers = Array.from(new Set(data.map(row => {
        const mobile = normalizePhoneNumber(getFieldValue(row, ['Mobile', 'Phone', 'PhoneNumber', 'Contact', 'MobileNo'])?.toString() || "");
        const name = getFieldValue(row, ['Name', 'CustomerName', 'PartyName', 'Customer'])?.toString()?.trim();
        return (mobile && mobile.length >= 10 && name) ? { mobile, name } : null;
    }).filter(Boolean)));

    const custChunks = chunkArray(uniqueCustomers as any[], BATCH_SIZE);
    for (const chunk of custChunks) {
        const { data: upserted, error } = await supabase
            .from('customers')
            .upsert(chunk, { onConflict: 'mobile' })
            .select('id, mobile');

        if (!error && upserted) {
            upserted.forEach(c => customerMap.set(c.mobile, c.id));
        }
    }

    // 2. Prepare Ledger Entries
    for (const row of data) {
        const rawMobile = getFieldValue(row, ['Mobile', 'Phone', 'PhoneNumber', 'Contact', 'MobileNo']);
        const rawVoucherNo = getFieldValue(row, ['VoucherNo', 'VoucherNumber', 'Voucher', 'RefNo'])?.toString()?.trim();
        const rawDate = getFieldValue(row, ['Date', 'EntryDate', 'VoucherDate', 'TransactionDate']);

        if (!rawMobile || !rawVoucherNo) {
            skippedInvalid++;
            continue;
        }

        const normalizedMobile = normalizePhoneNumber(rawMobile.toString());
        const customerId = customerMap.get(normalizedMobile);

        if (!customerId) {
            skippedInvalid++;
            continue;
        }

        const entryDate = parseFlexibleDate(rawDate);
        const formattedDate = format(entryDate || new Date(), 'yyyy-MM-dd');

        ledgerEntries.push({
            customer_id: customerId,
            entry_date: formattedDate,
            debit: Math.abs(parseFloat(getFieldValue(row, ['Debit', 'Dr', 'DebitAmount']) ?? 0)),
            credit: Math.abs(parseFloat(getFieldValue(row, ['Credit', 'Cr', 'CreditAmount']) ?? 0)),
            balance: parseFloat(getFieldValue(row, ['Balance', 'ClosingBalance', 'CurrentBalance']) ?? 0),
            voucher_no: rawVoucherNo
        });
    }

    // 3. Atomic Batch Import via RPC
    const sessionId = crypto.randomUUID();
    const chunks = chunkArray(ledgerEntries, BATCH_SIZE);

    console.log(`[${sessionId}] Starting atomic batch import...`);

    for (const chunk of chunks) {
        // Use RPC for atomic database-level transactions per batch
        const { error } = await supabase.rpc('import_ledger_batch', { batch_data: chunk });

        if (error) {
            console.error(`[${sessionId}] Batch insert failed:`, error);
            errors += chunk.length;
        } else {
            processed += chunk.length;
        }
    }

    // 4. Log Import Session for Audit
    await supabase.from('import_logs').insert({
        session_id: sessionId,
        import_type: 'VOUCHER',
        status: errors === 0 ? 'SUCCESS' : (processed > 0 ? 'PARTIAL' : 'FAILED'),
        total_rows: totalRows,
        processed_rows: processed,
        error_summary: errors > 0 ? `Failed to process ${errors} rows in batch.` : null
    });

    return {
        message: errors === 0 ? "Vouchers processed successfully" : "Voucher import completed with partial errors",
        type: 'VOUCHER',
        sessionId,
        stats: { total: totalRows, processed, skippedInvalid, duplicates, errors }
    };
}




