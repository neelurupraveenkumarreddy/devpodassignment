const db = require('../config/db');

exports.getVendors = async (req, res) => {
    try {
        const [vendors] = await db.query('SELECT * FROM vendors');
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createVendor = async (req, res) => {
    const { name, contact_email, type } = req.body;
    try {
        await db.query('INSERT INTO vendors (name, contact_email, type) VALUES (?, ?, ?)', [name, contact_email, type]);
        res.status(201).json({ message: 'Vendor/Customer created' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
