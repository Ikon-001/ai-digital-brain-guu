import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

const API_URL = import.meta.env.VITE_API_URL

function Chat() {
  const storedUser = localStorage.getItem('guu_user')
  const user = storedUser ? JSON.parse(storedUser) : null
  const userEmail = user?.email || 'guest@unknown'

  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Welcome to the GUU Digital Brain. I am your academic assistant. You can ask me about campus facilities, enrollment procedures, faculty information, and more. How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputError, setInputError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) {
      setInputError('Please type a message before sending.')
      setTimeout(() => setInputError(''), 3000)
      return
    }
    setInputError('')
    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/api/chat`, {
        message: userMessage,
        user_email: userEmail
      })
      setMessages(prev => [...prev, { role: 'ai', text: res.data.response }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'The server is waking up or unavailable. Please wait 30 seconds and try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{ role: 'ai', text: 'Welcome to the GUU Digital Brain. I am your academic assistant. How can I help you today?' }])
  }

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen pt-16 flex flex-col">
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-3xl flex flex-col" style={{ height: 'calc(100vh - 64px - 32px)' }}>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-primary dark:text-slate-50 tracking-tight">GUU AI Assistant</h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1">Ask anything about Gregory University, Uturu</p>
            {!user && (
              <p className="text-xs text-on-surface-variant dark:text-slate-500 mt-1">
                Chatting as guest —{' '}
                <a href="/login" className="text-primary-container dark:text-blue-400 font-semibold hover:underline">login</a>
                {' '}to save your chat history
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse ml-auto max-w-[85%]' : 'max-w-[85%]'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary-container' : 'bg-surface-dim dark:bg-slate-700'}`}>
                  <span className={`material-symbols-outlined text-lg ${msg.role === 'ai' ? 'text-white' : 'text-on-surface dark:text-slate-300'}`}>
                    {msg.role === 'ai' ? 'smart_toy' : 'person'}
                  </span>
                </div>
                <div className={`p-5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'ai'
                    ? 'bg-white dark:bg-slate-800 border border-outline-variant dark:border-slate-700 text-on-surface dark:text-slate-200'
                    : 'bg-surface-container-high dark:bg-slate-700 text-on-surface dark:text-slate-100'
                }`}>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3 max-w-[85%]">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-lg">smart_toy</span>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-outline-variant dark:border-slate-700 p-5 rounded-2xl">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="pt-4 bg-surface dark:bg-slate-950 sticky bottom-0">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={e => { setInput(e.target.value); setInputError('') }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage() } }}
                placeholder="Ask about courses, enrollment, campus life..."
                className={`flex-1 px-5 py-4 bg-white dark:bg-slate-800 border rounded-2xl focus:ring-2 focus:ring-primary-container focus:border-primary-container shadow-sm text-sm text-on-surface dark:text-slate-100 placeholder:text-on-surface-variant dark:placeholder:text-slate-500 outline-none ${inputError ? 'border-red-400 dark:border-red-500' : 'border-outline-variant dark:border-slate-700'}`}
              />
              <button onClick={sendMessage}
                className="bg-primary-container text-white w-12 h-12 rounded-xl flex items-center justify-center hover:opacity-90 transition-all active:scale-95 shadow-md shrink-0">
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
            {inputError && <p className="text-xs text-red-500 mt-1 px-1">{inputError}</p>}
            <div className="flex justify-center mt-3 gap-6">
              <button onClick={clearChat}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary-container dark:hover:text-blue-400 transition-colors uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                New Thread
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full py-6 px-8 flex justify-center bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500">© 2025 GUU AI Digital Brain. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default Chat