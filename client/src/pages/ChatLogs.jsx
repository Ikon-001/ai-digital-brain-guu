import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function ChatLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API_URL}/api/logs/chats`)
      .then(res => setLogs(res.data))
      .catch(() => setError('Could not load chat logs. Server may be waking up — please refresh in 30 seconds.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#fff', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Chat Logs</h2>
      {loading && <p style={{ textAlign: 'center', color: '#a0aec0' }}>Loading... (may take up to 60 seconds if server is waking up)</p>}
      {error && <p style={{ textAlign: 'center', color: '#ff6584' }}>{error}</p>}
      {!loading && !error && logs.length === 0 && <p style={{ textAlign: 'center', color: '#a0aec0' }}>No chat logs yet.</p>}
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ background: '#1a1a2e', borderRadius: '10px', padding: '1.2rem' }}>
            <p style={{ color: '#a0aec0', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{log.user_email} — {new Date(log.created_at).toLocaleString()}</p>
            <p><strong style={{ color: '#6c63ff' }}>Student:</strong> {log.user_message}</p>
            <p><strong style={{ color: '#48bb78' }}>AI:</strong> {log.ai_response}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatLogs