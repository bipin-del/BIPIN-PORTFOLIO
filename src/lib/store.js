// Shared mutable state read inside render loops (no React re-renders).
export const mouse = { x: 0, y: 0 }

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    },
    { passive: true },
  )
}

export const isMobile = () =>
  typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)

export function openEmail(e) {
  // Desktop: Gmail compose in a new tab. Mobile: mailto fallback.
  if (isMobile()) {
    e?.preventDefault()
    window.location.href = 'mailto:bipinsmenon@gmail.com?subject=Hello%20Bipin'
  }
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}
