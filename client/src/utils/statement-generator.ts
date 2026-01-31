import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import * as XLSX from "xlsx";

interface StatementData {
    customer: any;
    ledger: any[];
    openingBalance: number;
    closingBalance: number;
    fromDate?: Date;
    toDate?: Date;
}

export const generatePDFStatement = ({ customer, ledger, openingBalance, closingBalance, fromDate, toDate }: StatementData) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("SAKET PUSTAK KENDRA", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("Account Statement", 105, 30, { align: "center" });

    // Customer Info
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.text(`Customer: ${customer.name}`, 14, 55);
    doc.text(`Mobile: ${customer.mobile}`, 14, 62);

    doc.text(`Date Range: ${fromDate ? format(fromDate, 'dd MMM yyyy') : 'start'} to ${toDate ? format(toDate, 'dd MMM yyyy') : 'now'}`, 140, 55, { align: 'right' });

    // Summary Table
    autoTable(doc, {
        startY: 70,
        head: [['Opening Balance', 'Total Debit', 'Total Credit', 'Closing Balance']],
        body: [[
            `INR ${openingBalance.toFixed(2)}`,
            `INR ${ledger.reduce((s, i) => s + Number(i.debit), 0).toFixed(2)}`,
            `INR ${ledger.reduce((s, i) => s + Number(i.credit), 0).toFixed(2)}`,
            `INR ${closingBalance.toFixed(2)}`
        ]],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] }
    });

    // Ledger Table
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Date', 'Particulars', 'Debit', 'Credit', 'Balance']],
        body: ledger.map(item => [
            format(new Date(item.entryDate), 'dd-MM-yyyy'),
            item.voucherNo || 'Transaction',
            item.debit > 0 ? Number(item.debit).toFixed(2) : '-',
            item.credit > 0 ? Number(item.credit).toFixed(2) : '-',
            Number(item.balance).toFixed(2)
        ]),
        theme: 'striped',
        styles: { fontSize: 8 },
        columnStyles: {
            2: { halign: 'right', textColor: [200, 0, 0] },
            3: { halign: 'right', textColor: [0, 150, 0] },
            4: { halign: 'right', fontStyle: 'bold' }
        }
    });

    doc.save(`Statement_${customer.name}_${format(new Date(), 'yyyyMMdd')}.pdf`);
};

export const generateExcelStatement = ({ customer, ledger, openingBalance, closingBalance }: StatementData) => {
    const ws_data = [
        ["SAKET PUSTAK KENDRA"],
        ["Account Statement"],
        [],
        ["Customer Name", customer.name],
        ["Mobile", customer.mobile],
        ["Generated On", format(new Date(), 'dd-MM-yyyy HH:mm')],
        [],
        ["Opening Balance", openingBalance],
        ["Closing Balance", closingBalance],
        [],
        ["Date", "Entry Type/Ref", "Debit (Purchase)", "Credit (Payment)", "Balance"]
    ];

    ledger.forEach(item => {
        ws_data.push([
            format(new Date(item.entryDate), 'dd-MM-yyyy'),
            item.voucherNo || 'Transaction',
            Number(item.debit) || 0,
            Number(item.credit) || 0,
            Number(item.balance)
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Statement");
    XLSX.writeFile(wb, `Statement_${customer.name}.xlsx`);
};
