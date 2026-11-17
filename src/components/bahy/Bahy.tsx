import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, Mic, Square, Volume2, VolumeX, X } from 'lucide-react'
import { BahyOrb } from './BahyOrb'
import { askBahy, greeting, suggestions, type BahyAction, type Lang } from './brain'
import { bahy, openProject, useBahy } from './store'
import { canListen, useVoice } from './useVoice'

type Msg = { id: number; from: 'you' | 'bahy'; text: string; shown: number }

const COPY = {
  id: {
    idle: 'Ketuk orb untuk bicara',
    listening: 'Mendengarkan…',
    thinking: 'Sebentar…',
    speaking: 'Bahy berbicara',
    placeholder: 'Atau ketik pertanyaan…',
    unsupported: 'Browser ini belum mendukung input suara. Ketik saja ya.',
    denied: 'Izin mikrofon ditolak. Aktifkan di pengaturan browser, atau ketik saja.',
    'no-speech': 'Aku tidak mendengar apa-apa. Coba lagi?',
    failed: 'Mikrofon sedang bermasalah. Coba lagi atau ketik saja.',
    demo: 'Demo',
  },
  en: {
    idle: 'Tap the orb to talk',
    listening: 'Listening…',
    thinking: 'One sec…',
    speaking: 'Bahy is speaking',
    placeholder: 'Or type a question…',
    unsupported: "This browser doesn't support voice input yet. Just type instead.",
    denied: 'Microphone access was blocked. Allow it in browser settings, or type instead.',
    'no-speech': "I didn't hear anything. Try again?",
    failed: 'The microphone ran into a problem. Try again or type instead.',
    demo: 'Demo',
  },
} as const

const defaultLang = (): Lang => (navigator.language?.toLowerCase().startsWith('id') ? 'id' : 'en')

function runAction(a: BahyAction) {
  if (a.type === 'scroll') document.getElementById(a.id)?.scrollIntoView({ behavior: 'smooth' })
  else openProject(a.index)
}

