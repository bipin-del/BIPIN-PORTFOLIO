import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const TECH = [
  { n: 'HTML5', c: '#ff8a5b', say: 'HTML5: the structure of everything I build!' },
  { n: 'CSS3', c: '#5ab0ff', say: 'CSS3: styling with care.' },
  { n: 'JS', c: '#ffd84a', say: 'JavaScript keeps it interactive!' },
  { n: 'React', c: '#5be3ff', say: 'React.js: my go-to for front-end.' },
  { n: 'Java', c: '#ff9a5b', say: 'Java and Spring Boot!' },
  { n: 'Python', c: '#6ee7a0', say: 'Python for AI and Flask.' },
]
const R = 2.35
const v = new THREE.Vector3()

export default function Orbit({ fx, reduced, onBadge, saiyan }) {
  const ring = useRef()
  const ring2 = useRef()
  const anchors = useRef([])
  const els = useRef([])

  useFrame((_, dt) => {
    const k = reduced ? 0.2 : 1
    ring.current.rotation.y += dt * (0.28 * k + fx.current.power * 1.6)
    ring2.current.rotation.z -= dt * 0.18 * k
    anchors.current.forEach((a, i) => {
      const el = els.current[i]
      if (!a || !el) return
      a.getWorldPosition(v)
      const d = (v.z + R) / (2 * R)
      el.style.opacity = String(0.4 + d * 0.6)
      el.style.transform = `scale(${0.75 + d * 0.4})`
      el.style.pointerEvents = d > 0.35 ? 'auto' : 'none'
    })
  })

  const col = saiyan ? '#ffd21a' : '#ff5a14'
  return (
    <group position={[0, -0.2, 0]}>
      <group rotation={[0.38, 0, 0.12]}>
        <group ref={ring}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[R, 0.012, 8, 128]} />
            <meshBasicMaterial color={col} transparent opacity={0.7} toneMapped={false} />
          </mesh>
          {TECH.map((t, i) => {
            const a = (i / TECH.length) * Math.PI * 2
            return (
              <group key={t.n} position={[Math.cos(a) * R, 0, Math.sin(a) * R]} ref={(r) => (anchors.current[i] = r)}>
                <Html center zIndexRange={[30, 0]}>
                  <div ref={(r) => (els.current[i] = r)}>
                    <button className="tech-badge" style={{ '--c': t.c }} onClick={() => onBadge(t.say)} aria-label={`${t.n} skill badge`}>
                      {t.n}
                    </button>
                  </div>
                </Html>
              </group>
            )
          })}
        </group>
      </group>
      <group rotation={[1.1, 0.3, 0]}>
        <group ref={ring2}>
          <mesh>
            <torusGeometry args={[3.15, 0.008, 8, 128]} />
            <meshBasicMaterial color={col} transparent opacity={0.3} toneMapped={false} />
          </mesh>
          <mesh position={[3.15, 0, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color={col} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
