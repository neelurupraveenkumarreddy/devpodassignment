const db = require('../config/db');

// Chart of Accounts
exports.getAccounts = async (req, res) => {
    try {
        const [accounts] = await db.query('SELECT * FROM gl_accounts ORDER BY code');
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createAccount = async (req, res) => {
    const { code, name, type } = req.body;
    try {
        await db.query('INSERT INTO gl_accounts (code, name, type) VALUES (?, ?, ?)', [code, name, type]);
        res.status(201).json({ message: 'Account created' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Journal Entries
exports.getJournalEntries = async (req, res) => {
    try {
        const [entries] = await db.query(`
            SELECT je.id, je.date, je.description, je.status,
                   jl.account_id, ga.name as account_name, jl.debit, jl.credit
            FROM journal_entries je
            JOIN journal_lines jl ON je.id = jl.journal_entry_id
            JOIN gl_accounts ga ON jl.account_id = ga.id
            ORDER BY je.date DESC, je.id
        `);
        // Grouping lines by entry could be done here or on frontend
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createJournalEntry = async (req, res) => {
    const { date, description, lines } = req.body; // lines: [{ account_id, debit, credit }]

    // Validate Total Debit == Total Credit
    const totalDebit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
        return res.status(400).json({ message: 'Journal Entry is out of balance' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO journal_entries (date, description, status) VALUES (?, ?, "Posted")', [date, description]);
        const entryId = result.insertId;

        for (const line of lines) {
            await connection.query('INSERT INTO journal_lines (journal_entry_id, account_id, debit, credit) VALUES (?, ?, ?, ?)',
                [entryId, line.account_id, line.debit || 0, line.credit || 0]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Journal Entry posted' });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

// Financial Statements (Simplified)
exports.getBalanceSheet = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT ga.type, ga.name, SUM(jl.debit) as total_debit, SUM(jl.credit) as total_credit
            FROM gl_accounts ga
            LEFT JOIN journal_lines jl ON ga.id = jl.account_id
            GROUP BY ga.id
        `);

        const structured = { Assets: [], Liabilities: [], Equity: [], Revenue: [], Expenses: [] };

        rows.forEach(row => {
            const balance = row.type === 'Asset' || row.type === 'Expense'
                ? (row.total_debit - row.total_credit)
                : (row.total_credit - row.total_debit);

            if (structured[row.type]) {
                structured[row.type].push({ name: row.name, balance: balance || 0 });
            }
        });

        res.json(structured);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
