import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import guuLogo from '../assets/guu-logo.jpeg'

const API_URL = import.meta.env.VITE_API_URL

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const requestPin = async () => {
    setEmailError('')
    setStatus('')

    if (!email.trim()) {
      setEmailError('Please enter your email address.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API_URL}/api/users/request-pin`, { email })
      setSuccess(true)
      setStatus('PIN sent to your email. Check your inbox.')
      setTimeout(() => {
        navigate(`/verify?email=${encodeURIComponent(email)}&mode=login`)
      }, 1500)
    } catch (err) {
      setSuccess(false)
      if (err.response?.status === 404) {
        setEmailError('No account found with that email. Please register first.')
      } else {
        setStatus('Failed to send PIN. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          {/* ADDED: GUU Logo */}
          <div className="flex justify-center mb-4">
            <img src={guuLogo} alt="GUU Logo" className="h-16 w-16 object-contain rounded-full bg-white p-1 ring-1 ring-slate-200 dark:ring-slate-700" />
          </div>
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-white text-3xl">login</span>
          </div>
          <h1 className="text-3xl font-bold text-primary dark:text-slate-50 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm">Enter your registered email to receive a login PIN</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-8 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError('') }}
              onKeyDown={e => e.key === 'Enter' && requestPin()}
              placeholder="e.g. student@guu.edu.ng"
              className={`w-full px-4 py-3 bg-surface-container-low dark:bg-slate-700 border rounded-xl text-sm text-on-surface dark:text-slate-100 placeholder:text-on-surface-variant dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-container outline-none transition-all ${emailError ? 'border-red-400 dark:border-red-500' : 'border-outline-variant dark:border-slate-600'}`}
            />
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
          </div>

          {status && (
            <div className={`p-4 rounded-xl text-sm font-medium ${success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
              {status}
            </div>
          )}

          <button onClick={requestPin} disabled={loading}
            className="w-full bg-primary-container text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-xl">send</span>
            {loading ? 'Sending PIN...' : 'Send My PIN'}
          </button>

          <p className="text-center text-xs text-on-surface-variant dark:text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-container dark:text-blue-400 font-semibold hover:underline">Register here</Link>
          </p>
        </div>

        <p className="text-center text-xs text-on-surface-variant dark:text-slate-500 mt-6">
          A 4-digit PIN will be sent to your email. It expires in 10 minutes.
        </p>
      </div>
    </div>
  )
}

export default Login