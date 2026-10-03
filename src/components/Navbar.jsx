import { useState } from 'react'
import { motion } from 'framer-motion'
import { NAV } from '../data/content'
import { useApp } from '../context/AppContext'
import { scrollToId } from '../lib/store'
import { sfx } from '../lib/sfx'
import { Icon, Magnetic } from './ui'

export default function Navbar() {
  const { section, theme, toggleTheme, sound, toggleSound } = useApp()
  const [open, setOpen] = useState(false)

  const go = (id) => {
    sfx.whoosh()
    setOpen(false)
    scrollToId(id)
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = '/Bipin_S_Menon_Resume.pdf'
    a.download = 'Bipin_S_Menon_Resume.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <header>
      <nav className="nav-pill" aria-label="Primary">
        <button className="nav-link" style={{ fontWeight: 800, color: 'var(--text)', padding: '0.3rem 0.5rem' }} onClick={() => go('home')} aria-label="Bipin S Menon, go to top">
          <span className="grad-text">BSM</span>
        </button>
        <ul className="nav-links" style={{ display: 'flex', gap: '0.2rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className="nav-link"
                style={{ display: 'block', textDecoration: 'none' }}
                aria-current={section === n.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  go(n.id)
                }}
              >
                {section === n.id && <motion.span layoutId="nav-active" className="nav-active" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span style={{ position: 'relative' }}>{n.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button id="sound-toggle" className="icon-btn" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Turn sound off' : 'Turn sound on'} title="Sound effects">
            {sound ? <Icon.volume /> : <Icon.mute />}
          </button>
          <button id="theme-toggle" className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? <Icon.sun /> : <Icon.moon />}
          </button>
          <Magnetic
            as="a"
            href="/resume.html"
            target="_blank"
            rel="noopener noreferrer"
            id="resume-btn"
            className="btn btn-primary nav-resume"
          >
            <Icon.eye />
            <span className="hidden sm:inline">View Resume</span>
            <span className="sm:hidden">Resume</span>
          </Magnetic>
          <button className="icon-btn nav-menu-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
            <Icon.menu />
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass" style={{ position: 'fixed', top: '5rem', left: '0.75rem', right: '0.75rem', zIndex: 59, padding: '0.6rem' }}>
          {NAV.map((n) => (
            <button key={n.id} className="nav-link" style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.8rem 1rem' }} aria-current={section === n.id ? 'true' : undefined} onClick={() => go(n.id)}>
              {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
