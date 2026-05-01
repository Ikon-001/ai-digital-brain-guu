import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const { dark, setDark } = useTheme()
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/chat', label: 'Student Chat' },
    { to: '/register', label: 'Register' },
    { to: '/admin/notify', label: 'Admin' },
  ]

  return (
    <header className="bg-white dark:bg-slate-950 flex justify-between items-center px-8 h-16 w-full fixed top-0 z-50 border-b border-slate-200 dark:border-slate-800">
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

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDark(!dark)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Toggle theme"
        >
          <span className="material-symbols-outlined text-[20px]">
            {dark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  )
}

export default Navbar