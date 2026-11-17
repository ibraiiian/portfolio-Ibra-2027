// Otak DUMMY Bahy: mencocokkan kata kunci dengan data portfolio.
// Nanti diganti dengan panggilan ke server (Groq) tanpa mengubah UI: cukup ganti isi `askBahy`.
import { profile, projects, workflow } from '@/data'

export type Lang = 'id' | 'en'
export type BahyAction = { type: 'scroll'; id: string } | { type: 'project'; index: number }
export type BahyReply = { text: string; action?: BahyAction }

const has = (q: string, words: string[]) => words.some(w => q.includes(w))

export const suggestions: Record<Lang, string[]> = {
  id: ['Siapa Ibrahim?', 'Tunjukkan project Katalis', 'Tools apa yang dipakai?', 'Gimana cara menghubungi?'],
  en: ['Who is Ibrahim?', 'Show me the Katalis project', 'What tools does he use?', 'How can I contact him?'],
}

export function greeting(lang: Lang) {
  return lang === 'id'
    ? 'Hai, aku Bahy, asisten di portfolio Ibrahim. Tanya apa saja tentang dia, project-nya, atau cara menghubunginya.'
    : "Hi, I'm Bahy, the assistant on Ibrahim's portfolio. Ask me anything about him, his projects, or how to reach him."
}

function reply(q: string, lang: Lang): BahyReply {
  const id = lang === 'id'
  const name = profile.name.split(' ')[0]

  // project tertentu: cocokkan kata khas dari judulnya (karib, yummy, rbc, katalis, sirku)
  const keys = (title: string) =>
    title
      .toLowerCase()
      .replace(/-/g, ' ')
      .split(' ')
      .filter(w => w.length >= 3 && w !== 'tb')
      .flatMap(w => (w.length > 6 ? [w, w.slice(0, 5)] : [w]))
  const p = projects.findIndex(pr => keys(pr.title).some(k => q.includes(k)))
  if (p >= 0) {
    const pr = projects[p]
    return {
      text: id
        ? `${pr.title} adalah ${pr.type.toLowerCase()} (${pr.year}). Aku buka detailnya sekarang.`
        : `${pr.title} is a ${pr.type.toLowerCase()} from ${pr.year}. Opening the details for you now.`,
      action: { type: 'project', index: p },
    }
  }

  if (has(q, ['halo', 'hai', 'hello', 'hi ', 'hey', 'pagi', 'siang', 'malam'])) {
    return { text: greeting(lang) }
  }

  if (has(q, ['siapa', 'tentang', 'about', 'who', 'kenal', 'profil', 'profile'])) {
    return {
      text: id
        ? `${profile.name} adalah ${profile.role.toLowerCase()} dari ${profile.location}. Dia suka membangun produk yang cepat, andal, dan enak dipakai, dengan perhatian ke detail kecil.`
        : `${profile.name} is a ${profile.role.toLowerCase()} based in ${profile.location}. He builds fast, reliable products and cares about the small details that make software feel alive.`,
      action: { type: 'scroll', id: 'about' },
    }
  }

  if (has(q, ['project', 'proyek', 'karya', 'work', 'portfolio', 'bikin apa', 'built'])) {
    const list = projects.map(pr => pr.title).join(', ')
    return {
      text: id
        ? `${name} punya ${projects.length} project unggulan: ${list}. Sebut salah satunya kalau mau lihat detailnya.`
        : `${name} has ${projects.length} featured projects: ${list}. Name one and I'll open it.`,
      action: { type: 'scroll', id: 'projects' },
    }
  }

  if (has(q, ['tool', 'workflow', 'figma', 'framer', 'claude', 'stack', 'skill', 'pakai apa', 'teknologi'])) {
    const tools = workflow.map(w => `${w.tool} (${w.phase})`).join(', ')
    return {
      text: id ? `Alur kerja ${name}: ${tools}.` : `${name}'s workflow: ${tools}.`,
      action: { type: 'scroll', id: 'workflow' },
    }
  }

  if (has(q, ['kontak', 'contact', 'email', 'hubungi', 'hire', 'kerja sama', 'collab', 'reach'])) {
    return {
      text: id
        ? `${name} sedang terbuka untuk kerja dan kolaborasi. Kamu bisa kirim email ke ${profile.email}, atau lewat GitHub dan LinkedIn di bagian bawah.`
        : `${name} is open to work and collaborations. Email ${profile.email}, or use GitHub and LinkedIn at the bottom of the page.`,
      action: { type: 'scroll', id: 'contact' },
    }
  }

  return {
    text: id
      ? 'Aku masih versi demo, jadi baru paham pertanyaan tentang Ibrahim, project-nya, tools, dan kontak. Coba salah satu saran di bawah ya.'
      : "I'm still a demo, so I only understand questions about Ibrahim, his projects, tools, and contact. Try one of the suggestions below.",
  }
}

/** Jeda kecil supaya fase "thinking" terlihat, seperti menunggu server. */
export async function askBahy(question: string, lang: Lang): Promise<BahyReply> {
  await new Promise(r => setTimeout(r, 650 + Math.random() * 450))
  return reply(` ${question.toLowerCase()} `, lang)
}
