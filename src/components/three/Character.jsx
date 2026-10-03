import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mouse } from '../../lib/store'

const HS = [0.92, 1.05, 0.95]
const EXPR = {
  home: { brow: 0.12, browY: 0, mouth: 0.55, eye: 1 },
  skills: { brow: 0.34, browY: -0.015, mouth: 0.22, eye: 0.85 },
  projects: { brow: -0.12, browY: 0.04, mouth: 0.95, eye: 1.12 },
  journey: { brow: 0.2, browY: 0.01, mouth: 0.6, eye: 0.95 },
  connect: { brow: -0.05, browY: 0.03, mouth: 0.85, eye: 1.05 },
}
const damp = THREE.MathUtils.damp

function Eye({ x, eyeRef, irisRef }) {
  return (
    <group ref={eyeRef} position={[x, 0.08, 0.84]}>
      <mesh scale={[1, 1.15, 0.4]}>
        <sphereGeometry args={[0.17, 24, 24]} />
        <meshStandardMaterial color="#f6efe8" roughness={0.3} />
      </mesh>
      <group ref={irisRef} position={[0, 0, 0.05]}>
        <mesh scale={[1, 1.1, 0.4]}>
          <sphereGeometry args={[0.125, 24, 24]} />
          <meshStandardMaterial color="#3b1d0e" roughness={0.12} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0, 0.045]} scale={[1, 1.1, 0.3]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial color="#0b0504" />
        </mesh>
        <mesh position={[0.045, 0.06, 0.08]}>
          <sphereGeometry args={[0.034, 12, 12]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <mesh position={[-0.04, -0.05, 0.075]}>
          <sphereGeometry args={[0.016, 12, 12]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[0, 0.03, 0.06]} scale={[1.05, 1.1, 1]}>
        <torusGeometry args={[0.175, 0.022, 8, 20, Math.PI]} />
        <meshBasicMaterial color="#120805" />
      </mesh>
    </group>
  )
}

function Arm({ side, armRef, foreRef, skin, sleeve }) {
  return (
    <group ref={armRef} position={[side * 1.1, -1.35, 0]}>
      <mesh position={[0, -0.4, 0]} material={sleeve}>
        <capsuleGeometry args={[0.26, 0.55, 8, 16]} />
      </mesh>
      <group ref={foreRef} position={[0, -0.8, 0]} rotation={[-0.7, 0, 0]}>
        <mesh position={[0, -0.32, 0]} material={sleeve}>
          <capsuleGeometry args={[0.22, 0.45, 8, 16]} />
        </mesh>
        <mesh position={[0, -0.75, 0]} material={skin} scale={[1, 1.1, 0.85]}>
          <sphereGeometry args={[0.2, 20, 20]} />
        </mesh>
      </group>
    </group>
  )
}

