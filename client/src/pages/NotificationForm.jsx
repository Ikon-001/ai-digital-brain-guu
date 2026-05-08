import { useState } from 'react'
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

const adminLinks = [
  { to: '/admin/notify', label: 'Send Notification', icon: 'campaign' },
  { to: '/admin/chat-logs', label: 'Chat Logs', icon: 'chat_bubble' },
  { to: '/admin/notification-logs', label: 'Notification Logs', icon: 'notifications' },
  { to: '/admin/users', label: 'User Management', icon: 'group' },
]

const departmentOptions = [
  { value: '', label: '── College of Agriculture ──', disabled: true },
  { value: 'dept:Agriculture', label: 'Agriculture' },
  { value: '', label: '── College of Education ──', disabled: true },
  { value: 'dept:Education Biology', label: 'Education Biology' },
  { value: 'dept:Education Chemistry', label: 'Education Chemistry' },
  { value: 'dept:Education Guidance and Counseling', label: 'Education Guidance and Counseling' },
  { value: 'dept:Education Mathematics', label: 'Education Mathematics' },
  { value: 'dept:Education Physics', label: 'Education Physics' },
  { value: '', label: '── College of Engineering ──', disabled: true },
  { value: 'dept:Civil Engineering', label: 'Civil Engineering' },
  { value: 'dept:Computer Engineering', label: 'Computer Engineering' },
  { value: 'dept:Electrical Engineering', label: 'Electrical Engineering' },
  { value: 'dept:Mechanical Engineering', label: 'Mechanical Engineering' },
  { value: '', label: '── College of Environmental Sciences ──', disabled: true },
  { value: 'dept:Environmental Science', label: 'Environmental Science' },
  { value: '', label: '── College of Humanities ──', disabled: true },
  { value: 'dept:History and International Studies', label: 'History and International Studies' },
  { value: 'dept:Languages and Literary Studies', label: 'Languages and Literary Studies' },
  { value: 'dept:Theatre and Media Studies', label: 'Theatre and Media Studies' },
  { value: '', label: '── College of Law ──', disabled: true },
  { value: 'dept:Law', label: 'Law' },
  { value: '', label: '── College of Medical and Health Sciences ──', disabled: true },
  { value: 'dept:Medicine and Surgery', label: 'Medicine and Surgery' },
  { value: 'dept:Nursing Science', label: 'Nursing Science' },
  { value: 'dept:Pharmacy', label: 'Pharmacy' },
  { value: 'dept:Physiotherapy', label: 'Physiotherapy' },
  { value: '', label: '── College of Natural and Applied Sciences ──', disabled: true },
  { value: 'dept:Biochemistry', label: 'Biochemistry' },
  { value: 'dept:Computer Science', label: 'Computer Science' },
  { value: 'dept:Mathematics and Statistics', label: 'Mathematics and Statistics' },
  { value: 'dept:Microbiology', label: 'Microbiology' },
  { value: '', label: '── Joseph Bokai School of Social and Managerial Sciences ──', disabled: true },
  { value: 'dept:Accounting', label: 'Accounting' },
  { value: 'dept:Business Administration', label: 'Business Administration' },
  { value: 'dept:Economics', label: 'Economics' },
  { value: 'dept:Mass Communication', label: 'Mass Communication' },
]

const audienceOptions = [
  { value: 'level:100', label: '100 Level' },
  { value: 'level:200', label: '200 Level' },
  { value: 'level:300', label: '300 Level' },
  { value: 'level:400', label: '400 Level' },
  { value: 'level:500', label: '500 Level' },
  { value: 'level:600', label: '600 Level' },
  { value: 'all_students', label: 'All Students' },
  { value: 'all_staff', label: 'All Staff' },
  { value: 'all', label: 'All Members' },
]

function AdminSidebar() {
  const location = useLocation()
  return (
    <aside className="w-64 shrink-0 hidden md:block">
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
    </aside>
  )
}

