// ======================================
// SS TEXTILE ERP V2
// PDF MODULE
// ======================================

// ======================================
// PRINT
// ======================================

function printInvoice(invoice) {

    const area =
        document.getElementById(
            "invoicePrintArea"
        );

    area.innerHTML =
        generateInvoiceHTML(
            invoice
        );

    area.style.display =
        "block";

    window.print();
}

// ======================================
// PDF
// ======================================

async function downloadInvoicePDF(invoice) {

    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.innerHTML =
        generateInvoiceHTML(
            invoice
        );

    document.body.appendChild(
        wrapper
    );

    const invoiceNode =
        wrapper.querySelector(
            ".invoice-page"
        );

    const options = {

        margin: 5,

        filename:
            `${invoice.invoiceNo}.pdf`,

        image: {

            type: "jpeg",

            quality: 1
        },

        html2canvas: {

            scale: 2,

            useCORS: true
        },

        jsPDF: {

            unit: "mm",

            format: "a4",

            orientation: "portrait"
        }
    };

    try {

        await html2pdf()
            .set(options)
            .from(invoiceNode)
            .save();

    } catch (error) {

        console.error(error);

        alert(
            "PDF generation failed"
        );

    } finally {

        document.body.removeChild(
            wrapper
        );
    }
}

// ======================================
// CURRENT PDF
// ======================================

function downloadCurrentPDF() {

    if (
        typeof invoiceItems !==
        "undefined" &&
        invoiceItems.length === 0
    ) {

        alert(
            "Add at least one item"
        );

        return;
    }

    const invoice =
        buildInvoiceObject();

    downloadInvoicePDF(
        invoice
    );
}

// ======================================
// WHATSAPP
// ======================================

function shareInvoiceWhatsApp(
    invoice
) {

    const message =

`🧾 SS TEXTILE

Invoice No : ${invoice.invoiceNo}

Customer : ${invoice.customerName}

Amount : ₹${invoice.total.toFixed(2)}

Date : ${invoice.date}

Thank you for your business.`;

    window.open(

        `https://wa.me/?text=${encodeURIComponent(message)}`,

        "_blank"
    );
}

// ======================================
// CURRENT SHARE
// ======================================

function shareCurrentInvoice() {

    if (
        typeof invoiceItems !==
        "undefined" &&
        invoiceItems.length === 0
    ) {

        alert(
            "Add at least one item"
        );

        return;
    }

    const invoice =
        buildInvoiceObject();

    shareInvoiceWhatsApp(
        invoice
    );
}

// ======================================
// SAVED SHARE
// ======================================

function shareSavedInvoice(
    id
) {

    const invoice =
        getInvoiceById(id);

    if (!invoice)
        return;

    shareInvoiceWhatsApp(
        invoice
    );
}
