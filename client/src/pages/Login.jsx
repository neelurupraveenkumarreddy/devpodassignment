import React, { Component } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: ''
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                this.setState({ error: data.message });
            }
        } catch (err) {
            this.setState({ error: 'Failed to connect to server' });
        }
    };

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
                <div className="card" style={{ width: '300px' }}>
                    <h2>Login</h2>
                    {this.state.error && <p style={{ color: 'red' }}>{this.state.error}</p>}
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                        <button type="submit">Login</button>
                    </form>
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <a href="/register">Create an account</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
