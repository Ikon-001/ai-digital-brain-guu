import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

const adminLinks = [
  { to: '/admin/notify', label: 'Send Notification', icon: 'campaign' },
  { to: '/admin/chat-logs', label: 'Chat Logs', icon: 'chat_bubble' },
  { to: '/admin/notification-logs', label: 'Notification Logs', icon: 'notifications' },
  { to: '/admin/users', label: 'User Management', icon: 'group' },
  { to: '/admin/feedback', label: 'Feedback', icon: 'feedback' },
]

function ChatLogs() {
  const location = useLocation()
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
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex flex-col">
      <main className="flex-1 px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto md:flex gap-8">

          {/* Desktop sidebar */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant dark:border-slate-700 p-4 sticky top-24">
              <p className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-4 px-2">Admin Panel</p>
              <nav className="space-y-1">
                {adminLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.to
                        ? 'bg-primary-container text-white'
                        : 'text-on-surface dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">chat_bubble</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary dark:text-slate-50 tracking-tight">Chat Logs</h1>
                <p className="text-xs text-on-surface-variant dark:text-slate-400">All student chatbot interactions</p>
              </div>
            </div>

            {loading && (
              <div className="text-center py-16 text-on-surface-variant dark:text-slate-400 text-sm">
                Loading... (may take up to 60 seconds if server is waking up)
              </div>
            )}
            {error && (
              <div className="p-4 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
            {!loading && !error && logs.length === 0 && (
              <div className="text-center py-16 text-on-surface-variant dark:text-slate-400 text-sm">No chat logs yet.</div>
            )}

            <div className="space-y-4">
              {logs.map((log, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant dark:border-slate-700 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400 text-sm">person</span>
                    <span className="text-xs text-on-surface-variant dark:text-slate-400">{log.user_email}</span>
                    <span className="text-xs text-on-surface-variant dark:text-slate-500 ml-auto">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="text-xs font-bold text-secondary dark:text-blue-400 uppercase tracking-wider w-16 shrink-0 pt-0.5">Student</span>
                      <p className="text-sm text-on-surface dark:text-slate-200">{log.user_message}</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider w-16 shrink-0 pt-0.5">AI</span>
                      <p className="text-sm text-on-surface-variant dark:text-slate-400">{log.ai_response}</p>
                    </div>
                  </div>
                </div>
              ))}
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

export default ChatLogs