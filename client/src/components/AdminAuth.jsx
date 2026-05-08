import { useState } from 'react'

const ADMIN_PASSWORD = 'guu-admin-2026'

function AdminAuth({ children }) {
  const [authed, setAuthed] = useState(sessionStorage.getItem('admin_auth') === 'true')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthed(true)
    } else {
      setError('Incorrect password. Please try again.')
    }
  }

  if (authed) return children

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-white text-3xl">lock</span>
          </div>
          <h1 className="text-3xl font-bold text-primary dark:text-slate-50 tracking-tight mb-2">Admin Access</h1>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm">Enter the admin password to continue</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-8 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 bg-surface-container-low dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-xl text-sm text-on-surface dark:text-slate-100 placeholder:text-on-surface-variant dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-primary-container text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">login</span>
              Enter Admin Panel
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-on-surface-variant dark:text-slate-500 mt-6">
          Authorized personnel only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  )
}

export default AdminAuth