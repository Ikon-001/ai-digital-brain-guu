import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        message: userMessage,
        user_email: 'student@guu.edu.ng'
      })
      setMessages(prev => [...prev, { role: 'ai', text: res.data.response }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error getting response. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>GUU AI Chatbot</h2>
      <div style={{ width: '100%', maxWidth: '700px', flex: 1, background: '#1a1a2e', borderRadius: '12px', padding: '1.5rem', minHeight: '400px', marginBottom: '1rem', overflowY: 'auto' }}>
        {messages.length === 0 && <p style={{ color: '#a0aec0' }}>Ask me anything about Gregory University...</p>}
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '1rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{ background: msg.role === 'user' ? '#6c63ff' : '#2d2d44', padding: '0.6rem 1rem', borderRadius: '8px', display: 'inline-block', maxWidth: '80%' }}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p style={{ color: '#a0aec0' }}>Thinking...</p>}
      </div>
      <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '700px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your question..."
          style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '8px', border: 'none', background: '#1a1a2e', color: '#fff', fontSize: '1rem' }}
        />
        <button onClick={sendMessage} style={{ background: '#6c63ff', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}>
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat