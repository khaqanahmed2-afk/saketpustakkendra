export const VYAPAR_CONFIG = {
    customers: {
        requiredColumns: ["Party Name", "Mobile No"],
        mappings: {
            name: ["Party Name", "Customer Name"],
            mobile: ["Mobile No", "Phone Number", "Contact"],
            // Add other fields as necessary
            gstin: ["GSTIN"],
            email: ["Email ID"],
            address: ["Billing Address"]
        }
    },
    products: {
        requiredColumns: ["Item Name"],
        mappings: {
            name: ["Item Name", "Product Name"],
            code: ["Item Code", "Product Code", "SKU"],
            price: ["Sales Price", "Rate", "Price"],
            stock: ["Current Stock", "Stock Quantity", "Quantity"],
            hsn: ["HSN Code"]
        }
    },
    invoices: {
        requiredColumns: ["Bill No", "Party Name", "Total"],
        mappings: {
            invoiceNo: ["Bill No", "Invoice No"],
            customerName: ["Party Name", "Customer Name"], // Used for lookup
            date: ["Bill Date", "Date", "Invoice Date"],
            totalAmount: ["Total", "Grand Total", "Invoice Amount"],
            paidAmount: ["Paid", "Received", "Payment Received"],
            balanceAmount: ["Balance", "Due", "Remaining Amount"],
            status: ["Payment Status", "Status"] // Optional, defaults to paid if missing or partial
        },
        // Invoices are complex; we typically assume one row per invoice in a summary sheet, 
        // or multiple rows for items. For simplicity, we'll assume a "Sales Report" style export 
        // which usually lists one invoice per row, or an "Item Wise" report.
        // We will start with "Sales Report" logic (Head-level).
        // Future: Handle item-level details.
    }
};
