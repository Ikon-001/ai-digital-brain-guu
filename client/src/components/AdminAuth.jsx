import { useState } from 'react'

const ADMIN_PASSWORD = 'guu-admin-2026'

function AdminAuth({ children }) {
  const [authed, setAuthed] = useState(sessionStorage.getItem('admin_auth') === 'true')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthed(true)
    } else {
      setError('Incorrect password.')
    }
  }

  if (authed) return children

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ textAlign: 'center' }}>Admin Access</h2>
        <p style={{ color: '#a0aec0', textAlign: 'center', fontSize: '0.85rem' }}>Enter the admin password to continue</p>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Password"
          style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#0f0f1a', color: '#fff', fontSize: '1rem' }}
        />
        {error && <p style={{ color: '#ff6584', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}
        <button onClick={handleLogin} style={{ background: '#6c63ff', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
          Enter
        </button>
      </div>
    </div>
  )
}

export default AdminAuth