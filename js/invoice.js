// ======================================
// SS TEXTILE ERP V2
// INVOICE MODULE
// ======================================

let invoiceItems = [];

// ======================================
// ADD ITEM
// ======================================

function addInvoiceItem() {

    const description =
        document.getElementById("itemDescription").value.trim();

    const hsn =
        document.getElementById("itemHSN").value.trim();

    const qty =
        Number(
            document.getElementById("itemQty").value
        );

    const rate =
        Number(
            document.getElementById("itemRate").value
        );

    const gst =
        Number(
            document.getElementById("itemGST").value
        );

    if (
        !description ||
        qty <= 0 ||
        rate <= 0
    ) {
        alert(
            "Please enter valid item details"
        );
        return;
    }

    const item = {

        id:
            Date.now().toString(),

        description,

        hsn,

        qty,

        rate,

        gst,

        amount:
            qty * rate
    };

    invoiceItems.push(item);

    renderItemsTable();

    updateTotalsUI();

    clearItemInputs();
}

// ======================================
// CLEAR ITEM INPUTS
// ======================================

function clearItemInputs() {

    document.getElementById(
        "itemDescription"
    ).value = "";

    document.getElementById(
        "itemHSN"
    ).value = "";

    document.getElementById(
        "itemQty"
    ).value = "";

    document.getElementById(
        "itemRate"
    ).value = "";

    document.getElementById(
        "itemGST"
    ).selectedIndex = 0;
}

// ======================================
// REMOVE ITEM
// ======================================

function removeInvoiceItem(id) {

    invoiceItems =
        invoiceItems.filter(
            item => item.id !== id
        );

    renderItemsTable();

    updateTotalsUI();
}

// ======================================
// RENDER TABLE
// ======================================

function renderItemsTable() {

    const tbody =
        document.querySelector(
            "#itemsTable tbody"
        );

    if (!tbody)
        return;

    tbody.innerHTML = "";

    invoiceItems.forEach(
        (item, index) => {

        const tr =
            document.createElement("tr");

        tr.innerHTML = `

        <td>${index + 1}</td>

        <td>${item.description}</td>

        <td>${item.hsn}</td>

        <td>${item.qty}</td>

        <td>₹${item.rate.toFixed(2)}</td>

        <td>
            ₹${item.amount.toFixed(2)}
        </td>

        <td>

            <button
            onclick="removeInvoiceItem('${item.id}')">

            Remove

            </button>

        </td>
        `;

        tbody.appendChild(tr);
    });
}

// ======================================
// GST CALCULATION
// ======================================

function calculateInvoiceTotals() {

    let subtotal = 0;

    let totalGST = 0;

    invoiceItems.forEach(item => {

        subtotal += item.amount;

        totalGST +=
            item.amount *
            item.gst /
            100;
    });

    const cgst =
        totalGST / 2;

    const sgst =
        totalGST / 2;

    const total =
        subtotal +
        totalGST;

    return {

        subtotal,

        cgst,

        sgst,

        igst: 0,

        total
    };
}

// ======================================
// TOTAL UI
// ======================================

function updateTotalsUI() {

    const totals =
        calculateInvoiceTotals();

    const subtotal =
        document.getElementById(
            "subtotal"
        );

    const cgst =
        document.getElementById(
            "cgst"
        );

    const sgst =
        document.getElementById(
            "sgst"
        );

    const grandTotal =
        document.getElementById(
            "grandTotal"
        );

    if (subtotal)
        subtotal.textContent =
            formatCurrency(
                totals.subtotal
            );

    if (cgst)
        cgst.textContent =
            formatCurrency(
                totals.cgst
            );

    if (sgst)
        sgst.textContent =
            formatCurrency(
                totals.sgst
            );

    if (grandTotal)
        grandTotal.textContent =
            formatCurrency(
                totals.total
            );
}

// ======================================
// BUILD INVOICE
// ======================================

