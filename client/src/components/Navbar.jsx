import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{ background: '#1a1a2e', padding: '1rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>GUU AI Digital Brain</span>
      <Link to="/" style={{ color: '#a0aec0', textDecoration: 'none' }}>Home</Link>
      <Link to="/chat" style={{ color: '#a0aec0', textDecoration: 'none' }}>Chat</Link>
      <Link to="/admin/notify" style={{ color: '#a0aec0', textDecoration: 'none' }}>Notify</Link>
      <Link to="/admin/chat-logs" style={{ color: '#a0aec0', textDecoration: 'none' }}>Chat Logs</Link>
      <Link to="/admin/notification-logs" style={{ color: '#a0aec0', textDecoration: 'none' }}>Notif Logs</Link>
      <Link to="/admin/users" style={{ color: '#a0aec0', textDecoration: 'none' }}>Users</Link>
    </nav>
  )
}

export default Navbar