export default function Character({ fx, section, saiyan, reduced, onPower, onWave }) {
  const root = useRef()
  const head = useRef()
  const torso = useRef()
  const hairG = useRef()
  const locks = useRef()
  const eyeL = useRef()
  const eyeR = useRef()
  const irisL = useRef()
  const irisR = useRef()
  const browL = useRef()
  const browR = useRef()
  const mouthR = useRef()
  const armL = useRef()
  const armR = useRef()
  const foreL = useRef()
  const foreR = useRef()
  const glow = useRef()
  const st = useRef({ blink: 0, next: 2, cur: { ...EXPR.home } })

  const mats = useMemo(() => {
    const logo = document.createElement('canvas')
    logo.width = logo.height = 512
    const g = logo.getContext('2d')
    g.fillStyle = '#16100c'
    g.fillRect(0, 0, 512, 512)
    g.shadowColor = '#ff5a14'
    g.shadowBlur = 40
    g.fillStyle = '#ff7a2e'
    g.font = '800 190px Consolas, "Courier New", monospace'
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    for (let i = 0; i < 3; i++) g.fillText('</>', 256, 262)
    const tex = new THREE.CanvasTexture(logo)
    tex.colorSpace = THREE.SRGBColorSpace
    return {
      skin: new THREE.MeshStandardMaterial({ color: '#a8693f', roughness: 0.55 }),
      skinDark: new THREE.MeshStandardMaterial({ color: '#8d5430', roughness: 0.6 }),
      hair: new THREE.MeshStandardMaterial({ color: '#150c08', roughness: 0.25, metalness: 0.15, emissive: '#000000' }),
      hood: new THREE.MeshStandardMaterial({ color: '#0e0e11', roughness: 0.85 }),
      beard: new THREE.MeshStandardMaterial({ color: '#1a0e08', roughness: 1, transparent: true, opacity: 0.5 }),
      outline: new THREE.MeshBasicMaterial({ color: '#1a0a04', side: THREE.BackSide }),
      logo: new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }),
      body: new THREE.MeshStandardMaterial({ color: '#202026', roughness: 0.4, metalness: 0.7 }),
      orange: new THREE.MeshStandardMaterial({ color: '#ff5a14', emissive: '#ff5a14', emissiveIntensity: 1.4 }),
    }
  }, [])

  const lockData = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const a = ((i - 4) / 4) * 1.05
        return {
          pos: [Math.sin(a) * 0.8, 0.6 - Math.abs(Math.sin(a)) * 0.1, Math.cos(a) * 0.85 + 0.03],
          rotz: 0.28 + Math.sin(i * 2.1) * 0.18 - Math.sin(a) * 0.25,
          len: 0.16 + (i % 3) * 0.05,
        }
      }),
    [],
  )

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime
    const amp = reduced ? 0.25 : 1
    const S = st.current
    const now = performance.now()
    const power = fx.current.power
    const w = now < fx.current.waveUntil ? 1 : 0

    const mx = mouse.x
    const my = mouse.y
    root.current.position.y = Math.sin(t * 1.2) * 0.08 * amp - 0.25
    root.current.rotation.y = damp(root.current.rotation.y, mx * 0.2, 4, dt)
    root.current.rotation.z = damp(root.current.rotation.z, -mx * 0.04, 4, dt)
    head.current.rotation.y = damp(head.current.rotation.y, mx * 0.5, 6, dt)
    head.current.rotation.x = damp(head.current.rotation.x, -my * 0.3, 6, dt)
    head.current.rotation.z = damp(head.current.rotation.z, -mx * 0.06 + Math.sin(t * 0.8) * 0.01 * amp, 4, dt)
    for (const r of [irisL, irisR]) {
      r.current.position.x = damp(r.current.position.x, mx * 0.045, 10, dt)
      r.current.position.y = damp(r.current.position.y, my * 0.04, 10, dt)
    }

    const br = Math.sin(t * 1.8) * 0.015 * amp
    torso.current.scale.set(1 + br, 1 + br * 1.5, 1 + br)

    hairG.current.rotation.z = Math.sin(t * 1.5) * 0.015 * amp + mx * -0.02
    locks.current.children.forEach((c, i) => {
      c.rotation.z = c.userData.base + Math.sin(t * 2 + i) * 0.06 * amp - mx * 0.05
    })

    S.next -= dt
    if (S.next <= 0) {
      S.blink = 1
      S.next = 2 + Math.random() * 3
    }
    S.blink = Math.max(0, S.blink - dt * 7)
    const bl = Math.sin(S.blink * Math.PI)

    const tgt = EXPR[section] || EXPR.home
    const c = S.cur
    for (const k of Object.keys(tgt)) c[k] = damp(c[k], tgt[k], 4, dt)
    const eyeY = c.eye * (1 - bl * 0.92)
    eyeL.current.scale.set(1, eyeY, 1)
    eyeR.current.scale.set(1, eyeY, 1)
    browL.current.rotation.z = -c.brow
    browR.current.rotation.z = c.brow
    browL.current.position.y = 0.33 + c.browY
    browR.current.position.y = 0.33 + c.browY
    mouthR.current.scale.set(1 + c.mouth * 0.1, 0.1 + c.mouth * 0.55 + power * 0.3, 1)

    const lr = (r, z, x) => {
      r.current.rotation.x = damp(r.current.rotation.x, x, 6, dt)
      r.current.rotation.z = damp(r.current.rotation.z, z, 6, dt)
    }
    if (w) {
      lr(armR, 2.5 + Math.sin(t * 9) * 0.12, 0)
      lr(armL, -2.4, 0)
      foreR.current.rotation.x = damp(foreR.current.rotation.x, 0, 8, dt)
      foreR.current.rotation.z = Math.sin(t * 12) * 0.5
      foreL.current.rotation.x = damp(foreL.current.rotation.x, 0, 8, dt)
    } else {
      const type = Math.sin(t * 9) * 0.04 * amp
      lr(armR, -0.12, -1.0 + type)
      lr(armL, 0.12, -1.0 - type)
      foreR.current.rotation.x = damp(foreR.current.rotation.x, -0.7, 6, dt)
      foreL.current.rotation.x = damp(foreL.current.rotation.x, -0.7, 6, dt)
      foreR.current.rotation.z = damp(foreR.current.rotation.z, 0, 6, dt)
    }

    const gold = saiyan ? 1 : 0
    mats.hair.color.lerp(new THREE.Color(gold ? '#ffd21a' : '#150c08'), 0.08)
    mats.hair.emissive.lerp(new THREE.Color(gold ? '#ff9d00' : '#ff3a00'), 0.08)
    mats.hair.emissiveIntensity = gold ? 0.7 : power * 0.5
    glow.current.intensity = 2.5 + Math.sin(t * 3) * 0.6 + power * 6
  })

  return (
    <group
      ref={root}
      onClick={(e) => {
        e.stopPropagation()
        onPower()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onWave()
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      {/* HEAD */}
      <group ref={head} position={[0, 0.75, 0]}>
        <mesh material={mats.skin} scale={HS}>
          <sphereGeometry args={[1, 48, 48]} />
        </mesh>
        <mesh material={mats.outline} scale={HS.map((v) => v * 1.035)}>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>
        <mesh material={mats.skin} position={[0, -0.5, 0.08]} scale={[0.78, 0.6, 0.7]}>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} material={mats.skinDark} position={[s * 0.92, 0, 0]} scale={[0.16, 0.28, 0.16]}>
            <sphereGeometry args={[1, 16, 16]} />
          </mesh>
        ))}
        <Eye x={-0.34} eyeRef={eyeL} irisRef={irisL} />
        <Eye x={0.34} eyeRef={eyeR} irisRef={irisR} />
        <mesh ref={browL} position={[-0.34, 0.33, 0.85]}>
          <boxGeometry args={[0.3, 0.06, 0.06]} />
          <meshStandardMaterial color="#120805" roughness={0.5} />
        </mesh>
        <mesh ref={browR} position={[0.34, 0.33, 0.85]}>
          <boxGeometry args={[0.3, 0.06, 0.06]} />
          <meshStandardMaterial color="#120805" roughness={0.5} />
        </mesh>
        <mesh material={mats.skinDark} position={[0, -0.14, 0.93]} scale={[1, 0.8, 0.8]}>
          <sphereGeometry args={[0.11, 16, 16]} />
        </mesh>
        {/* stubble beard + moustache */}
        <mesh material={mats.beard} scale={HS.map((v) => v * 1.012)}>
          <sphereGeometry args={[1, 40, 24, 0, Math.PI * 2, 1.95, Math.PI - 1.95]} />
        </mesh>
        <mesh material={mats.beard} position={[0, -0.5, 0.08]} scale={[0.79, 0.61, 0.71]}>
          <sphereGeometry args={[1, 32, 20, 0, Math.PI * 2, 1.7, Math.PI - 1.7]} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} material={mats.beard} position={[s * 0.09, -0.29, 0.9]} scale={[1.3, 0.5, 0.6]}>
            <sphereGeometry args={[0.09, 12, 12]} />
          </mesh>
        ))}
        {/* gentle confident smile */}
        <group ref={mouthR} position={[0, -0.34, 0.97]} rotation={[0, 0, Math.PI]}>
          <mesh>
            <torusGeometry args={[0.2, 0.024, 8, 24, Math.PI]} />
            <meshBasicMaterial color="#2a0f08" />
          </mesh>
        </group>

        {/* HAIR */}
        <group ref={hairG}>
          <mesh material={mats.hair} scale={HS.map((v) => v * 1.04)} rotation={[-0.45, 0, 0]}>
            <sphereGeometry args={[1, 48, 32, 0, Math.PI * 2, 0, 1.3]} />
          </mesh>
          {[
            [-0.5, 1.05, 0.1, 0.38],
            [-0.1, 1.15, 0.2, 0.4],
            [0.35, 1.1, 0.15, 0.38],
            [0.7, 0.9, 0.0, 0.34],
            [-0.78, 0.85, -0.1, 0.34],
            [0, 1.0, -0.4, 0.42],
            [0.4, 0.95, -0.5, 0.38],
            [-0.45, 0.95, -0.45, 0.38],
          ].map((p, i) => (
            <mesh key={i} material={mats.hair} position={[p[0], p[1], p[2]]} scale={[1.1, 0.9, 1.1]}>
              <sphereGeometry args={[p[3], 20, 20]} />
            </mesh>
          ))}
          <mesh material={mats.hair} position={[0.15, 1.0, 0.6]} rotation={[1.25, 0, -0.3]} scale={[1.2, 1, 0.8]}>
            <capsuleGeometry args={[0.28, 0.5, 8, 16]} />
          </mesh>
          <group ref={locks}>
            {lockData.map((l, i) => (
              <group key={i} position={l.pos} rotation={[-0.35, 0, l.rotz]} userData={{ base: l.rotz }}>
                <mesh material={mats.hair} scale={[1, 1, 0.8]}>
                  <capsuleGeometry args={[0.11, l.len, 6, 12]} />
                </mesh>
              </group>
            ))}
          </group>
          {[-1, 1].map((s) => (
            <mesh key={s} material={mats.hair} position={[s * 0.88, 0.1, 0.12]} scale={[0.6, 1, 0.9]}>
              <capsuleGeometry args={[0.1, 0.3, 6, 10]} />
            </mesh>
          ))}
          {[
            [0.2, 1.1, 0.45, 0.5, 0.3],
            [-0.35, 1.08, 0.4, 0.4, -0.3],
            [0.62, 0.9, 0.5, 0.3, 0.6],
          ].map((h, i) => (
            <mesh key={i} position={[h[0], h[1], h[2]]} rotation={[0.9, 0, h[4]]} scale={[h[3], 0.05, 0.12]}>
              <sphereGeometry args={[0.5, 12, 8]} />
              <meshBasicMaterial color="#ffb27a" transparent opacity={0.4} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>

      {/* NECK + HOODIE */}
      <mesh material={mats.skin} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.6, 20]} />
      </mesh>
      <group ref={torso} position={[0, -1.95, 0]}>
        <mesh material={mats.hood} scale={[1.3, 1, 0.82]}>
          <capsuleGeometry args={[0.85, 0.7, 12, 24]} />
        </mesh>
        <mesh material={mats.hood} position={[0, 0.72, -0.05]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
          <torusGeometry args={[0.55, 0.2, 14, 32]} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.2, 0.62, 0.64]} rotation={[0.08, 0, s * 0.05]}>
            <mesh position={[0, -0.3, 0]} material={mats.body}>
              <cylinderGeometry args={[0.022, 0.022, 0.6, 8]} />
            </mesh>
            <mesh position={[0, -0.64, 0]} material={mats.orange}>
              <cylinderGeometry args={[0.04, 0.04, 0.14, 10]} />
            </mesh>
          </group>
        ))}
      </group>
      <Arm side={-1} armRef={armL} foreRef={foreL} skin={mats.skin} sleeve={mats.hood} />
      <Arm side={1} armRef={armR} foreRef={foreR} skin={mats.skin} sleeve={mats.hood} />

      {/* LAPTOP with glowing </> lid */}
      <group position={[0, -2.5, 1.35]}>
        <mesh material={mats.body}>
          <boxGeometry args={[2.1, 0.08, 1.3]} />
        </mesh>
        <group position={[0, 0.05, 0.62]} rotation={[-0.2, 0, 0]}>
          <mesh material={mats.body} position={[0, 0.62, 0]}>
            <boxGeometry args={[2.1, 1.25, 0.06]} />
          </mesh>
          <mesh position={[0, 0.62, 0.035]}>
            <planeGeometry args={[1.5, 1.5]} />
            <primitive object={mats.logo} attach="material" />
          </mesh>
        </group>
        <pointLight ref={glow} position={[0, 0.8, 1.2]} color="#ff6a1f" distance={7} decay={2} />
      </group>
    </group>
  )
}
