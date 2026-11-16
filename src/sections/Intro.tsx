import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SlideCommit from '@/components/SlideCommit'
import { FolderIcon } from '@/components/Mac'
import { profile } from '@/data'

const display = 'font-[family-name:var(--font-display)]'

/** Layar pembuka: geser slider → bunyi startup → masuk ke portfolio. */
export function Intro({ onEnter, onGone }: { onEnter: () => void; onGone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const audio = useRef<HTMLAudioElement | null>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    audio.current = new Audio('/sounds/startup.m4a')
    audio.current.preload = 'auto'
    audio.current.volume = 0.7
    const t = setInterval(() => setNow(new Date()), 15_000)
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => {
      clearInterval(t)
      document.body.style.overflow = ''
    }
  }, [])

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.from(q('[data-in]'), { y: 30, autoAlpha: 0, filter: 'blur(10px)', duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.15 })
      gsap.to(q('[data-bob]'), { y: -10, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    },
    { scope: root },
  )

  // dipanggil saat slider sampai ujung: bunyikan chime, tahan sebentar selagi handle berputar
  const confirm = () => {
    audio.current?.play().catch(() => {})
    return new Promise(resolve => setTimeout(resolve, 1400))
  }

  const leave = () => {
    gsap.delayedCall(0.75, onEnter)
    gsap.to(root.current, {
      yPercent: -100, duration: 1, ease: 'power4.inOut', delay: 0.75,
      onComplete: onGone, // App melepas komponen ini, scroll halaman aktif lagi
    })
    gsap.to(root.current!.firstElementChild, { scale: 0.92, autoAlpha: 0, filter: 'blur(12px)', duration: 0.7, ease: 'power2.in', delay: 0.6 })
  }

  const date = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div ref={root} className="fixed inset-0 z-[100] bg-[#ececef] shadow-[0_30px_80px_rgba(0,0,0,.25)]">
      <div className="flex h-full flex-col items-center justify-between px-6 py-[9vh] text-center text-[#1d1d1f]">
        <div data-in>
          <p className="text-[clamp(1rem,2vw,1.3rem)] font-medium text-neutral-600">{date}</p>
          <p className={`${display} text-[clamp(4.5rem,14vw,9rem)] font-semibold leading-none tracking-tight tabular-nums`}>{time}</p>
        </div>

        <div data-in className="flex flex-col items-center">
          <div data-bob>
            <FolderIcon className="w-24 drop-shadow-[0_14px_18px_rgba(40,110,200,.3)] sm:w-28" />
          </div>
          <p className={`${display} mt-5 text-2xl font-semibold`}>{profile.name}</p>
          <p className="text-[15px] text-neutral-500">{profile.role} · Portfolio</p>
        </div>

        <div data-in className="flex flex-col items-center gap-3">
          <SlideCommit
            label="Slide to enter"
            doneLabel="Welcome"
            onConfirm={confirm}
            onDone={leave}
            trackColor="#1d1d1f"
            handleColor="#ffffff"
            successColor="#3d8bff"
            width={300}
            height={60}
            radius={30}
            holdMs={4000}
          />
          <p className="text-[12px] text-neutral-500">Sound on for the full experience</p>
        </div>
      </div>
    </div>
  )
}
