import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AppProvider, useApp } from './context/AppContext'
import { NAV } from './data/content'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Journey from './components/Journey'
import Contact from './components/Contact'
import FX from './components/FX'

gsap.registerPlugin(ScrollTrigger)
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

function Shell() {
  const { setSection, toast, say, saiyan, toggleSaiyan } = useApp()

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSection(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    NAV.forEach((n) => {
      const el = document.getElementById(n.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [setSection])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const k = parseFloat(el.dataset.parallax)
        gsap.to(el, { y: () => k * 500, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true } })
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    let i = 0
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      i = k === KONAMI[i] ? i + 1 : k === KONAMI[0] ? 1 : 0
      if (i === KONAMI.length) {
        i = 0
        toggleSaiyan()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleSaiyan])

  const first = useState({ done: false })[0]
  useEffect(() => {
    if (!first.done) { first.done = true; return }
    say(saiyan ? 'SUPER SAIYAN MODE UNLOCKED' : 'Back to normal mode')
  }, [saiyan]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <a href="#home" className="skip">Skip to content</a>
      <FX />
      <Navbar />
      <main>
        <Hero ready={true} />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>
      <footer style={{ padding: '2.5rem 1.25rem', textAlign: 'center', color: 'var(--muted)', borderTop: '1px solid var(--glass-b)' }}>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} Bipin S Menon
        </p>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem' }}>Hint: try the Konami code ↑ ↑ ↓ ↓ ← → ← → B A</p>
      </footer>
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className="toast glass" role="status" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
