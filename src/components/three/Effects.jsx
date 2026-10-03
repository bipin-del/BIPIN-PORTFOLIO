import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const auraMat = (color) =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(color) }, uI: { value: 1 } },
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uI; varying vec3 vN; varying vec3 vV;
      void main(){ float f = pow(1.0-abs(dot(vN,vV)),2.2); gl_FragColor = vec4(uColor, f*uI); }`,
  })

export function Aura({ fx, saiyan }) {
  const mesh = useRef()
  const mat = useMemo(() => auraMat('#ff5a14'), [])
  useFrame((s) => {
    const t = s.clock.elapsedTime
    const p = fx.current.power
    mat.uniforms.uColor.value.lerp(new THREE.Color(saiyan ? '#ffd21a' : '#ff5a14'), 0.1)
    mat.uniforms.uI.value = (saiyan ? 1.6 : 0.8) + Math.sin(t * 2.4) * 0.25 + p * 2.2
    const sc = 1 + Math.sin(t * 2.4) * 0.03 + p * 0.45 + (saiyan ? 0.12 : 0)
    mesh.current.scale.set(sc * 1.05, sc * 1.25, sc)
  })
  return (
    <mesh ref={mesh} position={[0, -0.3, -0.2]} material={mat}>
      <sphereGeometry args={[2.3, 48, 48]} />
    </mesh>
  )
}

function boltGeom(a, b, seed) {
  const n = 9
  const dir = new THREE.Vector3().subVectors(b, a)
  const perp = new THREE.Vector3(-dir.y, dir.x, 0).normalize()
  const pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const j = i === 0 || i === n ? 0 : ((Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453) % 1) * 0.5
    pts.push(a.clone().lerp(b, t).addScaledVector(perp, j))
  }
  const w = 0.07
  const left = pts.map((p, i) => p.clone().addScaledVector(perp, w * (1 - i / n)))
  const right = pts.map((p, i) => p.clone().addScaledVector(perp, -w * (1 - i / n)))
  const poly = [...left, ...right.reverse()]
  const shape = new THREE.Shape(poly.map((p) => new THREE.Vector2(p.x, p.y)))
  return new THREE.ShapeGeometry(shape)
}

const BOLTS = [
  { a: [-2.4, 2.2, 0.6], b: [-1.5, -0.6, 0.6], ph: 0 },
  { a: [2.5, 2.4, 0.4], b: [1.6, -0.2, 0.5], ph: 2 },
  { a: [-2.2, -0.6, 0.8], b: [-3, -2.4, 0.4], ph: 4 },
  { a: [2.2, -0.8, 0.8], b: [2.9, -2.6, 0.4], ph: 5.5 },
]

function Bolt({ fx, def, reduced, saiyan }) {
  const mesh = useRef()
  const [seed, setSeed] = useState(def.ph)
  useEffect(() => {
    const id = setInterval(() => setSeed((s) => s + 1), 130)
    return () => clearInterval(id)
  }, [])
  const geom = useMemo(() => boltGeom(new THREE.Vector3(...def.a), new THREE.Vector3(...def.b), seed), [seed, def])
  useEffect(() => () => geom.dispose(), [geom])
  useFrame((s) => {
    const t = s.clock.elapsedTime
    const on = fx.current.power > 0.05 || (!reduced && Math.sin(t * 2.7 + def.ph * 3) > 0.9) || saiyan
    mesh.current.visible = on && (!reduced || fx.current.power > 0.05)
  })
  return (
    <mesh ref={mesh} geometry={geom}>
      <meshBasicMaterial color={saiyan ? '#fff27a' : '#ff9a4d'} side={THREE.DoubleSide} transparent opacity={0.95} blending={THREE.AdditiveBlending} toneMapped={false} />
    </mesh>
  )
}

export function Bolts(props) {
  return BOLTS.map((b, i) => <Bolt key={i} def={b} {...props} />)
}

export function SpeedLines({ fx, saiyan }) {
  const g = useRef()
  const lines = useMemo(
    () => Array.from({ length: 46 }, (_, i) => ({ ang: (i / 46) * Math.PI * 2 + Math.sin(i * 7) * 0.1, off: (i * 0.37) % 1, len: 0.6 + ((i * 53) % 10) / 6 })),
    [],
  )
  useFrame((s) => {
    const t = s.clock.elapsedTime
    g.current.children.forEach((m, i) => {
      const l = lines[i]
      const k = (t * 0.35 + l.off) % 1
      const r = 3.6 + k * 4.5 + fx.current.power * 1.5
      m.position.set(Math.cos(l.ang) * r, Math.sin(l.ang) * r - 0.2, -3)
      m.material.opacity = Math.sin(k * Math.PI) * (0.35 + fx.current.power * 0.5)
    })
  })
  return (
    <group ref={g}>
      {lines.map((l, i) => (
        <mesh key={i} rotation={[0, 0, l.ang]} scale={[l.len, 1, 1]}>
          <planeGeometry args={[1, 0.018]} />
          <meshBasicMaterial color={saiyan ? '#ffe36b' : '#ff9a5b'} transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

export function Particles({ saiyan, reduced }) {
  const ref = useRef()
  const geom = useMemo(() => {
    const n = 380
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 3 + Math.random() * 4
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th)
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
      arr[i * 3 + 2] = r * Math.cos(ph) - 2
    }
    const gm = new THREE.BufferGeometry()
    gm.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return gm
  }, [])
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * (reduced ? 0.01 : 0.05)
    ref.current.rotation.x += dt * (reduced ? 0.004 : 0.02)
  })
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial color={saiyan ? '#ffd21a' : '#ff8a4d'} size={0.045} sizeAttenuation transparent opacity={0.8} depthWrite={false} />
    </points>
  )
}
