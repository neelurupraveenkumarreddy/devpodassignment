import React, { Component } from 'react';
import { Link, Outlet } from 'react-router-dom';

class Layout extends Component {
    handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    render() {
        return (
            <div className="layout">
                <aside className="sidebar">
                    <h2>Construction ERP</h2>
                    <nav>
                        <Link to="/">Dashboard</Link>
                        <Link to="/projects">Projects</Link>
                        <Link to="/finance">Invoices</Link>
                        <Link to="/gl">General Ledger</Link>
                        <Link to="/vendors">Vendors</Link>
                        <button onClick={this.handleLogout} style={{ marginTop: '20px', background: '#dc2626' }}>Logout</button>
                    </nav>
                </aside>
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        );
    }
}

export default Layout;
