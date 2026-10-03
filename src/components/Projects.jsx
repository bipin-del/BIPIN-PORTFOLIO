import { useState } from 'react'
import { PROJECTS } from '../data/content'
import { sfx } from '../lib/sfx'
import { Reveal, TiltCard } from './ui'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

const VISUALS = {
  ocr: (
    <svg viewBox="0 0 200 100" width="100%" height="100%" style={{ color: 'var(--accent-2)' }} aria-hidden="true">
      <rect x="55" y="12" width="90" height="76" rx="8" {...stroke} />
      <path d="M72 34h56M72 50h40M72 66h50" {...stroke} opacity=".7" />
      <path d="M45 50h110" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="d" values="M45 20h110;M45 80h110;M45 20h110" dur="3s" repeatCount="indefinite" />
      </path>
    </svg>
  ),
  civisnap: (
    <svg viewBox="0 0 200 100" width="100%" height="100%" style={{ color: 'var(--accent-2)' }} aria-hidden="true">
      <path d="M100 88s-26-26-26-46a26 26 0 0 1 52 0c0 20-26 46-26 46z" {...stroke} />
      <circle cx="100" cy="42" r="10" {...stroke} />
      <circle cx="100" cy="88" r="14" fill="none" stroke="var(--accent)" strokeWidth="2">
        <animate attributeName="r" values="6;28" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  ),
  lifeline: (
    <svg viewBox="0 0 200 100" width="100%" height="100%" style={{ color: 'var(--accent-2)' }} aria-hidden="true">
      <path d="M10 55h45l12-30 18 62 16-44 10 12h79" {...stroke} strokeDasharray="400" strokeDashoffset="400">
        <animate attributeName="stroke-dashoffset" values="400;0;0" dur="2.6s" repeatCount="indefinite" />
      </path>
    </svg>
  ),
}

function ProjectCard({ p, i }) {
  const [flip, setFlip] = useState(false)
  const toggle = () => {
    sfx.whoosh(0.04)
    setFlip((f) => !f)
  }
  return (
    <Reveal delay={i * 0.12}>
      <TiltCard max={7}>
        <div className="flip-scene">
          <div
            className={`flip ${flip ? 'is-flipped' : ''}`}
            role="button"
            tabIndex={0}
            aria-pressed={flip}
            aria-label={`${p.title}. Press to ${flip ? 'show summary' : 'show details'}`}
            id={`project-${p.id}`}
            onClick={toggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggle()
              }
            }}
          >
            <article className="face glass">
              <div className="proj-visual">{VISUALS[p.id]}</div>
              {p.status && <span className="chip" style={{ alignSelf: 'flex-start', marginBottom: '0.6rem', background: 'var(--accent)', color: 'var(--on-accent)', fontWeight: 700 }}>{p.status}</span>}
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem', lineHeight: 1.25 }}>{p.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0 }}>{p.summary}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
                {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
            </article>
            <div className="face back glass">
              <p className="eyebrow">{p.short}</p>
              <ul style={{ margin: '1rem 0', paddingLeft: '1.1rem', display: 'grid', gap: '0.7rem', color: 'var(--text)' }}>
                {p.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
              <p style={{ marginTop: 'auto', color: 'var(--muted)', fontSize: '0.85rem' }}>Press to flip back</p>
            </div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Missions</p>
          <h2 id="projects-title" className="h2">Featured <span className="grad-text">projects</span></h2>
          <p className="lead">Hover to tilt, click (or press Enter) to flip a card for details.</p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginTop: '3rem' }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
        </div>
      </div>
    </section>
  )
}
