import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Header({ onOpenKeyboardHelp }) {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-void/60 backdrop-blur-md"
    >
      <nav className="px-4 md:px-12 lg:px-20 py-4" aria-label="Primary">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo - Far Left */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/aura_logo.png"
              alt="Aura Logo"
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
            />
            <span className="font-display font-bold text-2xl text-white group-hover:text-signal transition-colors">
              Aura
            </span>
          </Link>

          {/* Navigation - Right Side */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" active={isActive('/')}>
              Home
            </NavLink>
            <NavLink to="/verify" active={isActive('/verify')}>
              Verify
            </NavLink>
            <NavLink to="/register" active={isActive('/register')}>
              Register
            </NavLink>
            <NavLink to="/transfer" active={isActive('/transfer')}>
              Transfer
            </NavLink>
            <NavLink to="/batch-register" active={isActive('/batch-register')}>
              Batch
            </NavLink>
            <NavLink to="/dashboard" active={isActive('/dashboard')}>
              Analytics
            </NavLink>
            <button type="button" onClick={onOpenKeyboardHelp} className="text-fog hover:text-white transition-colors">
              Shortcuts
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-fog/10 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <NavLink to="/" active={isActive('/')}>
              Home
            </NavLink>
            <NavLink to="/verify" active={isActive('/verify')}>
              Verify
            </NavLink>
            <NavLink to="/register" active={isActive('/register')}>
              Register
            </NavLink>
            <NavLink to="/transfer" active={isActive('/transfer')}>
              Transfer
            </NavLink>
            <NavLink to="/batch-register" active={isActive('/batch-register')}>
              Batch
            </NavLink>
            <NavLink to="/dashboard" active={isActive('/dashboard')}>
              Analytics
            </NavLink>
          </div>
          <div className="flex flex-col gap-3">
            <button type="button" onClick={onOpenKeyboardHelp} className="btn-outline w-full">
              Keyboard Shortcuts
            </button>
            <Link to="/register" className="btn-primary w-full text-center">
              Open Wallet Tools
            </Link>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`font-medium transition-colors relative group rounded-lg px-3 py-3 text-center min-h-[44px] ${
        active
          ? 'text-signal'
          : 'text-fog hover:text-white'
      }`}
    >
      {children}
      {/* Hover underline - animates from left to right */}
      <span
        className="absolute -bottom-1 left-0 h-0.5 bg-signal w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
      />
    </Link>
  )
}
