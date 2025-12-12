import React, { Component } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class GeneralLedger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'accounts',
            accounts: [],
            journals: [],
            newAccount: { code: '', name: '', type: 'Asset' },
            balanceSheet: [],
            newJournal: {
                date: '',
                description: '',
                lines: [{ account_id: '', debit: '', credit: '' }]
            },
            journalError: ''
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const accRes = await fetch(`${BASE_URL}/gl/accounts`, { headers });
            const jourRes = await fetch(`${BASE_URL}/gl/journals`, { headers });
            const bsRes = await fetch(`${BASE_URL}/gl/reports/balance-sheet`, { headers });

            this.setState({
                accounts: await accRes.json(),
                journals: await jourRes.json(),
                balanceSheet: await bsRes.json()
            });
        } catch (err) {
            console.error(err);
        }
    };

    handleAccountSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await fetch(`${BASE_URL}/gl/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(this.state.newAccount)
            });
            this.fetchData();
        } catch (err) { console.error(err); }
    };

    handleJournalSubmit = async (e) => {
        e.preventDefault();
        const { newJournal } = this.state;
        const totalDebit = newJournal.lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
        const totalCredit = newJournal.lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);

        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            this.setState({ journalError: 'Total Debit and Credit must match!' });
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BASE_URL}/gl/journals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newJournal)
            });
            if (res.ok) {
                this.fetchData();
                this.setState({
                    newJournal: { date: '', description: '', lines: [{ account_id: '', debit: '', credit: '' }] },
                    journalError: ''
                });
            } else {
                const data = await res.json();
                this.setState({ journalError: data.message });
            }
        } catch (err) { console.error(err); }
    };

    handleAddLine = () => {
        this.setState(prevState => ({
            newJournal: {
                ...prevState.newJournal,
                lines: [...prevState.newJournal.lines, { account_id: '', debit: '', credit: '' }]
            }
        }));
    };

    handleLineChange = (index, field, value) => {
        const lines = [...this.state.newJournal.lines];
        lines[index][field] = value;
        this.setState(prevState => ({
            newJournal: { ...prevState.newJournal, lines }
        }));
    };

    render() {
        const { activeTab, accounts, journals, balanceSheet, newAccount } = this.state;

        return (
            <div>
                <h1>General Ledger</h1>
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={() => this.setState({ activeTab: 'accounts' })} style={{ marginRight: '10px' }}>Chart of Accounts</button>
                    <button onClick={() => this.setState({ activeTab: 'journals' })} style={{ marginRight: '10px' }}>Journal Entries</button>
                    <button onClick={() => this.setState({ activeTab: 'reports' })}>Financial Reports</button>
                </div>

                {activeTab === 'accounts' && (
                    <div className="card">
                        <h3>Chart of Accounts</h3>
                        <form onSubmit={this.handleAccountSubmit} className="responsive-form" style={{ marginBottom: '20px' }}>
                            <input type="text" placeholder="Code" value={newAccount.code} onChange={e => this.setState({ newAccount: { ...newAccount, code: e.target.value } })} />
                            <input type="text" placeholder="Name" value={newAccount.name} onChange={e => this.setState({ newAccount: { ...newAccount, name: e.target.value } })} />
                            <select value={newAccount.type} onChange={e => this.setState({ newAccount: { ...newAccount, type: e.target.value } })}>
                                <option value="Asset">Asset</option>
                                <option value="Liability">Liability</option>
                                <option value="Equity">Equity</option>
                                <option value="Revenue">Revenue</option>
                                <option value="Expense">Expense</option>
                            </select>
                            <button type="submit">Add</button>
                        </form>
                        <ul>
                            {accounts.map(acc => <li key={acc.id}>{acc.code} - {acc.name} ({acc.type})</li>)}
                        </ul>
                    </div>
                )}

                {activeTab === 'journals' && (
                    <div className="card">
                        <h3>Create Journal Entry</h3>
                        {this.state.journalError && <p style={{ color: 'red' }}>{this.state.journalError}</p>}
                        <form onSubmit={this.handleJournalSubmit} style={{ marginBottom: '20px' }}>
                            <div className="responsive-form" style={{ marginBottom: '10px' }}>
                                <input type="date" value={this.state.newJournal.date} onChange={e => this.setState({ newJournal: { ...this.state.newJournal, date: e.target.value } })} required />
                                <input type="text" placeholder="Description" value={this.state.newJournal.description} onChange={e => this.setState({ newJournal: { ...this.state.newJournal, description: e.target.value } })} required />
                            </div>

                            <h4>Lines</h4>
                            {this.state.newJournal.lines.map((line, idx) => (
                                <div key={idx} className="responsive-form" style={{ marginBottom: '5px' }}>
                                    <select value={line.account_id} onChange={e => this.handleLineChange(idx, 'account_id', e.target.value)} required>
                                        <option value="">Select Account</option>
                                        {this.state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.code})</option>)}
                                    </select>
                                    <input type="number" placeholder="Debit" value={line.debit} onChange={e => this.handleLineChange(idx, 'debit', e.target.value)} />
                                    <input type="number" placeholder="Credit" value={line.credit} onChange={e => this.handleLineChange(idx, 'credit', e.target.value)} />
                                </div>
                            ))}
                            <button type="button" onClick={this.handleAddLine} style={{ marginRight: '10px', background: '#64748b' }}>+ Add Line</button>
                            <button type="submit">Post Entry</button>
                        </form>

                        <h3>Posted Journal Entries</h3>
                        <div className="table-wrapper">
                            <table style={{ width: '100%' }}>
                                <thead><tr><th>Date</th><th>Description</th><th>Account</th><th>Debit</th><th>Credit</th></tr></thead>
                                <tbody>
                                    {journals.map(j => (
                                        <tr key={Math.random()}>
                                            <td>{new Date(j.date).toLocaleDateString()}</td>
                                            <td>{j.description}</td>
                                            <td>{j.account_name}</td>
                                            <td>{j.debit > 0 ? j.debit : '-'}</td>
                                            <td>{j.credit > 0 ? j.credit : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="card">
                        <h3>Balance Sheet</h3>
                        <div className="responsive-form" style={{ gap: '20px', alignItems: 'start' }}>
                            <div>
                                <h4 style={{ borderBottom: '2px solid green' }}>Assets</h4>
                                <ul>
                                    {balanceSheet.Assets?.length > 0 ? (
                                        balanceSheet.Assets.map((item, idx) => (
                                            <li key={idx}>{item.name}: ${item.balance}</li>
                                        ))
                                    ) : (
                                        <li>No Assets</li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ borderBottom: '2px solid red' }}>Liabilities & Equity</h4>
                                <h5>Liabilities</h5>
                                <ul>
                                    {balanceSheet.Liabilities?.length > 0 ? (
                                        balanceSheet.Liabilities.map((item, idx) => (
                                            <li key={idx}>{item.name}: ${item.balance}</li>
                                        ))
                                    ) : (
                                        <li>No Liabilities</li>
                                    )}
                                </ul>
                                <h5>Equity</h5>
                                <ul>
                                    {balanceSheet.Equity?.length > 0 ? (
                                        balanceSheet.Equity.map((item, idx) => (
                                            <li key={idx}>{item.name}: ${item.balance}</li>
                                        ))
                                    ) : (
                                        <li>No Equity</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default GeneralLedger;
