import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const { dark, setDark } = useTheme()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/chat', label: 'Student Chat' },
    { to: '/register', label: 'Register' },
    { to: '/admin/notify', label: 'Admin' },
  ]

  return (
    <header className="bg-white dark:bg-slate-950 w-full fixed top-0 z-50 border-b border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center px-6 h-16">
        <div className="text-lg font-bold text-[#002147] dark:text-slate-50 font-sans tracking-tight">
          GUU AI Digital Brain
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-sans text-sm font-medium tracking-tight transition-colors ${
                location.pathname === link.to
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`font-sans text-sm font-medium tracking-tight transition-colors ${
                location.pathname === link.to
                  ? 'text-[#002147] dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Navbar