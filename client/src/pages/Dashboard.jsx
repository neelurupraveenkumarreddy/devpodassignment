import React, { Component } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const BASE_URL = import.meta.env.VITE_BASE_URL;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: null,
            risks: [],
            loading: true
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            // Fetch Dashboard Stats
            const statsRes = await fetch(`${BASE_URL}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const stats = await statsRes.json();

            // Fetch Risk Analysis
            const riskRes = await fetch(`${BASE_URL}/insights/risk`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const risks = await riskRes.json();

            this.setState({ stats, risks, loading: false });
        } catch (err) {
            console.error(err);
            this.setState({ loading: false });
        }
    };

    render() {
        const { stats, risks, loading } = this.state;

        if (loading) return <div>Loading...</div>;

        const chartData = {
            labels: ['Revenue'],
            datasets: [
                {
                    label: 'Total Revenue',
                    data: [stats?.totalRevenue || 0],
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
            ],
        };

        const riskData = {
            labels: ['Low', 'Medium', 'High', 'Critical'],
            datasets: [
                {
                    label: '# of Projects',
                    data: [
                        risks.filter(r => r.riskLevel === 'Low').length,
                        risks.filter(r => r.riskLevel === 'Medium').length,
                        risks.filter(r => r.riskLevel === 'High').length,
                        risks.filter(r => r.riskLevel === 'Critical').length,
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        return (
            <div>
                <h1>Dashboard</h1>

                <div className="grid">
                    <div className="card">
                        <h3>Total Projects</h3>
                        <p style={{ fontSize: '2em' }}>{stats?.totalProjects || 0}</p>
                    </div>
                    <div className="card">
                        <h3>Total Revenue</h3>
                        <p style={{ fontSize: '2em' }}>${stats?.totalRevenue || 0}</p>
                    </div>
                    <div className="card">
                        <h3>Cash Flow Status</h3>
                        <p style={{ fontSize: '1.5em' }}>{stats?.cashFlowStatus}</p>
                    </div>
                </div>

                <div className="grid" style={{ marginTop: '20px' }}>
                    <div className="card">
                        <h3>Revenue Overview</h3>
                        <div style={{ height: '300px' }}>
                            <Bar options={{ responsive: true, maintainAspectRatio: false }} data={chartData} />
                        </div>
                    </div>
                    <div className="card">
                        <h3>Risk Distribution</h3>
                        <div style={{ height: '300px' }}>
                            <Pie options={{ responsive: true, maintainAspectRatio: false }} data={riskData} />
                        </div>
                    </div>
                </div>

                <h2>Risk Insights</h2>
                <div className="card">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left' }}>
                                <th>Project ID</th>
                                <th>Name</th>
                                <th>Risk Score</th>
                                <th>Level</th>
                            </tr>
                        </thead>
                        <tbody>
                            {risks.map(r => (
                                <tr key={r.projectId} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px' }}>{r.projectId}</td>
                                    <td style={{ padding: '10px' }}>{r.projectName}</td>
                                    <td style={{ padding: '10px' }}>{r.riskScore}</td>
                                    <td style={{ padding: '10px', fontWeight: 'bold', color: r.riskLevel === 'Critical' ? 'red' : r.riskLevel === 'High' ? 'orange' : 'green' }}>
                                        {r.riskLevel}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Dashboard;
