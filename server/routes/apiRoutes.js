const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboardStats, getProjects, createProject, updateProjectStatus, getInvoices, createInvoice, updateInvoiceStatus } = require('../controllers/financeController');
const { getRiskAnalysis } = require('../controllers/insightController');
const { getAccounts, createAccount, getJournalEntries, createJournalEntry, getBalanceSheet } = require('../controllers/glController');
const { getVendors, createVendor } = require('../controllers/vendorController');


// All routes here are protected
router.use(authMiddleware);

router.get('/dashboard', getDashboardStats);
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.patch('/projects/:id/status', updateProjectStatus);
router.patch('/projects/:id/status', updateInvoiceStatus); // Re-using the generic update pattern, actually need to export new function first. Wait, I should import it.

router.get('/invoices', getInvoices);
router.post('/invoices', createInvoice);
router.patch('/invoices/:id/status', updateInvoiceStatus);

// GL Routes
router.get('/gl/accounts', getAccounts);
router.post('/gl/accounts', createAccount);
router.get('/gl/journals', getJournalEntries);
router.post('/gl/journals', createJournalEntry);
router.get('/gl/reports/balance-sheet', getBalanceSheet);

// Vendor Routes
router.get('/vendors', getVendors);
router.post('/vendors', createVendor);

router.get('/insights/risk', getRiskAnalysis);

module.exports = router;
