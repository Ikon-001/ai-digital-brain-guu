import { Link } from 'react-router-dom'

function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>GUU AI Digital Brain</h1>
      <p style={{ color: '#a0aec0', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '2rem' }}>
        An AI-powered communication platform for Gregory University, Uturu. Ask questions, get instant answers, and stay informed.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/chat">
          <button style={{ background: '#6c63ff', color: '#fff', border: 'none', padding: '0.8rem 2rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
            Start Chat
          </button>
        </Link>
        <Link to="/admin/notify">
          <button style={{ background: 'transparent', color: '#6c63ff', border: '2px solid #6c63ff', padding: '0.8rem 2rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
            Admin Panel
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home