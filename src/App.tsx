import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { FolderOpen, House, Mail, Terminal, UserRound, Workflow, type LucideIcon } from 'lucide-react'
import ClickSpark from '@/components/ClickSpark'
import Dock from '@/components/Dock'
import { MenuBar, go } from '@/components/Mac'
import { Hero } from '@/sections/Hero'
import { Intro } from '@/sections/Intro'
import { About, Contact, Inside, Projects, Workflow as WorkflowSection } from '@/sections/Sections'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const icon = (Icon: LucideIcon, a: string, b: string) => (
  <div className="app-icon" style={{ background: `linear-gradient(160deg, ${a}, ${b})` }}>
    <Icon className="size-[55%]" strokeWidth={2.2} />
  </div>
)

const dock = [
  { icon: icon(House, '#5ac8fa', '#0a84ff'), label: 'Home', onClick: () => go('home') },
  { icon: icon(UserRound, '#c4b5fd', '#7c3aed'), label: 'About', onClick: () => go('about') },
  { icon: icon(FolderOpen, '#7dd3fc', '#2563eb'), label: 'Projects', onClick: () => go('projects') },
  // { icon: icon(LayoutGrid, '#fda4af', '#e11d48'), label: 'Skills', onClick: () => go('skills') },
  { icon: icon(Workflow, '#fda4af', '#e11d48'), label: 'Workflow', onClick: () => go('workflow') },
  { icon: icon(Terminal, '#52525b', '#09090b'), label: 'Terminal', onClick: () => go('contact') },
  { icon: icon(Mail, '#6ee7b7', '#059669'), label: 'Contact', onClick: () => go('contact') },
]

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)
  const [intro, setIntro] = useState(true)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
        gsap.from(el, {
          y: 70, scale: 0.94, autoAlpha: 0, filter: 'blur(10px)', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-blob]').forEach((el, i) => {
        gsap.to(el, { x: i % 2 ? -80 : 80, y: i % 3 ? 60 : -60, scale: 1.15, duration: 9 + i, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      })
    },
    { scope: root },
  )

  return (
    <ClickSpark sparkColor="#2f6fed" sparkCount={10} sparkRadius={22}>
      <div ref={root} className="relative isolate">
        {intro && <Intro onEnter={() => setEntered(true)} onGone={() => setIntro(false)} />}
        <MenuBar />
        <main>
          <Hero start={entered} />
          <Inside />
          <About />
          <Projects />
          {/* Launchpad (Skills) disembunyikan dulu. Hapus komentar ini untuk menampilkannya lagi. */}
          {/* <Skills /> */}
          <WorkflowSection />
          <Contact />
        </main>
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-28 [&>*]:pointer-events-auto">
          <Dock items={dock} theme="light" tiles={false} baseItemSize={48} magnification={74} panelHeight={64} />
        </div>
      </div>
    </ClickSpark>
  )
}
