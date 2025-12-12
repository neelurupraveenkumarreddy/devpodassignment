import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            role: 'Project Manager',
            error: '',
            success: ''
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                    role: this.state.role
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.setState({ success: 'Registration successful! You can now login.', error: '' });
            } else {
                this.setState({ error: data.message, success: '' });
            }
        } catch (err) {
            this.setState({ error: 'Failed to connect to server', success: '' });
        }
    };

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="card" style={{ width: '350px' }}>
                    <h2>Register</h2>
                    {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
                    {this.state.success && <p style={{ color: 'green' }}>{this.state.success}</p>}

                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            required
                        />
                        <select name="role" value={this.state.role} onChange={this.handleChange} style={{ marginBottom: '10px' }}>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Finance Manager">Finance Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <button type="submit">Register</button>
                    </form>
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <Link to="/login">Already have an account? Login</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