function buildInvoiceObject() {

    const totals =
        calculateInvoiceTotals();

    return {

        id:
            Date.now()
            .toString(),

        invoiceNo:
            document.getElementById(
                "invoiceNo"
            ).value,

        date:
            document.getElementById(
                "invoiceDate"
            ).value,

        customerName:
            document.getElementById(
                "customerName"
            ).value,

        customerMobile:
            document.getElementById(
                "customerMobile"
            ).value,

        customerGST:
            document.getElementById(
                "customerGST"
            ).value,

        customerAddress:
            document.getElementById(
                "customerAddress"
            ).value,

        paymentTerms:
            document.getElementById(
                "paymentTerms"
            ).value,

        deliveryType:
            document.getElementById(
                "deliveryType"
            ).value,

        items:
            [...invoiceItems],

        subtotal:
            totals.subtotal,

        cgst:
            totals.cgst,

        sgst:
            totals.sgst,

        igst:
            totals.igst,

        total:
            totals.total,

        createdAt:
            new Date()
            .toISOString()
    };
}

// ======================================
// CLEAR FORM
// ======================================

function clearInvoiceForm() {

    invoiceItems = [];

    renderItemsTable();

    updateTotalsUI();

    document.getElementById(
        "customerName"
    ).value = "";

    document.getElementById(
        "customerMobile"
    ).value = "";

    document.getElementById(
        "customerGST"
    ).value = "";

    document.getElementById(
        "customerAddress"
    ).value = "";

    document.getElementById(
        "invoiceNo"
    ).value =
        generateInvoiceNumber();

    initializeDate();
}

// ======================================
// FORMAT
// ======================================

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }
    ).format(value || 0);
}

// ======================================
// NUMBER TO WORDS
// ======================================

function numberToWords(amount) {

    const formatter =
        new Intl.NumberFormat(
            "en-IN"
        );

    return (
        formatter.format(
            Math.round(amount)
        ) +
        " Rupees Only"
    );
}

// ======================================
// PREMIUM HTML
// ======================================

function generateInvoiceHTML(invoice) {

    const itemRows =
        invoice.items.map(
        (item, index) => {

        return `
        <tr>

            <td>${index + 1}</td>

            <td>${item.description}</td>

            <td>${item.hsn}</td>

            <td>${item.qty}</td>

            <td>${item.rate}</td>

            <td>${item.gst}%</td>

            <td>${item.amount.toFixed(2)}</td>

        </tr>
        `;
    }).join("");

    return `

<div class="invoice-page">

<div class="premium-header">

<div>

<img
src="assets/logo.png"
class="invoice-logo">

</div>

<div class="header-right">

<h1>
S S TEXTILE
</h1>

<p>
GSTIN : 24BRXPM6996G1ZT
</p>

<p>
Umbergaon, Gujarat
</p>

</div>

</div>

<div class="invoice-title-bar">

TAX INVOICE

</div>

<div class="invoice-detail-grid">

<div class="invoice-card">

<h4>
BILL TO
</h4>

<p>
${invoice.customerName}
</p>

<p>
${invoice.customerAddress}
</p>

<p>
${invoice.customerMobile}
</p>

</div>

<div class="invoice-card">

<h4>
INVOICE DETAILS
</h4>

<p>
Invoice :
${invoice.invoiceNo}
</p>

<p>
Date :
${invoice.date}
</p>

<p>
Payment :
${invoice.paymentTerms}
</p>

</div>

</div>

<table class="premium-table">

<thead>

<tr>

<th>#</th>
<th>Description</th>
<th>HSN</th>
<th>Qty</th>
<th>Rate</th>
<th>GST</th>
<th>Amount</th>

</tr>

</thead>

<tbody>

${itemRows}

</tbody>

</table>

<div class="summary-grid">

<div class="amount-word-box">

<h4>
Amount In Words
</h4>

<p>
${numberToWords(invoice.total)}
</p>

</div>

<div class="total-box">

<div>

<span>
Subtotal
</span>

<span>
₹${invoice.subtotal.toFixed(2)}
</span>

</div>

<div>

<span>
CGST
</span>

<span>
₹${invoice.cgst.toFixed(2)}
</span>

</div>

<div>

<span>
SGST
</span>

<span>
₹${invoice.sgst.toFixed(2)}
</span>

</div>

<div class="grand-row">

<span>
TOTAL
</span>

<span>
₹${invoice.total.toFixed(2)}
</span>

</div>

</div>

</div>

</div>
`;
}

// ======================================
// GLOBAL
// ======================================

window.removeInvoiceItem =
    removeInvoiceItem;
