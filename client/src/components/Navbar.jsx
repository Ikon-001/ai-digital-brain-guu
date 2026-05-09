import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const { dark, setDark } = useTheme()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [adminExpanded, setAdminExpanded] = useState(false)

  const isAdminPage = location.pathname.startsWith('/admin')

  const adminSubLinks = [
    { to: '/admin/notify', label: 'Send Notification', icon: 'campaign' },
    { to: '/admin/chat-logs', label: 'Chat Logs', icon: 'chat_bubble' },
    { to: '/admin/notification-logs', label: 'Notification Logs', icon: 'notifications' },
    { to: '/admin/users', label: 'User Management', icon: 'group' },
    { to: '/admin/feedback', label: 'Feedback', icon: 'feedback' },
  ]

  const desktopLinks = [
    { to: '/', label: 'Home' },
    { to: '/chat', label: 'AI Assistant' },
    { to: '/announcements', label: 'Announcements' },
    { to: '/register', label: 'Register' },
    { to: '/admin/notify', label: 'Admin' },
  ]

  return (
    <>
      {/* Main Navbar */}
      <header className="bg-white dark:bg-slate-950 w-full fixed top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center px-6 h-16">
          <div className="text-lg font-bold text-[#002147] dark:text-slate-50 font-sans tracking-tight">
            GUU AI Digital Brain
          </div>

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
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title="Toggle theme"
            >
              <span className="material-symbols-outlined text-[20px]">
                {dark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Hamburger - mobile only */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile sidebar drawer */}
      <aside className={`
        fixed top-0 right-0 h-full w-72 z-50 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700
        transition-transform duration-300 md:hidden overflow-y-auto
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-700">
          <span className="text-sm font-bold text-[#002147] dark:text-slate-50">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Sidebar links */}
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

          <Link to="/announcements" onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/announcements' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined text-[20px]">campaign</span>
            Announcements
          </Link>

          <Link to="/profile" onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/profile' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined text-[20px]">person</span>
            My Profile
          </Link>

          <Link to="/feedback" onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/feedback' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined text-[20px]">feedback</span>
            Feedback
          </Link>

          <Link to="/register" onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === '/register' ? 'bg-[#002147] text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Register
          </Link>

          {/* Divider */}
          <div className="pt-2 pb-1">
            <div className="border-t border-slate-200 dark:border-slate-700" />
          </div>

          {/* Admin with sub-menu */}
          <div>
            <button
              onClick={() => setAdminExpanded(!adminExpanded)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                isAdminPage
                  ? 'bg-[#002147] text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.to
                        ? 'bg-primary-container text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Navbar