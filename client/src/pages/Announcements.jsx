import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

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
        </div>
      )}
    </div>
  )
}

function Announcements() {
  const navigate = useNavigate()
  const storedUser = localStorage.getItem('guu_user')
  const user = storedUser ? JSON.parse(storedUser) : null

  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    axios.get(`${API_URL}/api/logs/notifications`)
      .then(res => {
        const all = res.data
        const relevant = all.filter(n => {
          if (n.is_deleted) return false
          if (n.is_emergency) return true
          if (n.target?.includes('all')) return true
          if (user.department && n.target?.includes(user.department)) return true
          if (user.level && n.target?.includes(`level:${user.level}`)) return true
          return false
        })
        setAnnouncements(relevant)
      })
      .catch(() => setError('Could not load announcements. Server may be waking up — please refresh in 30 seconds.'))
      .finally(() => setLoading(false))
  }, [])

  const emergency = announcements.filter(a => a.is_emergency)

  const applyFilters = (list) => {
    let result = list
    if (filter === 'emergency') result = result.filter(a => a.is_emergency)
    else if (filter === 'regular') result = result.filter(a => !a.is_emergency)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        a.title?.toLowerCase().includes(q) ||
        a.message?.toLowerCase().includes(q)
      )
    }
    return result
  }

  const filtered = applyFilters(announcements)
  const displayList = filter === 'all' ? filtered.filter(a => !a.is_emergency) : filtered

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex flex-col">
      <main className="flex-1 px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">campaign</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary dark:text-slate-50 tracking-tight">Announcements</h1>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">
                {user?.department} {user?.level ? `· ${user.level} Level` : ''} · Official GUU Notices
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 text-[20px]">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search announcements by title or keyword..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-outline-variant dark:border-slate-700 rounded-2xl text-sm text-on-surface dark:text-slate-100 placeholder:text-on-surface-variant dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Emergency pinned — hidden when searching */}
          {emergency.length > 0 && !search && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-red-500 text-[20px]">emergency</span>
                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Emergency Alerts</p>
              </div>
              <div className="space-y-3">
                {emergency.map((item, i) => (
                  <div key={i} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                        <span className="material-symbols-outlined text-[12px]">emergency</span>
                        EMERGENCY
                      </span>
                      <span className="text-xs text-red-500 dark:text-red-400">{new Date(item.created_at).toLocaleString()}</span>
                    </div>
                    <h3 className="font-bold text-red-700 dark:text-red-300 mb-2">{item.title}</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">{item.message}</p>
                    <AdminInfo item={item} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { key: 'all', label: 'All' },
              { key: 'regular', label: 'Regular' },
              { key: 'emergency', label: 'Emergency' },
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
                {tab.key === 'emergency' && emergency.length > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{emergency.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Search results info */}
          {search.trim() && !loading && (
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mb-4">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "<span className="font-semibold">{search}</span>"
            </p>
          )}

          {loading && (
            <div className="text-center py-16 text-on-surface-variant dark:text-slate-400 text-sm">Loading announcements...</div>
          )}
          {error && (
            <div className="p-4 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">{error}</div>
          )}
          {!loading && !error && displayList.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant dark:text-slate-400 text-sm">
              {search.trim() ? `No announcements found for "${search}"` : 'No announcements yet.'}
            </div>
          )}

          <div className="space-y-4">
            {displayList.map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-outline-variant dark:border-slate-700 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-on-surface dark:text-slate-100">{item.title}</h3>
                  <span className="text-xs text-on-surface-variant dark:text-slate-500 shrink-0">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-on-surface-variant dark:text-slate-400 mb-4 leading-relaxed">{item.message}</p>
                {item.recipient_count > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant dark:text-slate-500 mb-2">
                    <span className="material-symbols-outlined text-[14px]">group</span>
                    {item.recipient_count} recipients
                  </div>
                )}
                <AdminInfo item={item} />
              </div>
            ))}
          </div>

        </div>
      </main>

      <footer className="w-full py-6 px-8 flex justify-center bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500">© 2025 GUU AI Digital Brain. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default Announcements