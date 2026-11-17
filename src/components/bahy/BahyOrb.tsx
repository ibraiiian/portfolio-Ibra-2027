import { useEffect, useRef, type RefObject } from 'react'
import type { BahyPhase } from './store'

/**
 * Orb Bahy: bola kaca dengan pusaran warna biru/cyan/putih (senada dengan folder macOS di situs).
 * Semua gerak dihitung per frame (bukan keyframe CSS) supaya perpindahan fase tetap mulus:
 *  idle      → bernapas pelan
 *  listening → membesar mengikuti volume mikrofon + riak
 *  thinking  → mengecil sedikit, berputar cepat, cincin berkilau
 *  speaking  → berdenyut mengikuti "suara"
 */
const SPEED: Record<BahyPhase, number> = { idle: 0.35, listening: 1.1, thinking: 2.6, speaking: 1.4 }

export function BahyOrb({
  size,
  phase,
  level,
  className = '',
}: {
  size: number
  phase: BahyPhase
  level?: RefObject<number>
  className?: string
}) {
  const body = useRef<HTMLDivElement>(null)
  const glow = useRef<HTMLDivElement>(null)
  const layers = useRef<(HTMLDivElement | null)[]>([])
  const phaseRef = useRef(phase)
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let last = performance.now()
    let angle = 0
    let speed = SPEED[phaseRef.current]
    let scale = 1
    let lv = 0
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      const p = phaseRef.current
      speed += (SPEED[p] - speed) * 0.06
      angle += dt * speed * 60
      lv += ((level?.current ?? 0) - lv) * 0.25
      const s = t / 1000
      const target =
        p === 'listening' ? 1.04 + lv * 0.32
        : p === 'speaking' ? 1 + lv * 0.22
        : p === 'thinking' ? 0.9 + 0.02 * Math.sin(s * 7)
        : 1 + 0.025 * Math.sin(s * 1.7)
      scale += (target - scale) * 0.18
      if (body.current) body.current.style.transform = `scale(${scale.toFixed(4)})`
      if (glow.current) {
        glow.current.style.opacity = String(p === 'idle' ? 0.45 : 0.7 + lv * 0.3)
        glow.current.style.transform = `scale(${(0.9 + scale * 0.25 + lv * 0.25).toFixed(4)})`
      }
      const mult = [1, -1.35, 0.8, -0.55]
      layers.current.forEach((el, i) => {
        if (!el) return
        const wobble = 1 + 0.08 * Math.sin(s * (1.3 + i * 0.4) + i) + lv * 0.15
        el.style.transform = `rotate(${(angle * mult[i] + i * 70).toFixed(2)}deg) scale(${wobble.toFixed(3)})`
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [level])

  const blur = Math.max(1, size * 0.07)
  // [warna, ukuran relatif, offset x, offset y]
  const blobs: [string, number, number, number][] = [
    ['#38bdf8', 0.7, -0.2, -0.1],
    ['#1e6bff', 0.66, 0.22, 0.16],
    ['#7ef0d6', 0.46, 0.17, -0.25],
    ['#ffffff', 0.36, -0.13, 0.23],
  ]
  const small = size < 40

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      {/* cahaya di belakang orb */}
      <div
        ref={glow}
        className="pointer-events-none absolute -inset-[35%] rounded-full transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle, rgba(61,139,255,.45) 0%, rgba(90,200,250,.18) 40%, transparent 68%)', filter: `blur(${size * 0.08}px)` }}
      />

      {/* riak saat mendengarkan */}
      {!small && (
        <div className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${phase === 'listening' ? 'opacity-100' : 'opacity-0'}`}>
          <span className="bahy-ripple absolute inset-0 rounded-full border border-[#3d8bff]/50" />
          <span className="bahy-ripple absolute inset-0 rounded-full border border-[#3d8bff]/50 [animation-delay:.8s]" />
        </div>
      )}

      {/* cincin berkilau saat berpikir */}
      <div
        className={`bahy-spin pointer-events-none absolute rounded-full transition-opacity duration-300 ${phase === 'thinking' ? 'opacity-100' : 'opacity-0'}`}
        style={{
          inset: -Math.max(1.5, size * 0.05),
          background: 'conic-gradient(from 0deg, transparent 0 55%, rgba(90,200,250,.9) 75%, #fff 82%, transparent 90%)',
          WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${Math.max(1.5, size * 0.035)}px), #000 0)`,
          mask: `radial-gradient(farthest-side, transparent calc(100% - ${Math.max(1.5, size * 0.035)}px), #000 0)`,
        }}
      />

      {/* bola */}
      <div
        ref={body}
        className="absolute inset-0 overflow-hidden rounded-full will-change-transform"
        style={{
          background: 'radial-gradient(circle at 50% 112%, #06173f 0%, #0f3fae 42%, #2a78f0 76%, #7cc8ff 100%)',
          boxShadow: `inset 0 ${-size * 0.06}px ${size * 0.14}px rgba(4,26,90,.45), inset 0 ${size * 0.04}px ${size * 0.08}px rgba(255,255,255,.55), 0 ${size * 0.08}px ${size * 0.2}px -${size * 0.06}px rgba(29,95,224,.55)`,
        }}
      >
        {blobs.map(([color, rel, ox, oy], i) => (
          <div
            key={i}
            ref={el => {
              layers.current[i] = el
            }}
            className="absolute inset-0 will-change-transform"
          >
            <div
              className="absolute rounded-full mix-blend-screen"
              style={{
                width: size * rel,
                height: size * rel,
                left: size * (0.5 - rel / 2 + ox),
                top: size * (0.5 - rel / 2 + oy),
                background: color,
                opacity: i === 3 ? 0.6 : 0.92,
                filter: `blur(${blur}px)`,
              }}
            />
          </div>
        ))}
        {/* kilau kaca */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            left: '18%',
            top: '8%',
            width: '64%',
            height: '38%',
            background: 'linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,0))',
            filter: `blur(${Math.max(0.5, size * 0.02)}px)`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/40" />
      </div>
    </div>
  )
}
