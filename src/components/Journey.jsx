import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CERTS, JOURNEY } from '../data/content'
import { Reveal, TiltCard } from './ui'

gsap.registerPlugin(ScrollTrigger)

export default function Journey() {
  const wrap = useRef(null)
  const fill = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(fill.current, { scaleY: 1 })
        return
      }
      gsap.to(fill.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: wrap.current, start: 'top 70%', end: 'bottom 60%', scrub: true },
      })
      gsap.utils.toArray('.t-item').forEach((el) => {
        gsap.from(el, { x: -50, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
      })
    }, wrap)
    return () => ctx.revert()
  }, [])

  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Story so far</p>
          <h2 id="journey-title" className="h2">My <span className="grad-text">journey</span></h2>
        </Reveal>

        <div className="timeline" ref={wrap} style={{ marginTop: '2.5rem', maxWidth: 760 }}>
          <div className="timeline-track" aria-hidden="true"><div className="timeline-fill" ref={fill} /></div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '1.5rem' }}>
            {JOURNEY.map((j) => (
              <li key={j.title} className="t-item" style={{ position: 'relative' }}>
                <span className="t-dot" aria-hidden="true">{j.mark}</span>
                <div className="glass" style={{ padding: '1.3rem 1.5rem' }}>
                  <p className="eyebrow" style={{ margin: 0 }}>{j.when}</p>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0.3rem 0' }}>{j.title}</h3>
                  <p style={{ margin: 0, color: 'var(--muted)' }}>{j.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <Reveal>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4.5rem 0 1.5rem' }}>
            <span className="grad-text">Certifications</span>
          </h3>
        </Reveal>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {CERTS.map((c, i) => (
            <li key={c.name}>
              <Reveal delay={i * 0.07}>
                <TiltCard max={12}>
                  <div className="glass" style={{ padding: '1.4rem', height: '100%' }}>
                    <span className="c-ico" style={{ marginBottom: '0.8rem' }} aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8" /></svg>
                    </span>
                    <h4 style={{ fontWeight: 700, margin: 0, fontSize: '1.05rem' }}>{c.name}</h4>
                    <p style={{ margin: '0.3rem 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>{c.by}</p>
                  </div>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
