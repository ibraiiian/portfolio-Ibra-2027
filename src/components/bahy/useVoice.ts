import { useCallback, useEffect, useRef, useState } from 'react'
import type { Lang } from './brain'

/* ---- Web Speech API typings (belum ada di lib DOM bawaan TypeScript) ---- */
type RecognitionResult = { isFinal: boolean; 0: { transcript: string } }
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> }
type Recognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start(): void
  stop(): void
  abort(): void
  onresult: ((e: RecognitionEvent) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}
type RecognitionCtor = new () => Recognition

const getRecognition = (): RecognitionCtor | undefined => {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export const canListen = () => typeof window !== 'undefined' && !!getRecognition()
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window

const LOCALE: Record<Lang, string> = { id: 'id-ID', en: 'en-US' }

/**
 * Mikrofon → teks (Web Speech API) + level suara untuk animasi orb,
 * dan teks → suara (speechSynthesis). Semuanya gratis, berjalan di browser.
 * `level` adalah ref 0..1 yang dibaca orb tiap frame, jadi tidak memicu render ulang.
 */
export function useVoice(lang: Lang) {
  const level = useRef(0)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [error, setError] = useState<string | null>(null)

  const rec = useRef<Recognition | null>(null)
  const media = useRef<{ stream: MediaStream; ctx: AudioContext; raf: number } | null>(null)
  const speakRaf = useRef(0)

  const stopMeter = () => {
    const m = media.current
    if (!m) return
    cancelAnimationFrame(m.raf)
    m.stream.getTracks().forEach(t => t.stop())
    m.ctx.close().catch(() => {})
    media.current = null
    level.current = 0
  }

  // level mikrofon untuk orb (opsional: kalau gagal, orb tetap beranimasi sendiri)
  const startMeter = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(analyser)
      const data = new Uint8Array(analyser.fftSize)
      const tick = () => {
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (const v of data) sum += ((v - 128) / 128) ** 2
        const rms = Math.sqrt(sum / data.length)
        level.current += (Math.min(1, rms * 5) - level.current) * 0.3
        if (media.current) media.current.raf = requestAnimationFrame(tick)
      }
      media.current = { stream, ctx, raf: requestAnimationFrame(tick) }
    } catch {
      /* izin ditolak atau tidak ada mikrofon: recognition yang akan melaporkan errornya */
    }
  }

  const listen = useCallback(
    (onFinal: (text: string) => void) => {
      const Ctor = getRecognition()
      if (!Ctor) {
        setError('unsupported')
        return
      }
      window.speechSynthesis?.cancel()
      setError(null)
      setInterim('')
      const r = new Ctor()
      r.lang = LOCALE[lang]
      r.interimResults = true
      r.continuous = false
      let finalText = ''
      r.onresult = e => {
        let text = ''
        for (let i = 0; i < e.results.length; i++) {
          text += e.results[i][0].transcript
          if (e.results[i].isFinal) finalText = text
        }
        setInterim(text)
      }
      r.onerror = e => setError(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'denied' : e.error === 'no-speech' ? 'no-speech' : 'failed')
      r.onend = () => {
        setListening(false)
        stopMeter()
        rec.current = null
        const text = (finalText || '').trim()
        if (text) onFinal(text)
      }
      rec.current = r
      setListening(true)
      r.start()
      startMeter()
    },
    [lang],
  )

  const stopListening = useCallback(() => rec.current?.stop(), [])

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel()
    cancelAnimationFrame(speakRaf.current)
    level.current = 0
  }, [])

  /** Ucapkan teks. onWord dipanggil per kata (untuk efek teks mengalir), onEnd saat selesai. */
  const speak = useCallback(
    (text: string, onWord: (spoken: number) => void, onEnd: () => void) => {
      if (!canSpeak()) {
        onWord(text.length)
        onEnd()
        return
      }
      const synth = window.speechSynthesis
      synth.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = LOCALE[lang]
      const voice = synth.getVoices().find(v => v.lang.replace('_', '-').startsWith(LOCALE[lang].slice(0, 2)))
      if (voice) u.voice = voice
      u.rate = 1.03

      // level suara palsu (speechSynthesis tidak bisa dianalisis) supaya orb "berbicara"
      const t0 = performance.now()
      const tick = (t: number) => {
        const s = (t - t0) / 1000
        level.current = 0.35 + 0.3 * Math.abs(Math.sin(s * 9)) * (0.6 + 0.4 * Math.sin(s * 2.3))
        speakRaf.current = requestAnimationFrame(tick)
      }
      speakRaf.current = requestAnimationFrame(tick)

      let done = false
      const finish = () => {
        if (done) return
        done = true
        cancelAnimationFrame(speakRaf.current)
        level.current = 0
        onWord(text.length)
        onEnd()
      }
      u.onboundary = e => onWord(e.charIndex + (e.charLength || 0))
      u.onend = finish
      u.onerror = finish
      synth.speak(u)
      // beberapa browser tidak mengirim onboundary: tampilkan teks bertahap sebagai cadangan
      const fallback = window.setInterval(() => {
        if (done) return window.clearInterval(fallback)
        const est = Math.floor(((performance.now() - t0) / 1000) * 14)
        onWord(Math.min(est, text.length))
      }, 120)
    },
    [lang],
  )

  useEffect(
    () => () => {
      rec.current?.abort()
      stopMeter()
      window.speechSynthesis?.cancel()
      cancelAnimationFrame(speakRaf.current)
    },
    [],
  )

  return { level, listening, interim, error, setError, listen, stopListening, speak, stopSpeaking }
}
