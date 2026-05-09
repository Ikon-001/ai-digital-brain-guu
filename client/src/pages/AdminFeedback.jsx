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

function AdminFeedback() {
  const location = useLocation()
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/feedback`)
      setFeedback(res.data)
    } catch {
      setError('Could not load feedback. Server may be waking up — please refresh in 30 seconds.')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/feedback/${id}`)
      setFeedback(prev => prev.map(f => f.id === id ? { ...f, status: 'read' } : f))
    } catch {
      console.error('Failed to mark as read')
    }
  }

  const unreadCount = feedback.filter(f => f.status === 'unread').length
  const filtered = filter === 'unread' ? feedback.filter(f => f.status === 'unread') : filter === 'read' ? feedback.filter(f => f.status === 'read') : feedback

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
                    {link.to === '/admin/feedback' && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">feedback</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary dark:text-slate-50 tracking-tight">Feedback</h1>
                <p className="text-xs text-on-surface-variant dark:text-slate-400">
                  {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
                </p>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'read', label: 'Read' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    filter === tab.key
                      ? 'bg-primary-container text-white'
                      : 'bg-white dark:bg-slate-800 border border-outline-variant dark:border-slate-700 text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'unread' && unreadCount > 0 && (
                    <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                  )}
                </button>
              ))}
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
            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-16 text-on-surface-variant dark:text-slate-400 text-sm">
                No feedback messages yet.
              </div>
            )}

            <div className="space-y-4">
              {filtered.map((item, i) => (
                <div key={i} className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-sm p-6 transition-all ${
                  item.status === 'unread'
                    ? 'border-primary-container dark:border-blue-600'
                    : 'border-outline-variant dark:border-slate-700'
                }`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      {item.status === 'unread' && (
                        <span className="w-2 h-2 bg-primary-container rounded-full shrink-0"></span>
                      )}
                      <h3 className="font-semibold text-on-surface dark:text-slate-100">{item.subject}</h3>
                    </div>
                    <span className="text-xs text-on-surface-variant dark:text-slate-500 shrink-0">{new Date(item.created_at).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant dark:text-slate-400 mb-3">
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    {item.student_email}
                  </div>

                  <p className="text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed mb-4">{item.message}</p>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'unread'
                        ? 'bg-primary-container text-white'
                        : 'bg-surface-container dark:bg-slate-700 text-on-surface-variant dark:text-slate-400'
                    }`}>
                      {item.status}
                    </span>
                    {item.status === 'unread' && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary-container dark:text-blue-400 hover:opacity-70 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-[16px]">done</span>
                        Mark as read
                      </button>
                    )}
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

export default AdminFeedback