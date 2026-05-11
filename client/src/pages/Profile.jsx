import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [chats, setChats] = useState([])
  const [notifications, setNotifications] = useState([])
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('guu_user')
    if (!stored) {
      navigate('/login')
      return
    }
    const parsed = JSON.parse(stored)
    setUser(parsed)
    fetchData(parsed.email, parsed.department, parsed.level)
  }, [])

  const fetchData = async (email, department, level) => {
    try {
      const [chatsRes, notifsRes, feedbackRes] = await Promise.all([
        axios.get(`${API_URL}/api/logs/chats`),
        axios.get(`${API_URL}/api/logs/notifications`),
        axios.get(`${API_URL}/api/feedback`)
      ])

      const userChats = chatsRes.data.filter(c =>
        c.user_email?.toLowerCase() === email.toLowerCase()
      )

      const userNotifs = notifsRes.data.filter(n => {
        if (n.is_emergency) return true
        if (n.target?.includes('all')) return true
        if (department && n.target?.includes(department)) return true
        if (level && n.target?.includes(`level:${level}`)) return true
        return false
      })

      const userFeedback = feedbackRes.data.filter(f =>
        f.student_email?.toLowerCase() === email.toLowerCase()
      )

      setChats(userChats)
      setNotifications(userNotifs)
      setFeedback(userFeedback)
    } catch {
      console.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('guu_user')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="bg-surface dark:bg-slate-950 min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant dark:text-slate-400 text-sm">Loading your profile...</p>
      </div>
    )
  }

  if (!user) return null

  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex flex-col">
      <main className="flex-1 px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto">

          {/* Profile header */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{initials}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-on-surface dark:text-slate-50">{user.name}</h2>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400">{user.email}</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${
                    user.role === 'admin'
                      ? 'bg-primary-container text-white'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Logout
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-surface-container-low dark:bg-slate-700 rounded-2xl p-4">
                <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Department</p>
                <p className="text-sm font-medium text-on-surface dark:text-slate-100">{user.department}</p>
              </div>
              <div className="bg-surface-container-low dark:bg-slate-700 rounded-2xl p-4">
                <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  {user.role === 'admin' ? 'Staff Role' : 'Level'}
                </p>
                <p className="text-sm font-medium text-on-surface dark:text-slate-100">
                  {user.role === 'admin' ? user.staff_role || '—' : user.level ? `${user.level} Level` : '—'}
                </p>
              </div>
              <div className="bg-surface-container-low dark:bg-slate-700 rounded-2xl p-4">
                <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Chats</p>
                <p className="text-2xl font-bold text-primary-container">{chats.length}</p>
              </div>
              <div className="bg-surface-container-low dark:bg-slate-700 rounded-2xl p-4">
                <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Feedback Sent</p>
                <p className="text-2xl font-bold text-primary-container">{feedback.length}</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Link to="/chat" className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant dark:border-slate-700 p-4 shadow-sm flex flex-col items-center gap-2 hover:border-primary-container transition-all">
              <span className="material-symbols-outlined text-primary-container text-[28px]">smart_toy</span>
              <span className="text-xs font-semibold text-on-surface dark:text-slate-300">AI Assistant</span>
            </Link>
            <Link to="/announcements" className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant dark:border-slate-700 p-4 shadow-sm flex flex-col items-center gap-2 hover:border-primary-container transition-all">
              <span className="material-symbols-outlined text-primary-container text-[28px]">campaign</span>
              <span className="text-xs font-semibold text-on-surface dark:text-slate-300">Announcements</span>
            </Link>
            <Link to="/feedback" className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant dark:border-slate-700 p-4 shadow-sm flex flex-col items-center gap-2 hover:border-primary-container transition-all">
              <span className="material-symbols-outlined text-primary-container text-[28px]">feedback</span>
              <span className="text-xs font-semibold text-on-surface dark:text-slate-300">Feedback</span>
            </Link>
          </div>

          {/* Chat history */}
          {chats.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-on-surface dark:text-slate-50 uppercase tracking-wider mb-4">Recent Chat History</h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {chats.slice(0, 10).map((chat, i) => (
                  <div key={i} className="border-b border-outline-variant dark:border-slate-700 pb-4 last:border-0 last:pb-0">
                    <p className="text-xs text-on-surface-variant dark:text-slate-500 mb-2">{new Date(chat.created_at).toLocaleString()}</p>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <span className="text-xs font-bold text-secondary dark:text-blue-400 uppercase w-12 shrink-0">You</span>
                        <p className="text-sm text-on-surface dark:text-slate-200">{chat.user_message}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase w-12 shrink-0">AI</span>
                        <p className="text-sm text-on-surface-variant dark:text-slate-400 line-clamp-2">{chat.ai_response}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements */}
          {notifications.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-on-surface dark:text-slate-50 uppercase tracking-wider mb-4">Your Announcements</h3>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notif, i) => (
                  <div key={i} className={`p-4 rounded-2xl border ${notif.is_emergency ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-surface-container-low dark:bg-slate-700 border-outline-variant dark:border-slate-600'}`}>
                    {notif.is_emergency && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                        <span className="material-symbols-outlined text-[14px]">emergency</span>
                        EMERGENCY
                      </span>
                    )}
                    <p className="text-sm font-semibold text-on-surface dark:text-slate-100">{notif.title}</p>
                    <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1">{new Date(notif.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My feedback */}
          {feedback.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-on-surface dark:text-slate-50 uppercase tracking-wider mb-4">My Feedback</h3>
              <div className="space-y-3">
                {feedback.map((f, i) => (
                  <div key={i} className="bg-surface-container-low dark:bg-slate-700 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-on-surface dark:text-slate-100">{f.subject}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        f.status === 'read'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-primary-container text-white'
                      }`}>
                        {f.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant dark:text-slate-400">{new Date(f.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="w-full py-6 px-8 flex justify-center bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500">© 2025 GUU AI Digital Brain. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default Profile