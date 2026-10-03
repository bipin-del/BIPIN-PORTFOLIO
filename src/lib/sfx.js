// Tiny WebAudio synth: subtle whoosh / click / power-up. Off by default.
let ctx = null
let noise = null

function audio() {
  if (!sfx.enabled) return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function noiseBuf(c) {
  if (noise) return noise
  noise = c.createBuffer(1, c.sampleRate * 0.6, c.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return noise
}

export const sfx = {
  enabled: false,
  whoosh(vol = 0.05) {
    const c = audio()
    if (!c) return
    const src = c.createBufferSource()
    src.buffer = noiseBuf(c)
    const f = c.createBiquadFilter()
    f.type = 'bandpass'
    f.Q.value = 1.2
    f.frequency.setValueAtTime(300, c.currentTime)
    f.frequency.exponentialRampToValueAtTime(2600, c.currentTime + 0.35)
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, c.currentTime)
    g.gain.exponentialRampToValueAtTime(vol, c.currentTime + 0.12)
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.4)
    src.connect(f).connect(g).connect(c.destination)
    src.start()
    src.stop(c.currentTime + 0.45)
  },
  click() {
    const c = audio()
    if (!c) return
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'triangle'
    o.frequency.setValueAtTime(880, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(440, c.currentTime + 0.07)
    g.gain.setValueAtTime(0.05, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.09)
    o.connect(g).connect(c.destination)
    o.start()
    o.stop(c.currentTime + 0.1)
  },
  power() {
    const c = audio()
    if (!c) return
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(110, c.currentTime)
    o.frequency.exponentialRampToValueAtTime(900, c.currentTime + 0.5)
    g.gain.setValueAtTime(0.0001, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 0.1)
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.6)
    o.connect(g).connect(c.destination)
    o.start()
    o.stop(c.currentTime + 0.65)
    this.whoosh(0.07)
  },
}
