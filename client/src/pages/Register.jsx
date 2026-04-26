import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function Register() {
  const [form, setForm] = useState({ name: '', email: '', department: '', level: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.department || !form.level) {
      setStatus('Please fill in all fields.')
      return
    }
    setLoading(true)
    setStatus('')
    try {
      const res = await axios.post(`${API_URL}/api/users/register`, form)
      setStatus(res.data.message)
      setForm({ name: '', email: '', department: '', level: '' })
    } catch {
      setStatus('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '500px', background: '#1a1a2e', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Student Registration</h2>
        <p style={{ color: '#a0aec0', textAlign: 'center', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Register to access GUU AI Digital Brain</p>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#0f0f1a', color: '#fff', fontSize: '1rem' }} />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email address" style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#0f0f1a', color: '#fff', fontSize: '1rem' }} />
        <select name="department" value={form.department} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#0f0f1a', color: '#fff', fontSize: '1rem' }}>
          <option value="">Select department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Economics">Economics</option>
          <option value="Law">Law</option>
          <option value="Biochemistry">Biochemistry</option>
          <option value="Mass Communication">Mass Communication</option>
        </select>
        <select name="level" value={form.level} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#0f0f1a', color: '#fff', fontSize: '1rem' }}>
          <option value="">Select level</option>
          <option value="100">100 Level</option>
          <option value="200">200 Level</option>
          <option value="300">300 Level</option>
          <option value="400">400 Level</option>
        </select>
        <button onClick={handleSubmit} disabled={loading} style={{ background: '#6c63ff', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {status && <p style={{ color: '#a0aec0', textAlign: 'center', fontSize: '0.85rem' }}>{status}</p>}
      </div>
    </div>
  )
}

export default Register