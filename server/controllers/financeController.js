const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [projectCount] = await db.query('SELECT COUNT(*) as count FROM projects');
        const [invoiceStats] = await db.query('SELECT SUM(amount) as totalRevenue FROM invoices WHERE type="Receivable" AND status="Paid"');

        // Real Cash Flow: Total Paid In (Receivables) - Total Paid Out (Payables)
        const [inflow] = await db.query('SELECT SUM(amount) as total FROM invoices WHERE type="Receivable" AND status="Paid"');
        const [outflow] = await db.query('SELECT SUM(amount) as total FROM invoices WHERE type="Payable" AND status="Paid"');

        const netFlow = (inflow[0].total || 0) - (outflow[0].total || 0);

        res.json({
            totalProjects: projectCount[0].count,
            totalRevenue: invoiceStats[0].totalRevenue || 0,
            cashFlowStatus: netFlow >= 0 ? `Positive (+$${netFlow})` : `Negative (-$${Math.abs(netFlow)})`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createProject = async (req, res) => {
    const { name, budget, start_date } = req.body;
    try {
        await db.query('INSERT INTO projects (name, budget, start_date) VALUES (?, ?, ?)', [name, budget, start_date]);
        res.status(201).json({ message: 'Project created' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProjectStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'Active', 'Completed', 'On Hold'
    try {
        await db.query('UPDATE projects SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Project status updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getInvoices = async (req, res) => {
    try {
        const [invoices] = await db.query('SELECT * FROM invoices');
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createInvoice = async (req, res) => {
    const { project_id, vendor_id, amount, currency, due_date, type } = req.body;

    let finalAmount = amount;
    let originalAmount = amount;
    let rate = 1;

    try {
        // Multi-currency Logic
        if (currency && currency !== 'USD') {
            const [rates] = await db.query('SELECT rate_to_base FROM exchange_rates WHERE currency_code = ? ORDER BY effective_date DESC LIMIT 1', [currency]);
            if (rates.length > 0) {
                rate = rates[0].rate_to_base;
                finalAmount = amount * rate;
            }
        }

        await db.query('INSERT INTO invoices (project_id, vendor_id, amount, original_amount, currency, due_date, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [project_id, vendor_id, finalAmount, originalAmount, currency || 'USD', due_date, type]);

        res.status(201).json({ message: 'Invoice created', conversion: { rate, finalAmount } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateInvoiceStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'Paid', 'Pending'
    try {
        await db.query('UPDATE invoices SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Invoice status updated' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
