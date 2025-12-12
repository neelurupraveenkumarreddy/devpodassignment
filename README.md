# Construction Mini ERP

A comprehensive financial and project management ERP system tailored for the construction industry. This application helps manage projects, track invoices, handle general ledger accounting, and visualize financial health.

## Features

- **Project Management**: Create and track projects, set budgets, and monitor real-time progress.
- **Financial Module**:
    - **Invoicing**: Create receivables and payables in multiple currencies (USD, EUR, GBP, INR).
    - **General Ledger**: Manage Chart of Accounts, post Journal Entries, and view Balance Sheets.
    - **Cash Flow**: Real-time tracking of inflow vs. outflow.
- **Dashboard**: Visual KPI cards, Revenue charts, and AI-driven Risk Analysis.
- **Mobile Responsive**: Fully optimized for mobile devices with responsive forms and scrollable tables.

## Tech Stack

- **Frontend**: React (Class Components), Vite, Chart.js
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14+ recommended)
- MySQL Server

## Setup Instructions

### 1. Database Setup
1. Create a MySQL database named `construction_erp` (or as preferred).
2. Run the schema script located at `server/schema.sql` to create tables and seed initial data.

### 2. Backend Configuration
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create a `.env` file (copy `.env.example` if available) and add your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=construction_erp
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
3. Install dependencies and run the server:
   ```bash
   npm install
   npm start
   ```

### 3. Frontend Configuration
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Create a `.env` file and configure the backend URL:
   ```env
   VITE_BASE_URL=http://localhost:5000/api
   ```
3. Install dependencies and run the client:
   ```bash
   npm install
   npm run dev
   ```

