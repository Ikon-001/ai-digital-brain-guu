import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL
const ADMIN_TOKEN = 'GUU-ADMIN-TOKEN-2025'

const staffRoles = [
  'HOD (Head of Department)',
  'Dean',
  'Lecturer',
  'Registry Staff',
  'ICT Staff',
  'Finance Staff',
  'Library Staff',
  'Admin Staff',
]

function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({ name: '', email: '', department: '', level: '', staffRole: '', adminToken: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showToken, setShowToken] = useState(false)

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Please enter your full name.'
    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!form.department) newErrors.department = 'Please select your department.'
    if (role === 'student' && !form.level) newErrors.level = 'Please select your academic level.'
    if (role === 'admin' && !form.staffRole) newErrors.staffRole = 'Please select your staff role.'
    if (role === 'admin' && !form.adminToken) newErrors.adminToken = 'Please enter the admin token.'
    if (role === 'admin' && form.adminToken && form.adminToken !== ADMIN_TOKEN) newErrors.adminToken = 'Invalid admin token. Please check and try again.'
    return newErrors
  }

  const handleSubmit = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSuccess(false)
      return
    }
    setLoading(true)
    setStatus('')
    setErrors({})
    try {
      await axios.post(`${API_URL}/api/users/register`, {
        name: form.name,
        email: form.email,
        department: form.department,
        level: role === 'student' ? form.level : null,
        staff_role: role === 'admin' ? form.staffRole : null,
        role: role
      })
      await axios.post(`${API_URL}/api/users/request-pin`, { email: form.email })
      setSuccess(true)
      setStatus('Account created! A PIN has been sent to your email.')
      setTimeout(() => {
        navigate(`/verify?email=${encodeURIComponent(form.email)}&mode=register`)
      }, 1500)
    } catch (err) {
      if (err.response?.data?.error?.includes('already')) {
        setErrors({ email: 'An account with this email already exists. Please login instead.' })
      } else {
        setStatus('Registration failed. Please try again.')
      }
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = (name) => `w-full px-4 py-3 bg-surface-container-low dark:bg-slate-700 border rounded-xl text-sm text-on-surface dark:text-slate-100 placeholder:text-on-surface-variant dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-container outline-none transition-all ${errors[name] ? 'border-red-400 dark:border-red-500' : 'border-outline-variant dark:border-slate-600 focus:border-primary-container'}`

  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen pt-16 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-white text-3xl">school</span>
            </div>
            <h1 className="text-3xl font-bold text-primary dark:text-slate-50 tracking-tight mb-2">Create Account</h1>
            <p className="text-on-surface-variant dark:text-slate-400 text-sm">Register to access GUU AI Digital Brain</p>
          </div>

          <div className="flex bg-surface-container dark:bg-slate-800 rounded-xl p-1 mb-8 border border-outline-variant dark:border-slate-700">
            <button onClick={() => { setRole('student'); setErrors({}) }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'student' ? 'bg-primary-container text-white shadow-sm' : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200'}`}>
              Student
            </button>
            <button onClick={() => { setRole('admin'); setErrors({}) }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'admin' ? 'bg-primary-container text-white shadow-sm' : 'text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200'}`}>
              Admin / Staff
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-8 shadow-sm">
            <div className="space-y-5">

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Chukwuemeka Obi" className={fieldClass('name')} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input name="email" value={form.email} onChange={handleChange} placeholder="e.g. chukwuemeka.obi@guu.edu.ng" className={fieldClass('email')} />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Department</label>
                <select name="department" value={form.department} onChange={handleChange} className={fieldClass('department')}>
                  <option value="">Select your department</option>
                  {role === 'admin' && (
                    <>
                      <option value="Administration">Administration</option>
                      <option value="Registry">Registry</option>
                      <option value="ICT Department">ICT Department</option>
                      <option value="Finance">Finance</option>
                      <option value="Library">Library</option>
                    </>
                  )}
                  <optgroup label="College of Agriculture"><option value="Agriculture">Agriculture</option></optgroup>
                  <optgroup label="College of Education">
                    <option value="Education Biology">Education Biology</option>
                    <option value="Education Chemistry">Education Chemistry</option>
                    <option value="Education Guidance and Counseling">Education Guidance and Counseling</option>
                    <option value="Education Mathematics">Education Mathematics</option>
                    <option value="Education Physics">Education Physics</option>
                  </optgroup>
                  <optgroup label="College of Engineering">
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Computer Engineering">Computer Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                  </optgroup>
                  <optgroup label="College of Environmental Sciences"><option value="Environmental Science">Environmental Science</option></optgroup>
                  <optgroup label="College of Humanities">
                    <option value="History and International Studies">History and International Studies</option>
                    <option value="Languages and Literary Studies">Languages and Literary Studies</option>
                    <option value="Theatre and Media Studies">Theatre and Media Studies</option>
                  </optgroup>
                  <optgroup label="College of Law"><option value="Law">Law</option></optgroup>
                  <optgroup label="College of Medical and Health Sciences">
                    <option value="Medicine and Surgery">Medicine and Surgery</option>
                    <option value="Nursing Science">Nursing Science</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Physiotherapy">Physiotherapy</option>
                  </optgroup>
                  <optgroup label="College of Natural and Applied Sciences">
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics and Statistics">Mathematics and Statistics</option>
                    <option value="Microbiology">Microbiology</option>
                  </optgroup>
                  <optgroup label="Joseph Bokai School of Social and Managerial Sciences">
                    <option value="Accounting">Accounting</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Economics">Economics</option>
                    <option value="Mass Communication">Mass Communication</option>
                  </optgroup>
                </select>
                {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
              </div>

              {role === 'student' && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Academic Level</label>
                  <select name="level" value={form.level} onChange={handleChange} className={fieldClass('level')}>
                    <option value="">Select your level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                    <option value="600">600 Level</option>
                  </select>
                  {errors.level && <p className="text-xs text-red-500 mt-1">{errors.level}</p>}
                </div>
              )}

              {role === 'admin' && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Staff Role</label>
                  <select name="staffRole" value={form.staffRole} onChange={handleChange} className={fieldClass('staffRole')}>
                    <option value="">Select your staff role</option>
                    {staffRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.staffRole && <p className="text-xs text-red-500 mt-1">{errors.staffRole}</p>}
                </div>
              )}

              {role === 'admin' && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-2">Admin Token</label>
                  <div className="relative">
                    <input
                      name="adminToken"
                      type={showToken ? 'text' : 'password'}
                      value={form.adminToken}
                      onChange={handleChange}
                      placeholder="Enter admin token"
                      className={fieldClass('adminToken') + ' pr-12'}
                    />
                    <button type="button" onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-slate-400 hover:text-on-surface dark:hover:text-slate-200 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">{showToken ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {errors.adminToken && <p className="text-xs text-red-500 mt-1">{errors.adminToken}</p>}
                </div>
              )}

              {status && (
                <div className={`p-4 rounded-xl text-sm font-medium ${success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                  {status}
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading}
                className="w-full bg-primary-container text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating Account...' : `Create ${role === 'admin' ? 'Admin' : 'Student'} Account`}
              </button>

              <p className="text-center text-xs text-on-surface-variant dark:text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-container dark:text-blue-400 font-semibold hover:underline">Login here</Link>
              </p>
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

export default Register