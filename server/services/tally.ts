import { z } from "zod";
import { format } from "date-fns";

// Unified validation schema for a Tally-imported row.
export const TallyRowSchema = z.object({
    mobile: z.string().trim().min(7, "Mobile number too short").max(15, "Mobile number too long"),
    name: z.string().trim().min(3, "Name too short"),
    voucherNo: z.string().trim().min(1, "Voucher number is required"),
    date: z.date().optional(),
    debit: z.number().default(0),
    credit: z.number().default(0),
    balance: z.number().default(0),
    voucherType: z.string().optional(),
});

// Helper: Normalize field names for flexible mapping
export function normalizeFieldName(fieldName: string): string {
    return fieldName.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Helper: Find field value by trying multiple possible field names
export function getFieldValue(row: any, possibleNames: string[]): any {
    const normalizedRow: Record<string, any> = {};
    for (const key in row) {
        normalizedRow[normalizeFieldName(key)] = row[key];
    }

    for (const name of possibleNames) {
        const normalized = normalizeFieldName(name);
        if (normalizedRow[normalized] !== undefined) {
            return normalizedRow[normalized];
        }
    }
    return undefined;
}

// Helper: Normalize phone number to 10 digits
export function normalizePhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    if (digits.length > 10) return digits.slice(-10);
    return digits;
}

// Helper: Parse date from multiple formats
export function parseFlexibleDate(dateValue: any): Date {
    if (!dateValue) return new Date();
    if (typeof dateValue === 'number') {
        return new Date((dateValue - (25567 + 2)) * 86400 * 1000);
    }
    const dateStr = dateValue.toString().trim();
    const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) return new Date(dateStr);

    const ddmmyyyyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (ddmmyyyyMatch) {
        const [, day, month, year] = ddmmyyyyMatch;
        return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
    }
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}
