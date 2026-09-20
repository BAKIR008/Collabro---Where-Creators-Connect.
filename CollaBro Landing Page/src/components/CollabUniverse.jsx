import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Central glowing Collab Core orb ─── */
function CollabCore() {
  const meshRef = useRef()
  const glowRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.3
      meshRef.current.rotation.z = Math.sin(t * 0.4) * 0.1
      const s = 1 + Math.sin(t * 1.2) * 0.04
      meshRef.current.scale.setScalar(s)
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = -t * 0.2
      const gs = 1.2 + Math.sin(t * 0.8) * 0.08
      glowRef.current.scale.setScalar(gs)
    }
  })

  return (
    <group>
      {/* Outer glow shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshBasicMaterial color="#7B38FF" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      {/* Main distorted core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.85, 1]} />
        <MeshDistortMaterial
          color="#7B38FF"
          emissive="#7B38FF"
          emissiveIntensity={0.5}
          distort={0.3}
          speed={2}
          roughness={0.05}
          metalness={0.4}
        />
      </mesh>
      {/* Bright inner kernel */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#FFD52E" />
      </mesh>
      <pointLight color="#7B38FF" intensity={8} distance={6} />
      <pointLight color="#FFD52E" intensity={4} distance={4} />
    </group>
  )
}

/* ─── Generic orbiting wrapper ─── */
function OrbitingObject({ radius, speed, angleOffset, yOscillate = 0.3, children }) {
  const groupRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const angle = t * speed + angleOffset
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * radius
      groupRef.current.position.z = Math.sin(angle) * radius
      groupRef.current.position.y = Math.sin(t * 0.7 + angleOffset) * yOscillate
      groupRef.current.rotation.y = -angle + Math.PI / 2
    }
  })
  return <group ref={groupRef}>{children}</group>
}

/* ─── Creative craft objects ─── */
function CameraObject() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.2
  })
  return (
    <group ref={ref} scale={0.55}>
      <mesh>
        <boxGeometry args={[1, 0.7, 0.5]} />
        <meshStandardMaterial color="#45D7FF" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0.65, 0, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#222" roughness={0.4} />
      </mesh>
    </group>
  )
}

function PencilObject() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.6) * 0.3
  })
  return (
    <group ref={ref} scale={0.55} rotation={[0, 0, Math.PI / 6]}>
      <mesh>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color="#FFD52E" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.75, 0]}>
        <coneGeometry args={[0.12, 0.3, 6]} />
        <meshStandardMaterial color="#FFF0A0" roughness={0.3} />
      </mesh>
    </group>
  )
}

function MicObject() {
  return (
    <group scale={0.55}>
      <mesh>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial color="#FF3D9A" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#888" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  )
}

function NoteObject() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.5
  })
  return (
    <group ref={ref} scale={0.55}>
      <mesh>
        <boxGeometry args={[1, 1.2, 0.08]} />
        <meshStandardMaterial color="#FFFDF6" roughness={0.8} />
      </mesh>
      {[0.2, 0, -0.2].map((y, i) => (
        <mesh key={i} position={[i === 1 ? -0.1 : 0, y, 0.05]}>
          <boxGeometry args={[i === 1 ? 0.5 : 0.65, 0.06, 0.1]} />
          <meshStandardMaterial color="#0B0B0B" />
        </mesh>
      ))}
    </group>
  )
}

function PaintSplashObject() {
  return (
    <group scale={0.55}>
      <mesh>
        <octahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#FF3D9A" roughness={0.1} emissive="#FF3D9A" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function CubeObject() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.4
      ref.current.rotation.y = clock.getElapsedTime() * 0.3
    }
  })
  return (
    <group ref={ref} scale={0.55}>
      <mesh>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#7B38FF" roughness={0.2} metalness={0.5} />
      </mesh>
    </group>
  )
}

function FilmFrameObject() {
  return (
    <group scale={0.55}>
      <mesh>
        <boxGeometry args={[1.2, 0.8, 0.08]} />
        <meshStandardMaterial color="#0B0B0B" roughness={0.4} />
      </mesh>
      {[-0.45, 0, 0.45].flatMap((x, i) => [
        <mesh key={`t${i}`} position={[x, 0.5, 0.1]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#45D7FF" />
        </mesh>,
        <mesh key={`b${i}`} position={[x, -0.5, 0.1]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#45D7FF" />
        </mesh>
      ])}
    </group>
  )
}

function MessagePlane() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2
  })
  return (
    <group ref={ref} scale={0.55}>
      <mesh>
        <boxGeometry args={[1.1, 0.75, 0.05]} />
        <meshStandardMaterial color="#45D7FF" roughness={0.4} />
      </mesh>
      <mesh position={[-0.4, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.2, 0.3, 3]} />
        <meshStandardMaterial color="#45D7FF" roughness={0.4} />
      </mesh>
    </group>
  )
}

function LightObject() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.6) * 0.15
  })
  return (
    <group ref={ref} scale={0.55}>
      <mesh>
        <coneGeometry args={[0.5, 0.8, 8]} />
        <meshStandardMaterial color="#FFD52E" roughness={0.3} emissive="#FFD52E" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  )
}

