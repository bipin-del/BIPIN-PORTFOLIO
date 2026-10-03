import { lazy, Suspense, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CONTACT } from '../data/content'
import { openEmail } from '../lib/store'
import { useApp } from '../context/AppContext'
import { Icon, Reveal } from './ui'

const SuccessLottie = lazy(() => import('./SuccessLottie'))
const FORM_ID = import.meta.env.VITE_FORMSPREE_ID

function Card({ icon, label, value, href, ext = true, onClick, id, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <a id={id} className="glass contact-card" href={href} onClick={onClick} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        <span className="c-ico">{icon}</span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted)' }}>{label}</span>
          <span style={{ display: 'block', fontWeight: 600, overflowWrap: 'anywhere' }}>{value}</span>
        </span>
      </a>
      {children}
    </div>
  )
}

export default function Contact() {
  const { say } = useApp()
  const [state, setState] = useState('idle')
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
    } catch {
      const t = document.createElement('textarea')
      t.value = CONTACT.email
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(true)
    say('Email copied to clipboard')
    setTimeout(() => setCopied(false), 1800)
  }

  const submit = async (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const data = Object.fromEntries(new FormData(f))
    if (data.company) return // honeypot
    setState('sending')
    try {
      if (FORM_ID) {
        const r = await fetch(`https://formspree.io/f/${FORM_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
        })
        if (!r.ok) throw new Error('failed')
      } else {
        const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} (${data.email})`)
        const url = `${CONTACT.gmail}&body=${body}`
        window.open(url, '_blank', 'noopener')
      }
      setState('success')
      f.reset()
      setTimeout(() => setState('idle'), 5000)
    } catch {
      setState('error')
    }
  }

  return (
    <section id="connect" className="section" aria-labelledby="connect-title">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Let us talk</p>
          <h2 id="connect-title" className="h2">Get in <span className="grad-text">touch</span></h2>
          <p className="lead">Open to software developer roles. Reach out through any channel below.</p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8" style={{ marginTop: '2.5rem' }}>
          <Reveal>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <Card id="contact-email" icon={<Icon.mail />} label="Email" value={CONTACT.email} href={CONTACT.gmail} onClick={openEmail}>
                <button id="copy-email" className="icon-btn" onClick={copy} aria-label="Copy email address" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                  {copied ? <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>OK</span> : <Icon.copy />}
                </button>
              </Card>
              <Card id="contact-github" icon={<Icon.github />} label="GitHub" value="github.com/bipin-del" href={CONTACT.github} />
              <Card id="contact-linkedin" icon={<Icon.linkedin />} label="LinkedIn" value="linkedin.com/in/bipinsmenon" href={CONTACT.linkedin} />
              <Card id="contact-phone" icon={<Icon.phone />} label="Phone" value={CONTACT.phone} href={CONTACT.tel} ext={false} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="glass" style={{ padding: '1.8rem', display: 'grid', gap: '1rem', position: 'relative', overflow: 'hidden' }} onSubmit={submit} aria-label="Contact form">
              <label>
                <span className="sr-only">Your name</span>
                <input className="field" name="name" placeholder="Your name" required autoComplete="name" />
              </label>
              <label>
                <span className="sr-only">Your email</span>
                <input className="field" type="email" name="email" placeholder="Your email" required autoComplete="email" />
              </label>
              <label>
                <span className="sr-only">Message</span>
                <textarea className="field" name="message" rows={5} placeholder="Your message" required style={{ resize: 'vertical' }} />
              </label>
              <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
              <button id="send-message" className="btn btn-primary" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              {state === 'error' && <p role="alert" style={{ margin: 0, color: '#ff8a6b' }}>Something went wrong. Please email me directly.</p>}
              <AnimatePresence>
                {state === 'success' && (
                  <motion.div
                    role="status"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', background: 'var(--nav-bg)', backdropFilter: 'blur(10px)' }}
                  >
                    <div>
                      <Suspense fallback={null}><SuccessLottie /></Suspense>
                      <p style={{ fontWeight: 700, fontSize: '1.3rem', margin: 0 }}>{FORM_ID ? 'Message sent!' : 'Opening Gmail…'}</p>
                      <p style={{ color: 'var(--muted)', margin: '0.3rem 0 0' }}>Thanks for reaching out.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
