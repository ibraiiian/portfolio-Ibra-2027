import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion } from 'motion/react'
import { FolderIcon, go } from '@/components/Mac'
import { profile } from '@/data'

// potongan wordmark (fraksi lebar gambar): P+muka, R, T, F, muka, L, I, muka
const CUTS = [0, 0.297, 0.4025, 0.5025, 0.578, 0.692, 0.785, 0.822, 1]

const folders = [
  { label: 'About', id: 'about', pos: 'left-[12%] top-[15%]' },
  { label: 'Projects', id: 'projects', pos: 'right-[14%] top-[17%]' },
  { label: 'Skills', id: 'skills', pos: 'left-[7%] bottom-[20%]', selected: true },
  { label: 'Contact', id: 'contact', pos: 'right-[9%] bottom-[22%]' },
]

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const dragged = useRef(false)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const name = q('[data-name]')[0] as HTMLElement
      const cursor = q('[data-cursor]')[0] as HTMLElement
      const box = root.current!.getBoundingClientRect()
      const n = name.getBoundingClientRect()
      const at = (x: number, y: number) => ({ x: x - box.left, y: y - box.top })
      const start = at(n.left - 2, n.top + n.height * 0.55)
      const end = at(n.right + 2, n.top + n.height * 0.6)

      gsap.set(cursor, { x: box.width * 0.85, y: box.height * 1.05 })
      gsap.set(q('[data-full]'), { autoAlpha: 0 })

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(q('[data-slice]'), {
        yPercent: () => gsap.utils.random(60, 130),
        rotation: () => gsap.utils.random(-14, 14),
        scale: 0.6,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'back.out(1.6)',
        stagger: { each: 0.07, from: 'random' },
      })
        .set(q('[data-full]'), { autoAlpha: 1 })
        .set(q('[data-slices]'), { autoAlpha: 0 })
        .from(q('[data-sub]'), { y: 40, autoAlpha: 0, filter: 'blur(12px)', duration: 0.8 }, '-=0.5')
        .from(q('[data-by]'), { y: 20, autoAlpha: 0, duration: 0.6 }, '-=0.45')
        .from(q('[data-folder]'), { scale: 0, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.09 }, '-=0.9')
        .to(cursor, { ...start, duration: 0.9, ease: 'power2.inOut' }, '-=0.2')
        .set(q('[data-handle]'), { autoAlpha: 1 })
        .to(cursor, { ...end, duration: 0.7, ease: 'power1.inOut' })
        .to(q('[data-sel]'), { width: '100%', duration: 0.7, ease: 'power1.inOut' }, '<')
        .to(cursor, { x: end.x + 18, y: end.y + 20, duration: 0.5, ease: 'power2.out' })

      // folder melayang pelan
      q('[data-float]').forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 10 : -10, rotation: i % 2 ? 2 : -2, duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })

      // parallax mouse
      const move = (e: PointerEvent) => {
        const dx = e.clientX / window.innerWidth - 0.5
        const dy = e.clientY / window.innerHeight - 0.5
        gsap.to(q('[data-word]'), { x: dx * -14, y: dy * -10, duration: 0.8, ease: 'power2.out' })
        q('[data-par]').forEach((el, i) =>
          gsap.to(el, { x: dx * (18 + i * 8), y: dy * (14 + i * 6), duration: 1, ease: 'power2.out', overwrite: 'auto' }),
        )
      }
      window.addEventListener('pointermove', move)
      return () => window.removeEventListener('pointermove', move)
    },
    { scope: root },
  )

  return (
    <section id="home" ref={root} className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#f5f5f7] px-4 pb-28 pt-16">
      {/* folders */}
      {folders.map(f => (
        <motion.button
          key={f.id}
          drag
          dragConstraints={root}
          dragElastic={0.15}
          whileDrag={{ scale: 1.12, cursor: 'grabbing' }}
          whileTap={{ scale: 0.96 }}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={() => setTimeout(() => (dragged.current = false), 0)}
          onClick={() => !dragged.current && go(f.id)}
          className={`absolute z-20 cursor-grab ${f.pos}`}
        >
          <div data-par>
            <div data-folder>
              <div data-float className={`flex flex-col items-center gap-1 rounded-2xl p-2 ${f.selected ? 'bg-black/[.08] ring-1 ring-black/5' : ''}`}>
                <FolderIcon className="w-14 drop-shadow-[0_8px_10px_rgba(40,110,200,.28)] sm:w-20" />
                <span className={`rounded-md px-1.5 text-[12px] font-medium ${f.selected ? 'bg-[#2f7cf6] text-white' : 'text-neutral-700'}`}>{f.label}</span>
              </div>
            </div>
          </div>
        </motion.button>
      ))}

      {/* wordmark */}
      <div data-word className="relative w-[min(94vw,1180px)] mix-blend-multiply">
        <h1 className="sr-only">Portfolio: {profile.name}, {profile.role}</h1>
        <div className="relative aspect-[4128/1024] w-full">
          <div data-slices className="absolute inset-0">
            {CUTS.slice(0, -1).map((a, i) => (
              <div
                key={a}
                data-slice
                className="absolute inset-0 bg-[url(/wordmark.jpg)] bg-cover"
                style={{ clipPath: `inset(0 ${(1 - CUTS[i + 1]) * 100}% 0 ${a * 100}%)`, transformOrigin: `${((a + CUTS[i + 1]) / 2) * 100}% 60%`, filter: 'brightness(1.04)' }}
              />
            ))}
          </div>
          <img data-full src="/wordmark.jpg" alt="" draggable={false} className="absolute inset-0 size-full select-none" style={{ filter: 'brightness(1.04)' }} />
        </div>
      </div>

      <p data-sub className="-mt-[1.2vw] font-[family-name:var(--font-display)] text-[clamp(1.6rem,5.4vw,4.4rem)] font-semibold leading-none tracking-tight text-[#1c1c1e]">
        software engineer
      </p>

      <p data-by className="mt-6 font-[family-name:var(--font-display)] text-[clamp(1rem,1.7vw,1.4rem)] text-neutral-900">
        by{' '}
        <span data-name className="relative inline-block px-1 font-semibold">
          <span data-sel className="absolute inset-y-0 left-0 w-0 bg-[#8db8ff]">
            <i data-handle className="invisible absolute -top-1 left-0 h-[calc(100%+8px)] w-0.5 -translate-x-1/2 bg-[#2f6fed] before:absolute before:-left-[3px] before:-top-1 before:size-2 before:rounded-full before:bg-[#2f6fed]" />
            <i data-handle className="invisible absolute -top-1 right-0 h-[calc(100%+8px)] w-0.5 translate-x-1/2 bg-[#2f6fed] after:absolute after:-bottom-1 after:-left-[3px] after:size-2 after:rounded-full after:bg-[#2f6fed]" />
          </span>
          <span className="relative">{profile.name}</span>
        </span>
      </p>

      {/* fake cursor */}
      <svg data-cursor viewBox="0 0 24 24" className="pointer-events-none absolute left-0 top-0 z-30 size-6 drop-shadow-md" aria-hidden="true">
        <path d="M4 2l15 11.5h-8L7.5 21z" fill="#111" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>

      <button onClick={() => go('inside')} className="absolute bottom-28 text-[12px] font-medium text-neutral-500 hover:text-neutral-900">
        scroll ↓
      </button>
    </section>
  )
}
