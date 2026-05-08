import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const API_URL = import.meta.env.VITE_API_URL

const adminLinks = [
  { to: '/admin/notify', label: 'Send Notification', icon: 'campaign' },
  { to: '/admin/chat-logs', label: 'Chat Logs', icon: 'chat_bubble' },
  { to: '/admin/notification-logs', label: 'Notification Logs', icon: 'notifications' },
  { to: '/admin/users', label: 'User Management', icon: 'group' },
]

function AdminSidebar({ open, onClose }) {
  const location = useLocation()
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-50 bg-white dark:bg-slate-800 border-r border-outline-variant dark:border-slate-700 p-4 transition-transform duration-300
        md:static md:translate-x-0 md:h-auto md:z-auto md:rounded-2xl md:border md:shrink-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-4 px-2">
          <p className="text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Admin Panel</p>
          <button onClick={onClose} className="md:hidden text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <nav className="space-y-1">
          {adminLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
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
      </aside>
    </>
  )
}

function UserManagement() {
  const { dark, setDark } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API_URL}/api/logs/users`)
      .then(res => setUsers(res.data))
      .catch(() => setError('Could not load users. Server may be waking up — please refresh in 30 seconds.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex flex-col">

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <span className="text-sm font-bold text-[#002147] dark:text-slate-50">Admin Panel</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          >
            <span className="material-symbols-outlined text-[20px]">{dark ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
        </div>
      </div>

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
                <span className="material-symbols-outlined text-white text-xl">group</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary dark:text-slate-50 tracking-tight">User Management</h1>
                <p className="text-xs text-on-surface-variant dark:text-slate-400">{users.length} registered users</p>
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

            {!loading && !error && (
              <>
                {/* Mobile card view */}
                <div className="md:hidden space-y-4">
                  {users.map((user, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant dark:border-slate-700 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm text-on-surface dark:text-slate-100">{user.name}</span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-primary-container text-white'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-1">{user.email}</p>
                      <p className="text-xs text-on-surface dark:text-slate-300">{user.department}</p>
                      <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">
                        {user.role === 'admin'
                          ? user.staff_role || '—'
                          : user.level ? `${user.level} Level` : '—'
                        }
                      </p>
                    </div>
                  ))}
                </div>

                {/* Desktop table view */}
                <div className="hidden md:block bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant dark:border-slate-700 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface-container-low dark:bg-slate-700 border-b border-outline-variant dark:border-slate-600">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Level / Staff Role</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant dark:divide-slate-700">
                      {users.map((user, i) => (
                        <tr key={i} className="hover:bg-surface-container-low dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-on-surface dark:text-slate-100">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant dark:text-slate-400">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-on-surface dark:text-slate-300">{user.department}</td>
                          <td className="px-6 py-4 text-sm text-on-surface dark:text-slate-300">
                            {user.role === 'admin'
                              ? user.staff_role || '—'
                              : user.level ? `${user.level} Level` : '—'
                            }
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              user.role === 'admin'
                                ? 'bg-primary-container text-white'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full py-6 px-8 flex justify-center bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500">© 2025 GUU AI Digital Brain. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default UserManagement