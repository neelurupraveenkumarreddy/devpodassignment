-- Database Schema for Construction Mini ERP (Enhanced)

CREATE DATABASE IF NOT EXISTS construction_erp;
USE construction_erp;

-- 1. Users & Roles
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Finance Manager', 'Project Manager') NOT NULL DEFAULT 'Project Manager',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    budget DECIMAL(15, 2) NOT NULL,
    spent DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('Active', 'Completed', 'On Hold') DEFAULT 'Active',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    progress_percent DECIMAL(5, 2) DEFAULT 0.00,
    report_date DATE NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 3. Enhanced Finance Module

-- Vendors & Customers
CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100),
    phone VARCHAR(20),
    type ENUM('Vendor', 'Customer') NOT NULL DEFAULT 'Vendor'
);

-- Multi-Currency Support
CREATE TABLE IF NOT EXISTS exchange_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency_code VARCHAR(3) NOT NULL, -- e.g., 'EUR', 'GBP'
    rate_to_base DECIMAL(10, 4) NOT NULL, -- Conversion rate to base currency (e.g., USD)
    effective_date DATE NOT NULL
);

-- GL Accounts
CREATE TABLE IF NOT EXISTS gl_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    type ENUM('Asset', 'Liability', 'Equity', 'Revenue', 'Expense') NOT NULL
);

-- Invoices (Updated)
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    vendor_id INT, -- Link to Vendor/Customer
    amount DECIMAL(15, 2) NOT NULL, -- In Base Currency
    original_amount DECIMAL(15, 2), -- In Original Currency
    currency VARCHAR(3) DEFAULT 'USD',
    due_date DATE NOT NULL,
    status ENUM('Pending', 'Paid', 'Overdue') DEFAULT 'Pending',
    type ENUM('Receivable', 'Payable') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS journal_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255),
    reference_id INT, -- Could link to invoice ID
    status ENUM('Draft', 'Posted') DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS journal_lines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    journal_entry_id INT NOT NULL,
    account_id INT NOT NULL,
    debit DECIMAL(15, 2) DEFAULT 0.00,
    credit DECIMAL(15, 2) DEFAULT 0.00,
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES gl_accounts(id) ON DELETE CASCADE
);

-- 4. AI Insights
CREATE TABLE IF NOT EXISTS risk_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    risk_score INT NOT NULL,
    risk_level ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Seed Data (Basic)
INSERT IGNORE INTO users (username, password_hash, role) VALUES 
('admin', '$2a$10$EpIxT98h/m1s.g/s.g/s.e/s.g/s.g/s.g/s.g/s.g', 'Admin');

INSERT IGNORE INTO gl_accounts (code, name, type) VALUES
('1000', 'Cash', 'Asset'),
('1200', 'Accounts Receivable', 'Asset'),
('2000', 'Accounts Payable', 'Liability'),
('4000', 'Construction Revenue', 'Revenue'),
('5000', 'Material Cost', 'Expense');

INSERT IGNORE INTO exchange_rates (currency_code, rate_to_base, effective_date) VALUES 
('EUR', 1.1000, CURDATE()),
('GBP', 1.2500, CURDATE()),
('INR', 0.0120, CURDATE());
