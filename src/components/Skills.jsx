import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SKILLS } from '../data/content'
import { sfx } from '../lib/sfx'
import { Reveal } from './ui'

export default function Skills() {
  const [active, setActive] = useState(SKILLS[1])
  const n = SKILLS.length

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Skill tree</p>
          <h2 id="skills-title" className="h2">What I <span className="grad-text">work with</span></h2>
          <p className="lead">Hover or tab to pause the orbit, then select a branch to see what is inside.</p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10 items-center" style={{ marginTop: '3rem' }}>
          <Reveal>
            <div className="orbit">
              <div className="orbit-ring" style={{ inset: '8%' }} />
              <div className="orbit-ring" style={{ inset: '30%' }} />
              <div className="orbit-core">
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '1.3rem' }}>Bipin</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted)' }}>Developer</p>
                </div>
              </div>
              <div className="orbit-spin">
                {SKILLS.map((s, i) => {
                  const a = (i / n) * Math.PI * 2 - Math.PI / 2
                  return (
                    <div key={s.key} className="orbit-node" style={{ left: `${50 + 42 * Math.cos(a)}%`, top: `${50 + 42 * Math.sin(a)}%` }}>
                      <div className="orbit-inner">
                        <button
                          className="skill-node"
                          aria-pressed={active.key === s.key}
                          onClick={() => { sfx.whoosh(0.03); setActive(s) }}
                          onMouseEnter={() => setActive(s)}
                          onFocus={() => setActive(s)}
                        >
                          {s.name}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass" style={{ padding: '2rem', minHeight: 280 }} aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div key={active.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.25 }}>
                  <p className="eyebrow">Branch</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.3rem 0 1.2rem' }}>{active.name}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {active.items.map((it, i) => (
                      <motion.span key={it} className="chip" style={{ fontSize: '1rem', padding: '0.5rem 1.1rem' }} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
                        {it}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
