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

function AdminInfo({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-xs text-on-surface-variant dark:text-slate-500 hover:text-primary-container dark:hover:text-blue-400 transition-colors font-semibold"
      >
        <span className="material-symbols-outlined text-[14px]">{open ? 'expand_less' : 'expand_more'}</span>
        {open ? 'Hide sender info' : 'View sender info'}
      </button>
      {open && (
        <div className="mt-2 p-3 bg-surface-container-low dark:bg-slate-700 rounded-xl text-xs text-on-surface-variant dark:text-slate-400">
          <p><span className="font-semibold">Sent by:</span> {item.sent_by}</p>
          <p className="mt-1"><span className="font-semibold">Target:</span> {item.target}</p>
          {item.recipient_count > 0 && (
            <p className="mt-1"><span className="font-semibold">Recipients:</span> {item.recipient_count}</p>
          )}
        </div>
      )}
    </div>
  )
}

function NotificationLogs() {
  const location = useLocation()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API_URL}/api/logs/notifications`)
      .then(res => setLogs(res.data))
      .catch(() => setError('Could not load notification logs. Server may be waking up — please refresh in 30 seconds.'))
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
                <span className="material-symbols-outlined text-white text-xl">notifications</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary dark:text-slate-50 tracking-tight">Notification Logs</h1>
                <p className="text-xs text-on-surface-variant dark:text-slate-400">All sent notifications</p>
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
              <div className="text-center py-16 text-on-surface-variant dark:text-slate-400 text-sm">No notifications sent yet.</div>
            )}

            <div className="space-y-4">
              {logs.map((log, i) => (
                <div key={i} className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-sm p-6 ${log.is_emergency ? 'border-red-300 dark:border-red-700' : 'border-outline-variant dark:border-slate-700'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {log.is_emergency && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">
                          <span className="material-symbols-outlined text-[10px]">emergency</span>
                          EMERGENCY
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container dark:bg-slate-700 rounded-full text-xs font-semibold text-on-surface-variant dark:text-slate-300">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {log.recipient_count > 0 ? `${log.recipient_count} recipients` : log.target}
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant dark:text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                  <h3 className="font-semibold text-primary dark:text-slate-100 mb-2">{log.title}</h3>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-2">{log.message}</p>
                  <AdminInfo item={log} />
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

export default NotificationLogs