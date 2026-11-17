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
  type: string
  year: string
  image: string
  summary: string
  features: string[]
  tags: string[]
  href?: string // link demo/live, isi kalau ada
}

// Deskripsi ditulis dari isi screenshot, sesuaikan dengan detail asli project kamu.
export const projects: Project[] = [
  {
    title: 'TB Karib',
    type: 'E-commerce',
    year: '2026',
    image: '/projects/tb-karib.jpg',
    summary: 'Online store for PD. Karib that brings a building materials shop online, so customers can browse and order cement, sand, bricks, paint and more from home.',
    features: ['Product catalog grouped by category', 'Weekly featured products', 'Customer cart, sign up and login', 'Automatic stock management'],
    tags: ['E-commerce', 'Catalog', 'Inventory'],
  },
  {
    title: 'Yummyverse',
    type: 'Recipe platform',
    year: '2026',
    image: '/projects/yummyverse.jpg',
    summary: 'A recipe discovery site for exploring dishes from around the world, from Japanese sushi and ramen to everyday family meals.',
    features: ['Recipe search', 'Browse recipes by cuisine and category', 'Save favourites', 'User login and register'],
    tags: ['Web App', 'Content', 'UI Design'],
  },
  {
    title: 'RBC Academy',
    type: 'Admin dashboard',
    year: '2026',
    image: '/projects/rbc-academy.jpg',
    summary: 'Admin panel for RBC Academy to run its membership and training programs, with live stats on members, programs and issued certificates.',
    features: ['Member and instructor management', 'Programs, events and assessments', 'Certificate issuing', 'Growth and gender analytics'],
    tags: ['Dashboard', 'Analytics', 'LMS'],
  },
  {
    title: 'Katalis',
    type: 'Partnership platform',
    year: '2026',
    image: '/projects/katalis.jpg',
    summary: "Turns companies' social commitments into measurable impact by connecting them with relevant community programs in one collaboration ecosystem.",
    features: ['Partnership portal for companies', 'Program catalog and governance flow', 'Impact tracking aligned with SDGs', 'Companion mobile workspace'],
    tags: ['Web + Mobile', 'CSR', 'Impact'],
  },
  {
    title: 'K-sirku',
    type: 'Monitoring dashboard',
    year: '2026',
    image: '/projects/k-sirku.jpg',
    summary: 'Command center for Rumah BUMN Cirebon to monitor the revenue and growth of the small businesses (UMKM) it mentors.',
    features: ['Aggregate revenue trends', 'Growth, stable and declining status per UMKM', 'UMKM approval and product catalog', 'Business sector breakdown'],
    tags: ['Dashboard', 'Monitoring', 'UMKM'],
  },
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
