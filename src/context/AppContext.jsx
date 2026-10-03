import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { sfx } from '../lib/sfx'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark'
    } catch {
      return 'dark'
    }
  })
  const [sound, setSound] = useState(false)
  const [saiyan, setSaiyan] = useState(false)
  const [section, setSection] = useState('home')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    document.documentElement.dataset.theme = saiyan ? 'saiyan' : theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* ignore */
    }
  }, [theme, saiyan])

  useEffect(() => {
    sfx.enabled = sound
  }, [sound])

  const say = useCallback((msg) => {
    setToast({ msg, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      sound,
      toggleSound: () => setSound((s) => !s),
      saiyan,
      toggleSaiyan: () => setSaiyan((s) => !s),
      section,
      setSection,
      toast,
      say,
    }),
    [theme, sound, saiyan, section, toast, say],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
