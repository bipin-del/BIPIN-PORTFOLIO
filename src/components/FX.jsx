import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { sfx } from '../lib/sfx'

export default function FX() {
  const ref = useRef(null)
  const { saiyan } = useApp()
  const reduce = useReducedMotion()
  const rgb = useRef('255,90,20')
  rgb.current = saiyan ? '255,210,26' : '255,90,20'

  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    let w, h, raf
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const m = { x: -999, y: -999, sx: -999, sy: -999 }
    const parts = []
    const burst = (x, y, n = 18) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const s = 1.5 + Math.random() * 4
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, r: 1.5 + Math.random() * 2.5 })
      }
    }
    const move = (e) => {
      m.x = e.clientX
      m.y = e.clientY
      if (m.sx < 0) { m.sx = m.x; m.sy = m.y }
      if (!reduce && e.pointerType !== 'touch' && Math.random() < 0.5)
        parts.push({ x: m.x, y: m.y, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, life: 0.8, r: 1 + Math.random() * 2 })
    }
    const click = (e) => {
      if (!reduce) burst(e.clientX, e.clientY)
      if (e.target.closest?.('button, a, [role="button"]')) sfx.click()
    }
    const loop = () => {
      ctx.clearRect(0, 0, w, h)
      m.sx += (m.x - m.sx) * 0.15
      m.sy += (m.y - m.sy) * 0.15
      if (m.x > 0) {
        const g = ctx.createRadialGradient(m.sx, m.sy, 0, m.sx, m.sy, 180)
        g.addColorStop(0, `rgba(${rgb.current},0.22)`)
        g.addColorStop(1, `rgba(${rgb.current},0)`)
        ctx.fillStyle = g
        ctx.fillRect(m.sx - 180, m.sy - 180, 360, 360)
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96
        p.life -= 0.025
        if (p.life <= 0) { parts.splice(i, 1); continue }
        ctx.beginPath()
        ctx.fillStyle = `rgba(${rgb.current},${p.life})`
        ctx.shadowColor = `rgb(${rgb.current})`
        ctx.shadowBlur = 10
        ctx.arc(p.x, p.y, p.r * p.life + 0.4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      raf = requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', click)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', click)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  return <canvas ref={ref} className="fx-canvas" aria-hidden="true" />
}
