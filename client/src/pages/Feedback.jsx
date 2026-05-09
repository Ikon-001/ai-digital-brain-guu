import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const subjectOptions = [
  'General Inquiry',
  'Technical Issue',
  'Complaint',
  'Suggestion',
  'Emergency Report',
  'Other',
]

function Feedback() {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const submitFeedback = async () => {
    if (!email || !subject || !message) {
      setStatus('Please fill in all fields.')
      setSuccess(false)
      return
    }
    setLoading(true)
    setStatus('')
    try {
      await axios.post(`${API_URL}/api/feedback`, {
        student_email: email,
        subject,
        message
      })
      setStatus('Feedback submitted successfully. Thank you!')
      setSuccess(true)
      setEmail('')
      setSubject('')
      setMessage('')
    } catch {
      setStatus('Failed to submit feedback. Please try again.')
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen flex flex-col">
      <main className="flex-1 px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">feedback</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary dark:text-slate-50 tracking-tight">Feedback</h1>
              <p className="text-xs text-on-surface-variant dark:text-slate-400">Send a message to the GUU administration</p>
            </div>
          </div>

          {/* Info banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-500 text-[20px] shrink-0 mt-0.5">info</span>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your feedback goes directly to the admin panel. Use this to report issues, make suggestions, or send general inquiries to the university administration.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-6 md:p-8 shadow-sm space-y-6">

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Your Email</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. student@guu.edu.ng"
                className="w-full px-4 py-3 bg-surface-container-low dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-xl text-sm text-on-surface dark:text-slate-100 placeholder:text-on-surface-variant dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-container outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Subject</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-xl text-sm text-on-surface dark:text-slate-100 focus:ring-2 focus:ring-primary-container outline-none transition-all"
              >
                <option value="" disabled>Select a subject</option>
                {subjectOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe your issue, suggestion, or inquiry in detail..."
                rows={6}
                className="w-full px-4 py-3 bg-surface-container-low dark:bg-slate-700 border border-outline-variant dark:border-slate-600 rounded-xl text-sm text-on-surface dark:text-slate-100 placeholder:text-on-surface-variant dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-container outline-none transition-all resize-vertical"
              />
            </div>

            {status && (
              <div className={`p-4 rounded-xl text-sm font-medium ${success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                {status}
              </div>
            )}

            <button
              onClick={submitFeedback}
              disabled={loading}
              className="w-full bg-primary-container text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">send</span>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 px-8 flex justify-center bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500">© 2025 GUU AI Digital Brain. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default Feedback