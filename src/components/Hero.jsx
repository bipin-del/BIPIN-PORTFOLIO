import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { CONTACT, PROFILE, STATS } from '../data/content'
import { useApp } from '../context/AppContext'
import { scrollToId } from '../lib/store'
import { Counter, Icon, Magnetic, Reveal } from './ui'

const CharacterScene = lazy(() => import('./three/Scene'))

class Boundary extends Component {
  state = { err: false }
  static getDerivedStateFromError() {
    return { err: true }
  }
  render() {
    return this.state.err ? (
      <div className="stage-fallback"><p>3D view unavailable on this device.</p></div>
    ) : (
      this.props.children
    )
  }
}

function useTyping(words) {
  const [text, setText] = useState('')
  useEffect(() => {
    let i = 0
    let j = 0
    let del = false
    let t
    const step = () => {
      const w = words[i]
      j += del ? -1 : 1
      setText(w.slice(0, j))
      let d = del ? 40 : 85
      if (!del && j === w.length) { del = true; d = 1400 }
      else if (del && j === 0) { del = false; i = (i + 1) % words.length; d = 350 }
      t = setTimeout(step, d)
    }
    t = setTimeout(step, 400)
    return () => clearTimeout(t)
  }, [words])
  return text
}

export default function Hero({ ready }) {
  const { section, saiyan } = useApp()
  const reduce = useReducedMotion()
  const typed = useTyping(PROFILE.roles)
  const [shake, setShake] = useState(false)
  const [visible, setVisible] = useState(true)
  const stage = useRef(null)

  useEffect(() => {
    const on = () => {
      if (reduce) return
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
    window.addEventListener('powerup', on)
    return () => window.removeEventListener('powerup', on)
  }, [reduce])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' })
    if (stage.current) io.observe(stage.current)
    return () => io.disconnect()
  }, [])

  return (
    <section id="home" className={`section ${shake ? 'shake' : ''}`} style={{ paddingTop: '8rem', minHeight: '100vh', display: 'flex', alignItems: 'center' }} aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" data-parallax="-0.12" />
      <div className="container-x" style={{ display: 'grid', gap: '2rem', alignItems: 'center' }}>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Reveal>
              <p className="eyebrow" style={{ marginBottom: '0.8rem' }}>B.E. CSE · Coimbatore · 2023 – 2027</p>
              <h1 id="hero-title" className="hero-title">
                Hey, I am <span className="grad-text">Bipin</span>
              </h1>
              <p style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)', fontWeight: 600, margin: '1rem 0', minHeight: '2.6rem' }} aria-live="off">
                <span className="grad-text">{typed}</span>
                <span className="caret" aria-hidden="true" />
              </p>
              <p className="lead" style={{ fontSize: '1.1rem' }}>{PROFILE.intro}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center', margin: '2rem 0', flexWrap: 'wrap' }}>
                <Magnetic as="button" id="hire-me" className="btn btn-primary" onClick={() => scrollToId('connect')} style={{ fontSize: '1.1rem', padding: '1rem 2.2rem' }}>
                  Hire me
                </Magnetic>
                <Magnetic as="a" id="hero-github" className="btn btn-ghost btn-icon" href={CONTACT.github} target="_blank" rel="noopener noreferrer" aria-label="Bipin on GitHub (opens in a new tab)">
                  <Icon.github />
                </Magnetic>
              </div>
              <dl style={{ display: 'flex', gap: '2.2rem', margin: 0, flexWrap: 'wrap' }}>
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dd style={{ margin: 0, fontSize: '2.4rem', fontWeight: 800, lineHeight: 1 }} className="grad-text">
                      <Counter to={s.value} />
                    </dd>
                    <dt style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{s.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <div className="stage" ref={stage}>
            <aside className="glass float-card" aria-label="Hackathon win">
              <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                <span className="c-ico"><Icon.trophy /></span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>Hackathon Winner</p>
                  <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.8rem' }}>Tech Accelerate, BITS Pilani Hyderabad</p>
                </div>
              </div>
            </aside>
            {ready && (
              <Boundary>
                <Suspense fallback={<div className="stage-fallback">Summoning character…</div>}>
                  <CharacterScene section={section} saiyan={saiyan} reduced={!!reduce} active={visible} />
                </Suspense>
              </Boundary>
            )}
            <p className="sr-only">Interactive 3D character. Click for a power-up, double-click to wave.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
