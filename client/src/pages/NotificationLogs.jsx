import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function NotificationLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API_URL}/api/logs/notifications`)
      .then(res => setLogs(res.data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#fff', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Notification Logs</h2>
      {loading && <p style={{ textAlign: 'center', color: '#a0aec0' }}>Loading...</p>}
      {!loading && logs.length === 0 && <p style={{ textAlign: 'center', color: '#a0aec0' }}>No notifications sent yet.</p>}
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ background: '#1a1a2e', borderRadius: '10px', padding: '1.2rem' }}>
            <p style={{ color: '#a0aec0', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{new Date(log.created_at).toLocaleString()} — Target: {log.target}</p>
            <p><strong style={{ color: '#6c63ff' }}>Title:</strong> {log.title}</p>
            <p><strong style={{ color: '#a0aec0' }}>Message:</strong> {log.message}</p>
            <p><strong style={{ color: '#48bb78' }}>Sent by:</strong> {log.sent_by}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationLogs