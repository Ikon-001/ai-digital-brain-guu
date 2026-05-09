import { useState } from 'react'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

function Profile() {
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState(null)
  const [chats, setChats] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const lookup = async () => {
    if (!email.trim()) return
    setLoading(true)
    setError('')
    setProfile(null)
    setChats([])
    setNotifications([])

    try {
      const [usersRes, chatsRes, notifsRes] = await Promise.all([
        axios.get(`${API_URL}/api/logs/users`),
        axios.get(`${API_URL}/api/logs/chats`),
        axios.get(`${API_URL}/api/logs/notifications`)
      ])

      const user = usersRes.data.find(u => u.email.toLowerCase() === email.toLowerCase().trim())
      if (!user) {
        setError('No account found with that email address.')
        setSearched(true)
        setLoading(false)
        return
      }

      const userChats = chatsRes.data.filter(c => c.user_email?.toLowerCase() === email.toLowerCase().trim())
      setProfile(user)
      setChats(userChats)
      setNotifications(notifsRes.data)
      setSearched(true)
    } catch {
      setError('Could not load profile. Server may be waking up — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex flex-col">
      <main className="flex-1 px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">person</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary dark:text-slate-50 tracking-tight">My Profile</h1>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">Enter your registered email to view your profile</p>
            </div>
          </div>

          {/* Email lookup */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-6 shadow-sm mb-6">
            <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Registered Email</label>
            <div className="flex gap-3">
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && lookup()}
                placeholder="e.g. student@guu.edu.ng"
                className="flex-1 px-4 py-3 bg-surface-container-low dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-xl text-sm text-on-surface dark:text-slate-100 placeholder:text-on-surface-variant dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-container outline-none transition-all"
              />
              <button
                onClick={lookup}
                disabled={loading}
                className="px-6 py-3 bg-primary-container text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'View'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}
          </div>

          {/* Profile card */}
          {profile && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-6 shadow-sm mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl">person</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-on-surface dark:text-slate-50">{profile.name}</h2>
                    <p className="text-sm text-on-surface-variant dark:text-slate-400">{profile.email}</p>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${
                      profile.role === 'admin'
                        ? 'bg-primary-container text-white'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    }`}>
                      {profile.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-low dark:bg-slate-700 rounded-2xl p-4">
                    <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Department</p>
                    <p className="text-sm font-medium text-on-surface dark:text-slate-100">{profile.department}</p>
                  </div>
                  <div className="bg-surface-container-low dark:bg-slate-700 rounded-2xl p-4">
                    <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">
                      {profile.role === 'admin' ? 'Staff Role' : 'Level'}
                    </p>
                    <p className="text-sm font-medium text-on-surface dark:text-slate-100">
                      {profile.role === 'admin' ? profile.staff_role || '—' : profile.level ? `${profile.level} Level` : '—'}
                    </p>
                  </div>
                  <div className="bg-surface-container-low dark:bg-slate-700 rounded-2xl p-4">
                    <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Chat Sessions</p>
                    <p className="text-sm font-medium text-on-surface dark:text-slate-100">{chats.length}</p>
                  </div>
                  <div className="bg-surface-container-low dark:bg-slate-700 rounded-2xl p-4">
                    <p className="text-xs text-on-surface-variant dark:text-slate-400 uppercase tracking-wider font-semibold mb-1">Member Since</p>
                    <p className="text-sm font-medium text-on-surface dark:text-slate-100">{new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
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

              {/* Recent announcements */}
              {notifications.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-on-surface dark:text-slate-50 uppercase tracking-wider mb-4">Recent Announcements</h3>
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
            </>
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