/* ─── Glowing connection lines ─── */
function ConnectionLine({ startAngle, color }) {
  const lineRef = useRef()
  const radius = 2.2

  const geo = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(
        Math.cos(startAngle) * radius,
        Math.sin(startAngle * 0.5) * 0.4,
        Math.sin(startAngle) * radius
      ),
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [startAngle])

  const mat = useMemo(() =>
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 }),
    [color]
  )

  useFrame(({ clock }) => {
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.2 + Math.sin(clock.getElapsedTime() * 1.5 + startAngle) * 0.25
    }
  })

  return <primitive object={new THREE.Line(geo, mat)} ref={lineRef} />
}

function ConnectionLines() {
  const lines = useMemo(() => [
    { startAngle: 0,               color: '#7B38FF' },
    { startAngle: Math.PI * 0.4,   color: '#45D7FF' },
    { startAngle: Math.PI * 0.8,   color: '#FF3D9A' },
    { startAngle: Math.PI * 1.2,   color: '#FFD52E' },
    { startAngle: Math.PI * 1.6,   color: '#7B38FF' },
    { startAngle: Math.PI * 0.2,   color: '#45D7FF' },
    { startAngle: Math.PI * 1.0,   color: '#FF3D9A' },
    { startAngle: Math.PI * 1.8,   color: '#FFD52E' },
  ], [])
  return <>{lines.map((l, i) => <ConnectionLine key={i} {...l} />)}</>
}

/* ─── Floating particles ─── */
function Particles({ count = 60 }) {
  const meshRef = useRef()

  const { positions, colors } = useMemo(() => {
    const palette = [
      new THREE.Color('#FFD52E'),
      new THREE.Color('#45D7FF'),
      new THREE.Color('#FF3D9A'),
      new THREE.Color('#7B38FF'),
      new THREE.Color('#FFFDF6'),
    ]
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      const c = palette[i % palette.length]
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [count])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.03
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.75} sizeAttenuation />
    </points>
  )
}

/* ─── Mouse-reactive camera rig ─── */
function CameraRig() {
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const { camera } = useThree()

  useEffect(() => {
    const handle = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handle, { passive: true })
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  useFrame(() => {
    target.current.x += (mouse.current.x * 0.8 - target.current.x) * 0.05
    target.current.y += (mouse.current.y * 0.5 - target.current.y) * 0.05
    camera.position.x = target.current.x * 1.2
    camera.position.y = 0.5 + target.current.y * 0.8
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ─── Full Scene ─── */
function Scene({ particleCount }) {
  const R = 2.4
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#FFFDF6" />
      <directionalLight position={[-5, -3, -5]} intensity={0.25} color="#7B38FF" />

      <CameraRig />
      <CollabCore />
      <ConnectionLines />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <OrbitingObject radius={R}        speed={0.28} angleOffset={0}>
          <CameraObject />
        </OrbitingObject>
      </Float>

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <OrbitingObject radius={R * 0.9}  speed={0.22} angleOffset={Math.PI * 0.4}>
          <PencilObject />
        </OrbitingObject>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.2}>
        <OrbitingObject radius={R * 1.05} speed={0.18} angleOffset={Math.PI * 0.8}>
          <MicObject />
        </OrbitingObject>
      </Float>

      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.5}>
        <OrbitingObject radius={R * 0.85} speed={0.25} angleOffset={Math.PI * 1.2}>
          <FilmFrameObject />
        </OrbitingObject>
      </Float>

      <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.3}>
        <OrbitingObject radius={R * 0.95} speed={0.20} angleOffset={Math.PI * 1.6}>
          <PaintSplashObject />
        </OrbitingObject>
      </Float>

      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.4}>
        <OrbitingObject radius={R * 1.1}  speed={0.15} angleOffset={Math.PI * 0.2}>
          <LightObject />
        </OrbitingObject>
      </Float>

      <Float speed={2.0} rotationIntensity={0.5} floatIntensity={0.2}>
        <OrbitingObject radius={R * 0.8}  speed={0.32} angleOffset={Math.PI * 0.6}>
          <CubeObject />
        </OrbitingObject>
      </Float>

      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.6}>
        <OrbitingObject radius={R * 1.0}  speed={0.24} angleOffset={Math.PI * 1.0}>
          <MessagePlane />
        </OrbitingObject>
      </Float>

      <Float speed={1.7} rotationIntensity={0.3} floatIntensity={0.35}>
        <OrbitingObject radius={R * 0.88} speed={0.19} angleOffset={Math.PI * 1.4}>
          <NoteObject />
        </OrbitingObject>
      </Float>

      <Particles count={particleCount} />
    </>
  )
}

/* ─── Exported Canvas wrapper ─── */
export default function CollabUniverse({ isHero = true }) {
  const isMobile = window.innerWidth < 768
  const particleCount = isMobile ? 30 : isHero ? 60 : 40

  return (
    <Canvas
      camera={{ position: [0, 0.5, 6], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, Math.min(window.devicePixelRatio, 2)]}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Scene particleCount={particleCount} />
    </Canvas>
  )
}
