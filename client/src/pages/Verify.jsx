import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

function Verify() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const mode = searchParams.get('mode') || 'register'

  const [pin, setPin] = useState(['', '', '', ''])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!email) navigate('/login')
  }, [email])

  const handleInput = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (pasted.length === 4) {
      setPin(pasted.split(''))
      inputRefs.current[3]?.focus()
    }
  }

  const verifyPin = async () => {
    const fullPin = pin.join('')
    if (fullPin.length < 4) {
      setStatus('Please enter the full 4-digit PIN.')
      setSuccess(false)
      return
    }
    setLoading(true)
    setStatus('')
    try {
      const res = await axios.post(`${API_URL}/api/users/verify-pin`, { email, pin: fullPin })
      const user = res.data.user
      localStorage.setItem('guu_user', JSON.stringify(user))
      setSuccess(true)
      setStatus(`Welcome, ${user.name}! Redirecting...`)
      setTimeout(() => {
        navigate('/profile')
      }, 1500)
    } catch (err) {
      setSuccess(false)
      if (err.response?.status === 400) {
        setStatus('Incorrect or expired PIN. Please try again.')
      } else {
        setStatus('Verification failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const resendPin = async () => {
    setResending(true)
    try {
      await axios.post(`${API_URL}/api/users/request-pin`, { email })
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch {
      setStatus('Failed to resend PIN. Please try again.')
      setSuccess(false)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-white text-3xl">pin</span>
          </div>
          <h1 className="text-3xl font-bold text-primary dark:text-slate-50 tracking-tight mb-2">Check Your Email</h1>
          <p className="text-on-surface-variant dark:text-slate-400 text-sm">
            We sent a 4-digit PIN to
          </p>
          <p className="text-primary-container dark:text-blue-400 font-semibold text-sm mt-1">{email}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-8 shadow-sm space-y-6">

          {/* PIN inputs */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-4 text-center">Enter Your PIN</label>
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleInput(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-14 h-14 text-center text-2xl font-bold bg-surface-container-low dark:bg-slate-700 border-2 border-outline-variant dark:border-slate-600 rounded-2xl text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all"
                />
              ))}
            </div>
          </div>

          {status && (
            <div className={`p-4 rounded-xl text-sm font-medium ${success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
              {status}
            </div>
          )}

          {resent && (
            <div className="p-4 rounded-xl text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
              PIN resent successfully. Check your email.
            </div>
          )}

          <button
            onClick={verifyPin}
            disabled={loading || pin.join('').length < 4}
            className="w-full bg-primary-container text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">verified</span>
            {loading ? 'Verifying...' : 'Verify PIN'}
          </button>

          <div className="flex items-center justify-between text-xs text-on-surface-variant dark:text-slate-500">
            <button
              onClick={resendPin}
              disabled={resending}
              className="hover:text-primary-container dark:hover:text-blue-400 transition-colors font-semibold disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend PIN'}
            </button>
            <Link to="/login" className="hover:text-primary-container dark:hover:text-blue-400 transition-colors font-semibold">
              Wrong email?
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-on-surface-variant dark:text-slate-500 mt-6">
          PIN expires in 10 minutes. Check your spam folder if you don't see it.
        </p>
      </div>
    </div>
  )
}

export default Verify