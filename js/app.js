// ======================================
// SS TEXTILE ERP V2
// APP CONTROLLER
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    initApp
);

// ======================================
// INIT
// ======================================

function initApp() {

    initializeInvoiceNumber();

    initializeDate();

    bindEvents();

    loadDashboard();

    loadInvoiceHistory();

    updateTotalsUI();
}

// ======================================
// EVENTS
// ======================================

function bindEvents() {

    // Add Item

    document
        .getElementById("addItemBtn")
        ?.addEventListener(
            "click",
            addInvoiceItem
        );

    // Save Customer

    document
        .getElementById("saveCustomerBtn")
        ?.addEventListener(
            "click",
            saveCurrentCustomer
        );

    // Save Invoice

    document
        .getElementById("saveInvoiceBtn")
        ?.addEventListener(
            "click",
            saveCurrentInvoice
        );

    // New Invoice

    document
        .getElementById("newInvoiceBtn")
        ?.addEventListener(
            "click",
            clearInvoiceForm
        );

    // Backup

    document
        .getElementById("backupBtn")
        ?.addEventListener(
            "click",
            createBackup
        );

    // Restore

    document
        .getElementById("restoreBtn")
        ?.addEventListener(
            "click",
            openRestoreDialog
        );

    // Print

    document
        .getElementById("printInvoiceBtn")
        ?.addEventListener(
            "click",
            printCurrentInvoice
        );

    // PDF

    document
        .getElementById("pdfInvoiceBtn")
        ?.addEventListener(
            "click",
            downloadCurrentPDF
        );

    // WhatsApp

    document
        .getElementById("whatsappBtn")
        ?.addEventListener(
            "click",
            shareCurrentInvoice
        );
}

// ======================================
// INVOICE NUMBER
// ======================================

function initializeInvoiceNumber() {

    const box =
        document.getElementById(
            "invoiceNo"
        );

    if (!box) return;

    box.value =
        generateInvoiceNumber();
}

// ======================================
// DATE
// ======================================

function initializeDate() {

    const box =
        document.getElementById(
            "invoiceDate"
        );

    if (!box) return;

    box.value =
        new Date()
        .toISOString()
        .slice(0, 10);
}

// ======================================
// SAVE CUSTOMER
// ======================================

function saveCurrentCustomer() {

    const customer = {

        name:
            document.getElementById(
                "customerName"
            ).value.trim(),

        mobile:
            document.getElementById(
                "customerMobile"
            ).value.trim(),

        gst:
            document.getElementById(
                "customerGST"
            ).value.trim(),

        address:
            document.getElementById(
                "customerAddress"
            ).value.trim()
    };

    if (!customer.name) {

        alert(
            "Customer name required"
        );

        return;
    }

    saveCustomer(customer);

    alert(
        "Customer saved successfully"
    );

    loadDashboard();
}

// ======================================
// SAVE INVOICE
// ======================================

function saveCurrentInvoice() {

    if (
        invoiceItems.length === 0
    ) {

        alert(
            "Please add at least one item"
        );

        return;
    }

    const invoice =
        buildInvoiceObject();

    saveInvoice(invoice);

    alert(
        `Invoice ${invoice.invoiceNo} saved`
    );

    loadInvoiceHistory();

    loadDashboard();

    clearInvoiceForm();
}

// ======================================
// DASHBOARD
// ======================================

function loadDashboard() {

    const stats =
        getDashboardStats();

    const sales =
        document.getElementById(
            "totalSalesCard"
        );

    const invoices =
        document.getElementById(
            "totalInvoicesCard"
        );

    const customers =
        document.getElementById(
            "totalCustomersCard"
        );

    const gst =
        document.getElementById(
            "totalGSTCard"
        );

    if (sales)
        sales.textContent =
            formatCurrency(
                stats.totalSales
            );

    if (invoices)
        invoices.textContent =
            stats.totalInvoices;

    if (customers)
        customers.textContent =
            stats.totalCustomers;

    if (gst)
        gst.textContent =
            formatCurrency(
                stats.totalGST
            );
}

