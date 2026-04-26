import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function NotificationForm() {
  const [form, setForm] = useState({ title: '', message: '', target: 'all', sent_by: 'admin@guu.edu.ng' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const sendNotification = async () => {
    if (!form.title || !form.message) return
    setLoading(true)
    setStatus('')
    try {
      const res = await axios.post(`${API_URL}/api/notify`, form)
      setStatus(res.data.message)
    } catch {
      setStatus('Failed to send notification.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Send Notification</h2>
      <div style={{ width: '100%', maxWidth: '600px', background: '#1a1a2e', borderRadius: '12px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Notification title" style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#0f0f1a', color: '#fff', fontSize: '1rem' }} />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Notification message" rows={5} style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#0f0f1a', color: '#fff', fontSize: '1rem', resize: 'vertical' }} />
        <select name="target" value={form.target} onChange={handleChange} style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', background: '#0f0f1a', color: '#fff', fontSize: '1rem' }}>
          <option value="all">All Students</option>
          <option value="dept:Computer Science">Computer Science</option>
          <option value="dept:Economics">Economics</option>
          <option value="level:100">100 Level</option>
          <option value="level:200">200 Level</option>
          <option value="level:300">300 Level</option>
          <option value="level:400">400 Level</option>
        </select>
        <button onClick={sendNotification} disabled={loading} style={{ background: '#6c63ff', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
          {loading ? 'Sending...' : 'Send Notification'}
        </button>
        {status && <p style={{ color: '#a0aec0' }}>{status}</p>}
      </div>
    </div>
  )
}

export default NotificationForm