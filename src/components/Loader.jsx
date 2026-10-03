import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export default function Loader({ onDone }) {
  const reduce = useReducedMotion()
  const [pct, setPct] = useState(0)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const total = reduce ? 600 : 2600
    const start = performance.now()
    let raf
    const tick = (n) => {
      const p = Math.min(1, (n - start) / total)
      setPct(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setOpen(false)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <AnimatePresence onExitComplete={onDone}>
      {open && (
        <motion.div
          className="loader"
          role="status"
          aria-label="Loading portfolio"
          onClick={() => setOpen(false)}
          exit={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', transition: { duration: 0.7, ease: [0.7, 0, 0.2, 1] } }}
          initial={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
        >
          <div className="loader-lines" />
          <div style={{ position: 'relative', textAlign: 'center', padding: '0 1.25rem' }}>
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1 }}
            >
              Episode 01 · The Portfolio
            </motion.p>
            <motion.h1
              style={{ fontSize: 'clamp(2.6rem, 10vw, 7rem)', fontWeight: 800, lineHeight: 1, margin: '0.6rem 0', color: '#fff3ea', textShadow: '0 0 40px rgba(255,90,20,.8)' }}
              initial={{ scale: 1.6, opacity: 0, skewX: -12 }}
              animate={{ scale: 1, opacity: 1, skewX: -6 }}
              transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}
            >
              BIPIN <span style={{ color: '#ff5a14' }}>S MENON</span>
            </motion.h1>
            <motion.p style={{ color: 'rgba(255,235,220,.7)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              Software Developer
            </motion.p>
            <div style={{ width: 'min(320px, 70vw)', margin: '2rem auto 0.5rem' }} className="bar">
              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#ff9a4d,#ff5a14)', boxShadow: '0 0 14px #ff5a14' }} />
            </div>
            <p style={{ color: 'rgba(255,235,220,.55)', fontSize: '0.8rem' }}>Powering up… {pct}% · click to skip</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
