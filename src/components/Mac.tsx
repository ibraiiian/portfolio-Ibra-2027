import { useEffect, useState, type ReactNode } from 'react'
import { Command, Search, Wifi, BatteryMedium } from 'lucide-react'

export const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

/* ---------- macOS folder icon ---------- */
export function FolderIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 98" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="fBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#58b4f2" />
          <stop offset="1" stopColor="#2f8fe0" />
        </linearGradient>
        <linearGradient id="fFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd6fb" />
          <stop offset="1" stopColor="#45a9ee" />
        </linearGradient>
      </defs>
      <path d="M8 15a9 9 0 0 1 9-9h25c3.2 0 5.6 1.2 7.6 3.4l4.6 5.6H103a9 9 0 0 1 9 9v14H8z" fill="url(#fBack)" />
      <rect x="4" y="25" width="112" height="68" rx="10" fill="url(#fFront)" />
      <rect x="4.5" y="25.5" width="111" height="2" rx="1" fill="#fff" opacity=".55" />
    </svg>
  )
}

/* ---------- top menu bar ---------- */
const menu = [
  ['About', 'about'],
  ['Projects', 'projects'],
  // ['Skills', 'skills'], // Launchpad disembunyikan
  ['Workflow', 'workflow'],
  ['Contact', 'contact'],
] as const

export function MenuBar() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(t)
  }, [])
  const date = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2">
      <nav className="glass mx-auto flex h-9 max-w-[1400px] items-center gap-1 rounded-full px-3 text-[13px] font-medium text-neutral-800">
        <button onClick={() => go('home')} aria-label="Home" className="grid size-6 place-items-center rounded-full hover:bg-black/5">
          <Command className="size-3.5" strokeWidth={2.4} />
        </button>
        <button onClick={() => go('home')} className="rounded-full px-2 py-0.5 font-bold hover:bg-black/5">
          Portfolio
        </button>
        {menu.map(([label, id]) => (
          <button key={id} onClick={() => go(id)} className="hidden rounded-full px-2 py-0.5 hover:bg-black/5 sm:block">
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 text-neutral-700">
          <BatteryMedium className="hidden size-4 sm:block" />
          <Wifi className="hidden size-3.5 sm:block" />
          <Search className="hidden size-3.5 sm:block" />
          <span className="whitespace-nowrap tabular-nums">
            <span className="hidden sm:inline">{date} </span>
            {time}
          </span>
          <span className="whitespace-nowrap font-bold">© 2026</span>
        </div>
      </nav>
    </header>
  )
}

/* ---------- glass window ---------- */
export function Window({
  title,
  children,
  className = '',
  dark = false,
  toolbar,
}: {
  title: string
  children: ReactNode
  className?: string
  dark?: boolean
  toolbar?: ReactNode
}) {
  return (
    <div className={`${dark ? 'glass-dark text-white' : 'glass'} overflow-hidden rounded-[26px] ${className}`}>
      <div className={`relative flex h-11 items-center gap-2 px-4 ${dark ? 'border-b border-white/10' : 'border-b border-black/5'}`}>
        <span className="size-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_.5px_rgba(0,0,0,.15)]" />
        <span className="size-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_.5px_rgba(0,0,0,.15)]" />
        <span className="size-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_.5px_rgba(0,0,0,.15)]" />
        <span className={`pointer-events-none absolute inset-x-0 text-center text-[13px] font-semibold ${dark ? 'text-white/70' : 'text-neutral-600'}`}>
          {title}
        </span>
        <div className="ml-auto">{toolbar}</div>
      </div>
      {children}
    </div>
  )
}

export function Blobs({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 ${className}`} aria-hidden="true">
      <div className="blob left-[-8%] top-[8%] size-[420px] bg-[#d9d9de]" data-blob />
      <div className="blob right-[-6%] top-[30%] size-[460px] bg-white" data-blob />
      <div className="blob bottom-[-10%] left-[30%] size-[380px] bg-[#cfcfd6]" data-blob />
    </div>
  )
}