function NotificationForm() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [selectedTargets, setSelectedTargets] = useState([])
  const [logic, setLogic] = useState('OR')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const addTarget = (value) => {
    if (!value || selectedTargets.includes(value)) return
    setSelectedTargets(prev => [...prev, value])
  }

  const removeTarget = (value) => {
    setSelectedTargets(prev => prev.filter(t => t !== value))
  }

  const getLabel = (value) => {
    return [...departmentOptions, ...audienceOptions].find(o => o.value === value)?.label || value
  }

  const sendNotification = async () => {
    if (!title || !message) {
      setStatus('Please fill in title and message.')
      setSuccess(false)
      return
    }
    if (selectedTargets.length === 0) {
      setStatus('Please select at least one target group.')
      setSuccess(false)
      return
    }
    setLoading(true)
    setStatus('')
    try {
      const res = await axios.post(`${API_URL}/api/notify`, {
        title,
        message,
        targets: selectedTargets,
        logic,
        sent_by: 'admin@guu.edu.ng'
      })
      setStatus(res.data.message)
      setSuccess(true)
      setTitle('')
      setMessage('')
      setSelectedTargets([])
      setLogic('OR')
    } catch {
      setStatus('Failed to send notification.')
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen pt-16 flex flex-col">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-6xl mx-auto flex gap-8">

          <AdminSidebar />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">campaign</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary dark:text-slate-50 tracking-tight">Send Notification</h1>
                <p className="text-xs text-on-surface-variant dark:text-slate-400">Admin Panel — GUU AI Digital Brain</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-8 shadow-sm space-y-6">

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Notification Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Semester Registration Deadline"
                  className="w-full px-4 py-3 bg-surface-container-low dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-xl text-sm text-on-surface dark:text-slate-100 placeholder:text-on-surface-variant dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your notification message here..."
                  rows={5}
                  className="w-full px-4 py-3 bg-surface-container-low dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-xl text-sm text-on-surface dark:text-slate-100 placeholder:text-on-surface-variant dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all resize-vertical"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Target Audience</label>

                <div className="flex gap-2 mb-2">
                  <select
                    onChange={e => { addTarget(e.target.value); e.target.value = '' }}
                    defaultValue=""
                    className="flex-1 px-4 py-3 bg-surface-container-low dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-xl text-sm text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary-container outline-none transition-all"
                  >
                    <option value="" disabled>Select Department</option>
                    {departmentOptions.map((opt, i) => (
                      opt.disabled
                        ? <option key={i} value="" disabled style={{ fontWeight: 'bold', color: '#888' }}>{opt.label}</option>
                        : <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>

                  <select
                    value={logic}
                    onChange={e => setLogic(e.target.value)}
                    className="w-24 px-3 py-3 bg-surface-container-low dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-xl text-sm text-on-surface dark:text-slate-100 font-bold focus:ring-2 focus:ring-primary-container outline-none transition-all text-center"
                  >
                    <option value="OR">OR</option>
                    <option value="AND">AND</option>
                  </select>

                  <select
                    onChange={e => { addTarget(e.target.value); e.target.value = '' }}
                    defaultValue=""
                    className="flex-1 px-4 py-3 bg-surface-container-low dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-xl text-sm text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary-container outline-none transition-all"
                  >
                    <option value="" disabled>Select Audience</option>
                    {audienceOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <p className="text-xs text-on-surface-variant dark:text-slate-500 mb-3">
                  {logic === 'AND'
                    ? 'AND — sends only to users matching ALL selected criteria'
                    : 'OR — sends to users matching ANY selected criteria'}
                </p>

                {selectedTargets.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTargets.map(target => (
                      <span key={target} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-white text-xs font-semibold rounded-full">
                        {getLabel(target)}
                        <button onClick={() => removeTarget(target)} className="hover:opacity-70 transition-opacity">
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {selectedTargets.length === 0 && (
                  <p className="text-xs text-on-surface-variant dark:text-slate-500 mt-2">No targets selected — select from the dropdowns above</p>
                )}
              </div>

              {status && (
                <div className={`p-4 rounded-xl text-sm font-medium ${success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                  {status}
                </div>
              )}

              <button
                onClick={sendNotification}
                disabled={loading}
                className="w-full bg-primary-container text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">send</span>
                {loading ? 'Sending...' : 'Send Notification'}
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

export default NotificationForm