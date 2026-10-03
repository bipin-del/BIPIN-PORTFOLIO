import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, Html, Sparkles } from '@react-three/drei'
import Character from './Character'
import Orbit from './Orbit'
import { Aura, Bolts, Particles, SpeedLines } from './Effects'
import { sfx } from '../../lib/sfx'

const POWER_LINES = ['Power up! Ready to build!', "Let's ship something great!", 'Hire me. I code with heart!', 'Commit. Push. Repeat.']

function Rig() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.position.z = size.width / size.height < 1.2 ? 12.5 : 10.8
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

function Scene({ section, saiyan, reduced }) {
  const fx = useRef({ power: 0, waveUntil: 0 })
  const [speech, setSpeech] = useState(null)
  const timer = useRef()

  const say = useCallback((text) => {
    setSpeech(text)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSpeech(null), 2600)
  }, [])

  const onPower = useCallback(() => {
    fx.current.power = 1
    sfx.power()
    window.dispatchEvent(new Event('powerup'))
    say(POWER_LINES[Math.floor(Math.random() * POWER_LINES.length)])
  }, [say])

  const onWave = useCallback(() => {
    fx.current.waveUntil = performance.now() + 2600
    sfx.whoosh()
    say('Hey there! Thanks for visiting!')
  }, [say])

  useEffect(() => {
    let raf
    let last = performance.now()
    const loop = (n) => {
      const dt = (n - last) / 1000
      last = n
      fx.current.power = Math.max(0, fx.current.power - dt * 0.8)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer.current)
    }
  }, [])

  return (
    <>
      <Rig />
      <ambientLight intensity={0.55} color="#ffd9bf" />
      <directionalLight position={[3, 4, 6]} intensity={2.4} color="#fff1e6" />
      <pointLight position={[-4.5, 2, -3]} intensity={140} color="#ff5a14" distance={14} decay={2} />
      <pointLight position={[4.5, 1, -3]} intensity={140} color="#ff7a30" distance={14} decay={2} />
      <pointLight position={[0, -1, 4]} intensity={20} color="#ff9a5b" distance={10} decay={2} />

      <Particles saiyan={saiyan} reduced={reduced} />
      {!reduced && <SpeedLines fx={fx} saiyan={saiyan} />}
      <Sparkles count={reduced ? 20 : 70} scale={[8, 6, 4]} size={4} speed={reduced ? 0.1 : 0.45} color={saiyan ? '#ffe36b' : '#ff9a4d'} />
      <Aura fx={fx} saiyan={saiyan} />
      <Bolts fx={fx} reduced={reduced} saiyan={saiyan} />
      <Character fx={fx} section={section} saiyan={saiyan} reduced={reduced} onPower={onPower} onWave={onWave} />
      <Orbit fx={fx} reduced={reduced} saiyan={saiyan} onBadge={(t) => { fx.current.power = Math.max(fx.current.power, 0.5); sfx.click(); say(t) }} />
      <ContactShadows position={[0, -3.2, 0]} opacity={0.55} scale={9} blur={2.8} far={4} resolution={256} color="#1a0600" />

      {speech && (
        <Html position={[1.5, 2.4, 0]} center zIndexRange={[40, 0]}>
          <div className="speech" role="status">{speech}</div>
        </Html>
      )}
    </>
  )
}

export default function CharacterScene({ section, saiyan, reduced, active }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 10.8], fov: 32 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-label="Interactive 3D anime-style character of Bipin. Click for a power-up, double-click to wave."
    >
      <Scene section={section} saiyan={saiyan} reduced={reduced} />
    </Canvas>
  )
}
