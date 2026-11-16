// ✏️ Semua konten portfolio ada di sini, ganti placeholder dengan data asli kamu.
export const profile = {
  name: 'Ibrahim Bahaly',
  role: 'Software Engineer',
  handle: '~/ibrahim/projects',
  location: 'Indonesia',
  email: 'hello@example.com', // TODO: ganti
  builds: ['web apps', 'APIs', 'interfaces', 'tools'],
  bio: [
    "Hi, I'm Ibrahim, a software engineer who enjoys turning ideas into fast, reliable and delightful products.",
    'I care about clean architecture, thoughtful interfaces and the small details that make software feel alive.',
  ],
  stats: [
    { label: 'Projects shipped', value: 12, suffix: '+' },
    { label: 'Years of coding', value: 3, suffix: '+' },
    { label: 'Technologies', value: 15, suffix: '+' },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/' }, // TODO: ganti
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' }, // TODO: ganti
  ],
}

export const highlights = ['Clean, maintainable code', 'Interfaces that feel alive', 'Shipping things that matter']

export type Project = {
  title: string
  category: 'Web' | 'Mobile' | 'Backend'
  year: string
  desc: string
  stack: string[]
  colors: [string, string]
  href?: string
}

// TODO: ganti dengan project asli
export const projects: Project[] = [
  { title: 'Commerce Dashboard', category: 'Web', year: '2026', desc: 'Realtime analytics dashboard for an online store, with role-based access.', stack: ['React', 'TypeScript', 'Tailwind'], colors: ['#5b8cff', '#8b5cf6'] },
  { title: 'Internship Logbook', category: 'Web', year: '2026', desc: 'Daily activity logbook with supervisor review and export to spreadsheet.', stack: ['Next.js', 'PostgreSQL'], colors: ['#34d399', '#0ea5e9'] },
  { title: 'Realtime Chat API', category: 'Backend', year: '2025', desc: 'WebSocket messaging service with presence, rooms and message history.', stack: ['Node.js', 'Redis', 'Docker'], colors: ['#f59e0b', '#ef4444'] },
  { title: 'Parts Catalog', category: 'Mobile', year: '2025', desc: 'Mobile catalog to search spare parts by code, category and vehicle type.', stack: ['React Native', 'Expo'], colors: ['#f43f5e', '#fb923c'] },
  { title: 'Auth Service', category: 'Backend', year: '2025', desc: 'Token-based authentication service with refresh rotation and audit logs.', stack: ['Go', 'PostgreSQL'], colors: ['#06b6d4', '#3b82f6'] },
  { title: 'Portfolio OS', category: 'Web', year: '2026', desc: 'This website, a macOS-inspired desktop built with GSAP and Motion.', stack: ['React', 'GSAP', 'Motion'], colors: ['#a855f7', '#ec4899'] },
]

export const skills = [
  { name: 'TypeScript', short: 'TS', colors: ['#3b82f6', '#1d4ed8'] },
  { name: 'JavaScript', short: 'JS', colors: ['#facc15', '#eab308'] },
  { name: 'React', short: 'Re', colors: ['#22d3ee', '#0891b2'] },
  { name: 'Next.js', short: 'N', colors: ['#3f3f46', '#09090b'] },
  { name: 'Node.js', short: 'No', colors: ['#4ade80', '#15803d'] },
  { name: 'Tailwind', short: 'Tw', colors: ['#38bdf8', '#0284c7'] },
  { name: 'PostgreSQL', short: 'Pg', colors: ['#60a5fa', '#1e40af'] },
  { name: 'Docker', short: 'Dk', colors: ['#38bdf8', '#2563eb'] },
  { name: 'Git', short: 'Git', colors: ['#fb923c', '#ea580c'] },
  { name: 'GSAP', short: 'GS', colors: ['#a3e635', '#16a34a'] },
  { name: 'Figma', short: 'Fg', colors: ['#f472b6', '#a855f7'] },
  { name: 'Go', short: 'Go', colors: ['#67e8f9', '#0e7490'] },
] as const

// Workflow ngoding: desain → prototipe → build
export const workflow = [
  { step: '01', phase: 'Design', tool: 'Figma', image: '/tools/figma.jpg', bare: false, desc: 'Wireframes, components and the visual system start here. Every screen is designed before a single line of code.' },
  { step: '02', phase: 'Prototype', tool: 'Framer', image: '/tools/framer.jpg', bare: false, desc: 'Interactions and motion are prototyped so the feel of the product is tested early, not guessed.' },
  { step: '03', phase: 'Build', tool: 'Claude Code', image: '/tools/claude-code.svg', bare: true, desc: 'Pair-programming with Claude Code to scaffold, refactor, review and ship production-ready code faster.' },
]
