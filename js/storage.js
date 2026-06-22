// ======================================
// SS TEXTILE ERP V2
// STORAGE MODULE
// ======================================

const STORAGE_KEYS = {

    invoices: "ss_v2_invoices",

    customers: "ss_v2_customers",

    products: "ss_v2_products",

    settings: "ss_v2_settings"
};

// ======================================
// GENERIC HELPERS
// ======================================

function getData(key) {

    try {

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    } catch {

        return [];
    }
}

function setData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );
}

// ======================================
// INVOICE
// ======================================

function getInvoices() {

    return getData(
        STORAGE_KEYS.invoices
    );
}

function saveInvoice(invoice) {

    const invoices =
        getInvoices();

    invoices.unshift(invoice);

    setData(
        STORAGE_KEYS.invoices,
        invoices
    );

    return invoice;
}

function updateInvoice(id, updatedInvoice) {

    const invoices =
        getInvoices();

    const index =
        invoices.findIndex(
            inv => inv.id === id
        );

    if (index === -1)
        return false;

    invoices[index] =
        updatedInvoice;

    setData(
        STORAGE_KEYS.invoices,
        invoices
    );

    return true;
}

function deleteInvoice(id) {

    const invoices =
        getInvoices();

    const filtered =
        invoices.filter(
            inv => inv.id !== id
        );

    setData(
        STORAGE_KEYS.invoices,
        filtered
    );
}

function getInvoiceById(id) {

    return getInvoices()
        .find(
            inv => inv.id === id
        );
}

// ======================================
// CUSTOMER
// ======================================

function getCustomers() {

    return getData(
        STORAGE_KEYS.customers
    );
}

function saveCustomer(customer) {

    const customers =
        getCustomers();

    const exists =
        customers.find(
            c =>
            c.mobile ===
            customer.mobile
        );

    if (exists)
        return;

    customers.unshift(customer);

    setData(
        STORAGE_KEYS.customers,
        customers
    );
}

function deleteCustomer(mobile) {

    const customers =
        getCustomers();

    const filtered =
        customers.filter(
            c =>
            c.mobile !== mobile
        );

    setData(
        STORAGE_KEYS.customers,
        filtered
    );
}

// ======================================
// PRODUCT
// ======================================

function getProducts() {

    return getData(
        STORAGE_KEYS.products
    );
}

function saveProduct(product) {

    const products =
        getProducts();

    products.unshift(product);

    setData(
        STORAGE_KEYS.products,
        products
    );
}

function deleteProduct(id) {

    const products =
        getProducts();

    const filtered =
        products.filter(
            p => p.id !== id
        );

    setData(
        STORAGE_KEYS.products,
        filtered
    );
}

// ======================================
// SETTINGS
// ======================================

function getSettings() {

    const data =
        localStorage.getItem(
            STORAGE_KEYS.settings
        );

    if (!data) {

        return {

            companyName:
                "S S TEXTILE",

            gstin:
                "",

            address:
                "",

            phone:
                "",

            email:
                ""
        };
    }

    return JSON.parse(data);
}

function saveSettings(settings) {

    localStorage.setItem(

        STORAGE_KEYS.settings,

        JSON.stringify(
            settings
        )
    );
}

// ======================================
// DASHBOARD
// ======================================

function getDashboardStats() {

    const invoices =
        getInvoices();

    let totalSales = 0;

    let totalGST = 0;

    invoices.forEach(inv => {

        totalSales +=
            Number(
                inv.total || 0
            );

        totalGST +=

            Number(
                inv.cgst || 0
            ) +

            Number(
                inv.sgst || 0
            ) +

            Number(
                inv.igst || 0
            );
    });

    return {

        totalSales,

        totalGST,

        totalInvoices:
            invoices.length,

        totalCustomers:
            getCustomers().length
    };
}

// ======================================
// INVOICE NUMBER
// ======================================

function generateInvoiceNumber() {

    const invoices =
        getInvoices();

    const year =
        new Date()
        .getFullYear();

    const nextNo =
        invoices.length + 1;

    return `SST-${year}-${String(
        nextNo
    ).padStart(4, "0")}`;
}

// ======================================
// BACKUP
// ======================================

function createBackup() {

    const backup = {

        createdAt:
            new Date()
            .toISOString(),

        invoices:
            getInvoices(),

        customers:
            getCustomers(),

        products:
            getProducts(),

        settings:
            getSettings()
    };

    const blob =
        new Blob(

            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],

            {
                type:
                "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const a =
        document.createElement(
            "a"
        );

    a.href = url;

    a.download =
        `ss-textile-backup-${Date.now()}.json`;

    a.click();

    URL.revokeObjectURL(
        url
    );
}

// ======================================
// RESTORE
// ======================================

async function restoreBackup(file) {

    const text =
        await file.text();

    const backup =
        JSON.parse(text);

    if (backup.invoices) {

        setData(
            STORAGE_KEYS.invoices,
            backup.invoices
        );
    }

    if (backup.customers) {

        setData(
            STORAGE_KEYS.customers,
            backup.customers
        );
    }

    if (backup.products) {

        setData(
            STORAGE_KEYS.products,
            backup.products
        );
    }

    if (backup.settings) {

        saveSettings(
            backup.settings
        );
    }

    return true;
}