// ======================================
// HISTORY
// ======================================

function loadInvoiceHistory() {

    const tbody =
        document.querySelector(
            "#historyTable tbody"
        );

    if (!tbody) return;

    tbody.innerHTML = "";

    const invoices =
        getInvoices();

    invoices.forEach(inv => {

        const tr =
            document.createElement(
                "tr"
            );

        tr.innerHTML = `

        <td>
            ${inv.invoiceNo}
        </td>

        <td>
            ${inv.date}
        </td>

        <td>
            ${inv.customerName}
        </td>

        <td>
            ${formatCurrency(inv.total)}
        </td>

        <td>

            <button
            onclick="viewInvoice('${inv.id}')">
            View
            </button>

            <button
            onclick="printSavedInvoice('${inv.id}')">
            Print
            </button>

            <button
            onclick="downloadSavedInvoicePDF('${inv.id}')">
            PDF
            </button>

            <button
            onclick="deleteSavedInvoice('${inv.id}')">
            Delete
            </button>

        </td>
        `;

        tbody.appendChild(tr);
    });
}

// ======================================
// VIEW
// ======================================

function viewInvoice(id) {

    const invoice =
        getInvoiceById(id);

    if (!invoice)
        return;

    const preview =
        document.getElementById(
            "invoicePrintArea"
        );

    preview.innerHTML =
        generateInvoiceHTML(
            invoice
        );

    preview.style.display =
        "block";

    preview.scrollIntoView({
        behavior: "smooth"
    });
}

// ======================================
// DELETE
// ======================================

function deleteSavedInvoice(id) {

    const ok =
        confirm(
            "Delete invoice?"
        );

    if (!ok) return;

    deleteInvoice(id);

    loadInvoiceHistory();

    loadDashboard();
}

// ======================================
// PRINT
// ======================================

function printSavedInvoice(id) {

    const invoice =
        getInvoiceById(id);

    if (!invoice)
        return;

    printInvoice(invoice);
}

function printCurrentInvoice() {

    if (
        invoiceItems.length === 0
    ) {

        alert(
            "Add items first"
        );

        return;
    }

    const invoice =
        buildInvoiceObject();

    printInvoice(invoice);
}

// ======================================
// PDF
// ======================================

function downloadSavedInvoicePDF(id) {

    const invoice =
        getInvoiceById(id);

    if (!invoice)
        return;

    downloadInvoicePDF(invoice);
}

function downloadCurrentPDF() {

    if (
        invoiceItems.length === 0
    ) {

        alert(
            "Add items first"
        );

        return;
    }

    const invoice =
        buildInvoiceObject();

    downloadInvoicePDF(invoice);
}

// ======================================
// RESTORE
// ======================================

function openRestoreDialog() {

    const input =
        document.createElement(
            "input"
        );

    input.type = "file";

    input.accept = ".json";

    input.onchange =
        async function(e) {

        const file =
            e.target.files[0];

        if (!file)
            return;

        try {

            await restoreBackup(
                file
            );

            alert(
                "Backup restored"
            );

            loadDashboard();

            loadInvoiceHistory();

            initializeInvoiceNumber();

        }

        catch {

            alert(
                "Invalid backup file"
            );
        }
    };

    input.click();
}

// ======================================
// WHATSAPP
// ======================================

function shareCurrentInvoice() {

    if (
        invoiceItems.length === 0
    ) {

        alert(
            "Add items first"
        );

        return;
    }

    const invoice =
        buildInvoiceObject();

    const text =

`Invoice No: ${invoice.invoiceNo}
Customer: ${invoice.customerName}
Amount: ₹${invoice.total.toFixed(2)}

Thank you for choosing SS Textile.`;

    window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank"
    );
}

// ======================================
// GLOBAL
// ======================================

window.viewInvoice =
    viewInvoice;

window.deleteSavedInvoice =
    deleteSavedInvoice;

window.printSavedInvoice =
    printSavedInvoice;

window.downloadSavedInvoicePDF =
    downloadSavedInvoicePDF;
