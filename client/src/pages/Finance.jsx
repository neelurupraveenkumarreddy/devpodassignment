import React, { Component } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class Finance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: [],
            projects: [],
            vendors: [],
            newInvoice: {
                project_id: '',
                vendor_id: '',
                amount: '',
                currency: 'USD',
                due_date: '',
                type: 'Receivable'
            }
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const invRes = await fetch(`${BASE_URL}/invoices`, { headers: { Authorization: `Bearer ${token}` } });
            const projRes = await fetch(`${BASE_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } });
            const vendRes = await fetch(`${BASE_URL}/vendors`, { headers: { Authorization: `Bearer ${token}` } });

            this.setState({
                invoices: await invRes.json(),
                projects: await projRes.json(),
                vendors: await vendRes.json()
            });
        } catch (err) {
            console.error(err);
        }
    };

    updateStatus = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${BASE_URL}/invoices/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            this.fetchData();
        } catch (err) { console.error(err); }
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            newInvoice: { ...prevState.newInvoice, [name]: value }
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BASE_URL}/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(this.state.newInvoice)
            });
            if (res.ok) {
                this.fetchData(); // Reload
                this.setState({ newInvoice: { project_id: '', vendor_id: '', amount: '', currency: 'USD', due_date: '', type: 'Receivable' } });
            }
        } catch (err) {
            console.error(err);
        }
    };

    render() {
        const { invoices, projects, newInvoice } = this.state;
        return (
            <div>
                <h1>Finance & Invoices</h1>

                <div className="card">
                    <h3>Create New Invoice</h3>
                    <form onSubmit={this.handleSubmit} className="responsive-form">
                        <select name="project_id" value={newInvoice.project_id} onChange={this.handleInputChange} required>
                            <option value="">Select Project</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>

                        <select name="vendor_id" value={newInvoice.vendor_id} onChange={this.handleInputChange}>
                            <option value="">Select Vendor/Customer</option>
                            {this.state.vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>

                        <input type="number" name="amount" placeholder="Amount" value={newInvoice.amount} onChange={this.handleInputChange} required />

                        <select name="currency" value={newInvoice.currency} onChange={this.handleInputChange}>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="INR">INR</option>
                        </select>

                        <input type="date" name="due_date" value={newInvoice.due_date} onChange={this.handleInputChange} required />
                        <select name="type" value={newInvoice.type} onChange={this.handleInputChange}>
                            <option value="Receivable">Receivable</option>
                            <option value="Payable">Payable</option>
                        </select>
                        <button type="submit" style={{ gridColumn: 'span 1' }}>Create Invoice</button>
                    </form>
                </div>

                <div className="card">
                    <h3>Recent Invoices</h3>
                    <div className="table-wrapper">
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr style={{ textAlign: 'left' }}><th>ID</th><th>Project</th><th>Vendor</th><th>Type</th><th>Amount (Base)</th><th>Currency</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {invoices.map(inv => (
                                    <tr key={inv.id}>
                                        <td>{inv.id}</td>
                                        <td>{inv.project_id}</td>
                                        <td>{inv.vendor_id}</td>
                                        <td>{inv.type}</td>
                                        <td>${inv.amount}</td>
                                        <td>{inv.currency || 'USD'}</td>
                                        <td style={{ color: inv.status === 'Paid' ? 'green' : 'orange' }}>{inv.status}</td>
                                        <td>
                                            {inv.status !== 'Paid' && (
                                                <button onClick={() => this.updateStatus(inv.id, 'Paid')} style={{ padding: '5px', fontSize: '0.8em' }}>Mark Paid</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Finance;
