import React, { Component } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class Vendors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vendors: [],
            newVendor: { name: '', contact_email: '', type: 'Vendor' }
        };
    }

    componentDidMount() {
        this.fetchVendors();
    }

    fetchVendors = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BASE_URL}/vendors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            this.setState({ vendors: await res.json() });
        } catch (err) { console.error(err); }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await fetch(`${BASE_URL}/vendors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(this.state.newVendor)
            });
            this.fetchVendors();
            this.setState({ newVendor: { name: '', contact_email: '', type: 'Vendor' } });
        } catch (err) { console.error(err); }
    };

    render() {
        const { vendors, newVendor } = this.state;
        return (
            <div>
                <h1>Vendors & Customers</h1>
                <div className="card">
                    <h3>Add New Contact</h3>
                    <form onSubmit={this.handleSubmit} className="responsive-form">
                        <input type="text" placeholder="Name" value={newVendor.name} onChange={e => this.setState({ newVendor: { ...newVendor, name: e.target.value } })} required />
                        <input type="email" placeholder="Email" value={newVendor.contact_email} onChange={e => this.setState({ newVendor: { ...newVendor, contact_email: e.target.value } })} />
                        <select value={newVendor.type} onChange={e => this.setState({ newVendor: { ...newVendor, type: e.target.value } })}>
                            <option value="Vendor">Vendor</option>
                            <option value="Customer">Customer</option>
                        </select>
                        <button type="submit">Add</button>
                    </form>
                </div>

                <div className="card">
                    <h3>Contact List</h3>
                    <ul>
                        {vendors.map(v => (
                            <li key={v.id}>{v.name} ({v.type}) - {v.contact_email}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Vendors;
