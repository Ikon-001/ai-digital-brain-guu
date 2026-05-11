import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const { dark, setDark } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [adminExpanded, setAdminExpanded] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const storedUser = localStorage.getItem('guu_user')
  const user = storedUser ? JSON.parse(storedUser) : null
  const isLoggedIn = !!user
  const isAdmin = user?.role === 'admin'
  const isAdminPage = location.pathname.startsWith('/admin')

  const logout = () => {
    localStorage.removeItem('guu_user')
    setMenuOpen(false)
    setShowLogoutModal(false)
    navigate('/')
  }

  const adminSubLinks = [
    { to: '/admin/notify', label: 'Send Notification', icon: 'campaign' },
    { to: '/admin/chat-logs', label: 'Chat Logs', icon: 'chat_bubble' },
    { to: '/admin/notification-logs', label: 'Notification Logs', icon: 'notifications' },
    { to: '/admin/users', label: 'User Management', icon: 'group' },
    { to: '/admin/feedback', label: 'Feedback', icon: 'feedback' },
  ]

  const desktopLinks = isLoggedIn
    ? [
        { to: '/', label: 'Home' },
        { to: '/chat', label: 'AI Assistant' },
        { to: '/announcements', label: 'Announcements' },
        { to: '/feedback', label: 'Feedback' },
        ...(isAdmin ? [{ to: '/admin/notify', label: 'Admin' }] : []),
        { to: '/profile', label: user?.name?.split(' ')[0] || 'Profile' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/chat', label: 'AI Assistant' },
        { to: '/register', label: 'Register' },
        { to: '/login', label: 'Login' },
      ]

  return (
    <>
      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setShowLogoutModal(false)} />
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-outline-variant dark:border-slate-700 p-8 shadow-xl w-full max-w-sm">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-500 text-2xl">logout</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface dark:text-slate-50 text-center mb-2">Log Out?</h3>
              <p className="text-sm text-on-surface-variant dark:text-slate-400 text-center mb-6">
                Are you sure you want to log out of your GUU AI Digital Brain account?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-xl border border-outline-variant dark:border-slate-600 text-sm font-semibold text-on-surface dark:text-slate-300 hover:bg-surface-container dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={logout}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Navbar */}
      <header className="bg-white dark:bg-slate-950 w-full fixed top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center px-6 h-16">
          <Link to="/" className="text-lg font-bold text-[#002147] dark:text-slate-50 font-sans tracking-tight">
            GUU AI Digital Brain
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {desktopLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-sans text-sm font-medium tracking-tight transition-colors ${
                  location.pathname === link.to || (link.to === '/admin/notify' && isAdminPage)
                    ? 'text-[#002147] dark:text-blue-400 border-b-2 border-[#002147] dark:border-blue-400 pb-1'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#002147] dark:hover:text-blue-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">{dark ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">{menuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-72 z-50 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 transition-transform duration-300 md:hidden overflow-y-auto ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-700">
          <span className="text-sm font-bold text-[#002147] dark:text-slate-50">
            {isLoggedIn ? `Hi, ${user?.name?.split(' ')[0]}` : 'Menu'}
          </span>
          <button onClick={() => setMenuOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <Link to="/" onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined text-[20px]">home</span>
            Home
          </Link>

          <Link to="/chat" onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/chat' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            AI Assistant
          </Link>

          {!isLoggedIn && (
            <>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/register' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                Register
              </Link>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/login' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[20px]">login</span>
                Login
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link to="/announcements" onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/announcements' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[20px]">campaign</span>
                Announcements
              </Link>

              <Link to="/feedback" onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/feedback' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[20px]">feedback</span>
                Feedback
              </Link>

              <Link to="/profile" onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/profile' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <span className="material-symbols-outlined text-[20px]">person</span>
                My Profile
              </Link>

              {isAdmin && (
                <>
                  <div className="pt-2 pb-1">
                    <div className="border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div>
                    <button
                      onClick={() => setAdminExpanded(!adminExpanded)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${isAdminPage ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                        Admin
                      </div>
                      <span className="material-symbols-outlined text-[18px] transition-transform duration-200"
                        style={{ transform: adminExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        expand_more
                      </span>
                    </button>
                    {adminExpanded && (
                      <div className="mt-1 ml-4 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                        {adminSubLinks.map(link => (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${location.pathname === link.to ? 'bg-primary-container text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="pt-2 pb-1">
                <div className="border-t border-slate-200 dark:border-slate-700" />
              </div>
              <button
                onClick={() => { setMenuOpen(false); setShowLogoutModal(true) }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Logout
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}

export default Navbar