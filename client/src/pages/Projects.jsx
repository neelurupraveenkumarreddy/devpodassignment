import React, { Component } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      newProject: {
        name: '',
        budget: '',
        start_date: ''
      },
      error: ''
    };
  }

  componentDidMount() {
    this.fetchProjects();
  }

  fetchProjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        this.setState({ projects: await res.json() });
      }
    } catch (err) {
      console.error(err);
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      newProject: { ...prevState.newProject, [name]: value }
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(this.state.newProject)
      });

      if (res.ok) {
        this.fetchProjects();
        this.setState({ newProject: { name: '', budget: '', start_date: '' }, error: '' });
      } else {
        const data = await res.json();
        this.setState({ error: data.message });
      }
    } catch (err) {
      this.setState({ error: 'Failed to create project' });
    }
  };

  updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/projects/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        this.fetchProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { projects, newProject, error } = this.state;
    return (
      <div>
        <h1>Projects Management</h1>

        <div className="card">
          <h3>Create New Project</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={this.handleSubmit} className="responsive-form">
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={newProject.name}
              onChange={this.handleInputChange}
              required
            />
            <input
              type="number"
              name="budget"
              placeholder="Budget"
              value={newProject.budget}
              onChange={this.handleInputChange}
              required
            />
            <input
              type="date"
              name="start_date"
              value={newProject.start_date}
              onChange={this.handleInputChange}
              required
            />
            <div style={{ visibility: 'hidden' }}></div>
            <button type="submit" style={{ gridColumn: 'span 1' }}>Create Project</button>
          </form>
        </div>

        <div className="card">
          <h3>Recent Projects</h3>
          <div className="table-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '8px' }}>ID</th>
                  <th style={{ padding: '8px' }}>Name</th>
                  <th style={{ padding: '8px' }}>Budget</th>
                  <th style={{ padding: '8px' }}>Status</th>
                  <th style={{ padding: '8px' }}>Start Date</th>
                  <th style={{ padding: '8px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{p.id}</td>
                    <td style={{ padding: '8px' }}>{p.name}</td>
                    <td style={{ padding: '8px' }}>${p.budget}</td>
                    <td style={{ padding: '8px', color: p.status === 'Completed' ? 'green' : p.status === 'On Hold' ? 'orange' : 'inherit', fontWeight: p.status === 'Completed' ? 'bold' : 'normal' }}>{p.status}</td>
                    <td style={{ padding: '8px' }}>{p.start_date ? new Date(p.start_date).toLocaleDateString() : 'N/A'}</td>
                    <td style={{ padding: '8px' }}>
                      {p.status !== 'Completed' && (
                        <button onClick={() => this.updateStatus(p.id, 'Completed')} style={{ padding: '5px', fontSize: '0.8em', background: '#10b981' }}>Mark Completed</button>
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

export default Projects;
