import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-ink/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded-sm flex items-center justify-center">
            <span className="text-ink font-display font-800 text-xs">RE</span>
          </div>
          <span className="font-display font-bold text-text text-lg tracking-tight">
            Royal<span className="text-accent">Events</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-md text-sm font-body font-medium transition-all duration-200
                ${pathname === l.to
                  ? 'bg-accent text-ink'
                  : 'text-text-dim hover:text-text hover:bg-border'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-text-dim hover:text-text p-2"
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-surface px-6 py-4 space-y-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-md text-sm font-body font-medium transition-all
                ${pathname === l.to ? 'bg-accent text-ink' : 'text-text-dim hover:text-text hover:bg-border'}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