export function Bahy() {
  const { open, phase } = useBahy()
  const [lang, setLang] = useState<Lang>(defaultLang)
  const [voiceOn, setVoiceOn] = useState(true)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const voice = useVoice(lang)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextId = useRef(1)
  const t = COPY[lang]

  const setPhase = (p: typeof phase) => bahy.set({ phase: p })

  const close = useCallback(() => bahy.set({ open: false }), [])

  // panel ditutup (dari mana pun): hentikan mikrofon dan suara
  const { stopListening, stopSpeaking } = voice
  useEffect(() => {
    if (open) return
    stopListening()
    stopSpeaking()
    if (bahy.get().phase !== 'idle') bahy.set({ phase: 'idle' })
  }, [open, stopListening, stopSpeaking])

  // ⌘K / Ctrl+K untuk membuka, Esc untuk menutup
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (bahy.get().open) close()
        else bahy.set({ open: true })
      } else if (e.key === 'Escape' && bahy.get().open && !document.querySelector('[role=dialog][aria-modal=true]')) {
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs])

  const ask = async (question: string) => {
    const q = question.trim()
    if (!q || phase === 'thinking') return
    voice.stopSpeaking()
    voice.setError(null)
    setDraft('')
    setMsgs(m => [...m, { id: nextId.current++, from: 'you', text: q, shown: q.length }])
    setPhase('thinking')

    const res = await askBahy(q, lang)
    const id = nextId.current++
    setMsgs(m => [...m, { id, from: 'bahy', text: res.text, shown: 0 }])
    const reveal = (n: number) => setMsgs(m => m.map(x => (x.id === id ? { ...x, shown: Math.max(x.shown, n) } : x)))
    if (res.action) window.setTimeout(() => runAction(res.action!), 450)

    if (voiceOn) {
      setPhase('speaking')
      voice.speak(res.text, reveal, () => {
        reveal(res.text.length)
        if (bahy.get().phase === 'speaking') setPhase('idle')
      })
    } else {
      // tanpa suara: teks tetap mengalir cepat
      let n = 0
      const timer = window.setInterval(() => {
        n += 3
        reveal(n)
        if (n >= res.text.length) window.clearInterval(timer)
      }, 16)
      setPhase('idle')
    }
  }

  const toggleMic = () => {
    if (voice.listening) return voice.stopListening()
    if (!canListen()) return voice.setError('unsupported')
    voice.stopSpeaking()
    setPhase('listening')
    voice.listen(text => ask(text))
  }

  // fase kembali ke idle kalau mendengarkan selesai tanpa hasil
  useEffect(() => {
    if (!voice.listening && bahy.get().phase === 'listening') setPhase('idle')
  }, [voice.listening])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    ask(draft)
  }

  const status = voice.listening && voice.interim ? `“${voice.interim}”` : t[phase]
  const compact = msgs.length > 0

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="bahy"
          role="dialog"
          aria-label="Bahy assistant"
          initial={{ opacity: 0, scale: 0.9, y: -12, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.94, y: -8, filter: 'blur(8px)' }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="glass !fixed right-2 top-[52px] z-[75] flex max-h-[max(380px,calc(100svh-150px))] w-[min(390px,calc(100vw-16px))] origin-top-right flex-col overflow-hidden rounded-[28px] !bg-white/75 sm:right-4"
        >
          {/* header */}
          <div className="flex items-center gap-2 px-4 pb-1 pt-3.5">
            <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Bahy</span>
            <span className="rounded-full bg-black/[.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">{t.demo}</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="flex rounded-full bg-black/[.06] p-0.5 text-[11px] font-semibold">
                {(['id', 'en'] as const).map(l => (
                  <button key={l} onClick={() => setLang(l)} className={`rounded-full px-2 py-0.5 uppercase transition ${lang === l ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'}`}>
                    {l}
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  if (voiceOn) voice.stopSpeaking()
                  setVoiceOn(v => !v)
                }}
                aria-label={voiceOn ? 'Mute Bahy' : 'Unmute Bahy'}
                className="grid size-7 place-items-center rounded-full text-neutral-600 hover:bg-black/5"
              >
                {voiceOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </button>
              <button onClick={close} aria-label="Close Bahy" className="grid size-7 place-items-center rounded-full text-neutral-600 hover:bg-black/5">
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* orb */}
          <div className={`flex flex-col items-center transition-all duration-500 ${compact ? 'pb-2 pt-3' : 'pb-4 pt-8'}`}>
            <button onClick={toggleMic} aria-label={voice.listening ? 'Stop listening' : 'Talk to Bahy'} className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#3d8bff]">
              <BahyOrb size={compact ? 64 : 112} phase={phase} level={voice.level} className="transition-[width,height] duration-500" />
            </button>
            <AnimatePresence mode="wait">
              <motion.p
                key={status}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className={`mt-4 max-w-[85%] text-center text-[13px] font-medium ${voice.listening && voice.interim ? 'text-neutral-900' : 'text-neutral-500'}`}
              >
                {status}
              </motion.p>
            </AnimatePresence>
            {voice.error && <p className="mt-2 max-w-[85%] text-center text-[12px] text-[#c2410c]">{t[voice.error as keyof typeof t]}</p>}
          </div>

          {/* percakapan */}
          <div ref={listRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-3">
            {!compact && (
              <p className="rounded-2xl rounded-tl-md border border-black/5 bg-white/80 px-3.5 py-2.5 text-[14px] leading-relaxed text-neutral-800">{greeting(lang)}</p>
            )}
            {msgs.map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                className={m.from === 'you' ? 'flex justify-end' : 'flex'}
              >
                <p
                  className={`max-w-[85%] px-3.5 py-2.5 text-[14px] leading-relaxed ${
                    m.from === 'you' ? 'rounded-2xl rounded-br-md bg-[#1d1d1f] text-white' : 'rounded-2xl rounded-tl-md border border-black/5 bg-white/80 text-neutral-800'
                  }`}
                >
                  {m.text.slice(0, m.shown)}
                  {m.shown < m.text.length && <span className="text-neutral-300">{m.text.slice(m.shown)}</span>}
                </p>
              </motion.div>
            ))}
            {phase === 'thinking' && (
              <div className="flex gap-1 px-1 py-2">
                {[0, 1, 2].map(i => (
                  <motion.span key={i} className="size-1.5 rounded-full bg-neutral-400" animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            )}
          </div>

          {/* saran */}
          {!compact && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-3">
              {suggestions[lang].map(s => (
                <button key={s} onClick={() => ask(s)} className="rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-[12px] font-medium text-neutral-700 transition hover:bg-white">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* input */}
          <form onSubmit={submit} className="flex items-center gap-2 border-t border-black/5 p-2.5">
            <button
              type="button"
              onClick={toggleMic}
              aria-label={voice.listening ? 'Stop listening' : 'Speak'}
              className={`grid size-9 shrink-0 place-items-center rounded-full transition ${voice.listening ? 'bg-[#ff3b30] text-white' : 'bg-black/[.06] text-neutral-700 hover:bg-black/10'}`}
            >
              {voice.listening ? <Square className="size-3.5 fill-current" /> : <Mic className="size-4" />}
            </button>
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={t.placeholder}
              className="h-9 min-w-0 flex-1 rounded-full bg-white/80 px-3.5 text-[14px] outline-none ring-1 ring-black/5 placeholder:text-neutral-400 focus:ring-[#3d8bff]/50"
            />
            <button type="submit" disabled={!draft.trim()} aria-label="Send" className="grid size-9 shrink-0 place-items-center rounded-full bg-[#1d1d1f] text-white transition disabled:opacity-25">
              <ArrowUp className="size-4" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Tombol orb kecil di menu bar. */
export function BahyTrigger() {
  const { open, phase } = useBahy()
  return (
    <button
      onClick={() => (open ? bahy.set({ open: false }) : bahy.set({ open: true }))}
      aria-label="Ask Bahy (⌘K)"
      title="Ask Bahy (⌘K)"
      className={`flex items-center gap-1.5 rounded-full py-0.5 pl-1 pr-1 transition hover:bg-black/5 sm:pr-2 ${open ? 'bg-black/[.07]' : ''}`}
    >
      <BahyOrb size={18} phase={phase} />
      <span className="hidden text-[12px] font-semibold text-neutral-700 sm:inline">Bahy</span>
    </button>
  )
}
