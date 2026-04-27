import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API_URL}/api/logs/users`)
      .then(res => setUsers(res.data))
      .catch(() => setError('Could not load users. Server may be waking up — please refresh in 30 seconds.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#fff', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>User Management</h2>
      {loading && <p style={{ textAlign: 'center', color: '#a0aec0' }}>Loading... (may take up to 60 seconds if server is waking up)</p>}
      {error && <p style={{ textAlign: 'center', color: '#ff6584' }}>{error}</p>}
      {!loading && !error && users.length === 0 && <p style={{ textAlign: 'center', color: '#a0aec0' }}>No users found.</p>}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1a1a2e' }}>
              <th style={{ padding: '0.8rem', textAlign: 'left', color: '#6c63ff' }}>Name</th>
              <th style={{ padding: '0.8rem', textAlign: 'left', color: '#6c63ff' }}>Email</th>
              <th style={{ padding: '0.8rem', textAlign: 'left', color: '#6c63ff' }}>Department</th>
              <th style={{ padding: '0.8rem', textAlign: 'left', color: '#6c63ff' }}>Level</th>
              <th style={{ padding: '0.8rem', textAlign: 'left', color: '#6c63ff' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #2d2d44' }}>
                <td style={{ padding: '0.8rem' }}>{user.name}</td>
                <td style={{ padding: '0.8rem', color: '#a0aec0' }}>{user.email}</td>
                <td style={{ padding: '0.8rem' }}>{user.department}</td>
                <td style={{ padding: '0.8rem' }}>{user.level}</td>
                <td style={{ padding: '0.8rem', color: '#48bb78' }}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement