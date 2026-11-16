import { Fragment, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { Blobs, FolderIcon, Window, go } from '@/components/Mac'
import Folder from '@/components/Folder'
import Stack from '@/components/Stack'
import ScrollReveal from '@/components/ScrollReveal'
import RotatingText from '@/components/RotatingText'
import TiltedCard from '@/components/TiltedCard'
import ShinyText from '@/components/ShinyText'
import SplitText from '@/components/SplitText'
import CountUp from '@/components/CountUp'
import SpotlightCard from '@/components/SpotlightCard'
import { highlights, profile, projects, skills, workflow, type Project } from '@/data'

gsap.registerPlugin(ScrollTrigger)

const display = 'font-[family-name:var(--font-display)]'

function Art({ p, className = '' }: { p: Project; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }}>
      <div className="absolute -right-6 -top-10 size-40 rounded-full bg-white/25 blur-2xl" />
      <div className="absolute inset-x-4 bottom-0 top-8 rounded-t-xl bg-white/90 p-3 shadow-xl">
        <div className="mb-2 flex gap-1">
          <i className="size-1.5 rounded-full bg-[#ff5f57]" />
          <i className="size-1.5 rounded-full bg-[#febc2e]" />
          <i className="size-1.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="h-2 w-1/2 rounded-full" style={{ background: p.colors[0] }} />
        <div className="mt-2 h-1.5 w-4/5 rounded-full bg-neutral-200" />
        <div className="mt-1.5 h-1.5 w-3/5 rounded-full bg-neutral-200" />
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <div className="h-8 rounded-md bg-neutral-100" />
          <div className="h-8 rounded-md opacity-70" style={{ background: p.colors[1] }} />
          <div className="h-8 rounded-md bg-neutral-100" />
        </div>
      </div>
    </div>
  )
}

const folderItems = [
  { image: '/photos/lets-go.jpg', title: "Let's go!" },
  { image: '/photos/hmm.jpg', title: 'Ideas' },
  { image: '/photos/we-did-it.jpg', title: 'We did it!' },
  { image: '/photos/focus-mode.jpg', title: 'Focus mode' },
  { image: '/photos/easy.jpg', title: 'Easy.' },
  { image: '/photos/you-got-this.jpg', title: 'You got this!' },
]

/* ============ WHAT'S INSIDE THIS FOLDER ============ */
export function Inside() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.from(q('[data-pop]'), {
        scale: 0.6, autoAlpha: 0, y: 20, duration: 0.6, ease: 'back.out(2)', stagger: 0.15,
        scrollTrigger: { trigger: root.current, start: 'top 55%' },
      })
      gsap.fromTo(
        q('[data-pix]'),
        { x: 160, y: 120 },
        { x: 0, y: 0, ease: 'power2.out', scrollTrigger: { trigger: q('[data-head]')[0], start: 'top 80%', end: 'top 35%', scrub: 0.6 } },
      )
      ScrollTrigger.create({ trigger: q('[data-stage]')[0], start: 'top 60%', once: true, onEnter: () => setOpen(true) })
    },
    { scope: root },
  )

  return (
    <section id="inside" ref={root} className="relative mx-2 overflow-hidden rounded-[40px] bg-[#dcdee2] px-4 pt-24 sm:mx-4">
      <FolderIcon className="absolute right-[6%] top-10 w-16 opacity-90 sm:w-24" />
      <FolderIcon className="absolute left-[5%] top-[42%] hidden w-28 md:block" />

      <div data-pop className="glass mx-auto flex w-fit items-stretch rounded-2xl text-[15px] font-medium text-neutral-800 after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[9px] after:border-transparent after:border-t-white/80">
        {['Cut', 'Copy', 'Paste', 'Replace… ▸'].map((t, i) => (
          <button key={t} className={`px-4 py-2 hover:bg-white/50 ${i ? 'border-l border-black/10' : ''}`}>
            {t}
          </button>
        ))}
      </div>

      <div data-head className="relative mx-auto mt-8 w-fit text-center uppercase leading-[0.9] tracking-[-0.04em] text-black [font-family:'Helvetica_Neue',Helvetica,Arial,sans-serif]">
        <SplitText tag="h2" text="What's inside" className="text-[clamp(2.6rem,10vw,8.5rem)] font-bold" splitType="chars" delay={30} />
        <SplitText tag="h2" text="this folder" className="text-[clamp(2.6rem,10vw,8.5rem)] font-light" splitType="chars" delay={30} />
        <svg data-pix viewBox="0 0 12 19" className="pixelated absolute left-[52%] top-[62%] z-10 w-[clamp(18px,3vw,34px)]" shapeRendering="crispEdges" aria-hidden="true">
          <path d="M0 0v16h1v-1h1v-1h1v-1h1v2h1v2h1v2h2v-2H7v-2H6v-2h5v-1h-1v-1H9V9H8V8H7V7H6V6H5V5H4V4H3V3H2V2H1V1z" fill="#111" />
          <path d="M1 2v12h1v-1h1v-1h2v2h1v2h1v2h1v-2H7v-2H6v-2h3v-1H8V9H7V8H6V7H5V6H4V5H3V4H2V3z" fill="#bfe0ff" />
        </svg>
      </div>

      <div data-pop className="glass relative z-10 mx-auto mt-8 w-[min(88vw,290px)] rounded-2xl p-3 text-[16px] text-neutral-900 md:ml-[52%]">
        {highlights.map((h, i) => (
          <button
            key={h}
            onMouseEnter={() => setActive(i)}
            className={`relative block w-full px-3 py-2 text-left ${i ? 'border-t border-black/10' : ''}`}
          >
            {active === i && <motion.span layoutId="hl" className="absolute inset-x-0 inset-y-1 rounded-md bg-[#b9d9fb]" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            <span className="relative">{h}</span>
          </button>
        ))}
      </div>

      {/* project folder (React Bits) */}
      <div data-stage className="flex justify-center pb-24 pt-44">
        <Folder
          label="Me"
          items={folderItems}
          open={open}
          onOpenChange={setOpen}
          mode="flap"
          variant="solid"
          layout="spread"
          color="#3d8bff"
          paperColor="#ffffff"
          tabPosition="right"
          openOn="click"
          size={1.3}
          frost={0.25}
          tilt={0.5}
          speed={1}
          bounce={0.4}
          peek
          intro
          draggable
          zoomOnClick
          theme="light"
        />
      </div>
    </section>
  )
}

/* ============ ABOUT ============ */
const stackPhotos = ['easy', 'what', 'no-way', 'nap-time', 'lets-go']

export function About() {
  return (
    <section id="about" className="relative py-28">
      <Blobs />
      <div className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-12">
        {/* photo stack widget */}
        <div data-reveal className="glass flex flex-col items-center rounded-[30px] p-6 md:col-span-4">
          <p className="mb-5 self-start text-[13px] font-semibold text-neutral-500">Photos · drag or click</p>
          <div className="my-auto h-[300px] w-[220px] sm:h-[340px] sm:w-[250px]">
            <Stack
              cards={stackPhotos.map(n => (
                <img key={n} src={`/photos/${n}.jpg`} alt={n} />
              ))}
              layout="pile"
              radius={22}
              frame={8}
              frameColor="#ffffff"
              sendToBackOnClick
              autoplay
              autoplayDelay={3500}
              pauseOnHover
            />
          </div>
          <p className={`${display} mt-6 text-lg font-semibold`}>{profile.name}</p>
          <p className="flex items-center gap-1 text-[13px] text-neutral-500">
            <MapPin className="size-3.5" /> {profile.location}
          </p>
        </div>

        {/* bio window */}
        <div data-reveal className="md:col-span-8">
          <Window title="about-me.md" className="h-full">
            <div className="p-6 sm:p-10">
              <h2 className={`${display} flex flex-wrap items-center gap-x-3 gap-y-2 text-[clamp(1.9rem,4.4vw,3.4rem)] font-semibold leading-tight tracking-tight`}>
                I build
                <RotatingText
                  texts={profile.builds}
                  effect="slide"
                  rotationInterval={2200}
                  staggerDuration={0.02}
                  mainClassName="overflow-hidden rounded-2xl bg-[#1d1d1f] px-4 py-1 text-white"
                />
              </h2>
              <ScrollReveal
                mode="scrub"
                effect="rise"
                splitBy="words"
                enableBlur
                baseOpacity={0.12}
                containerClassName="mt-7"
                textClassName="text-[clamp(1.15rem,2vw,1.6rem)] font-medium leading-snug text-neutral-800"
              >
                {profile.bio.join(' ')}
              </ScrollReveal>
            </div>
          </Window>
        </div>

        {/* stat widgets */}
        {profile.stats.map(s => (
          <div key={s.label} data-reveal className="glass rounded-[26px] px-6 py-5 md:col-span-3">
            <div className={`${display} text-5xl font-semibold tabular-nums`}>
              <CountUp to={s.value} suffix={s.suffix} duration={1.6} />
            </div>
            <div className="mt-1 text-[13px] font-medium text-neutral-500">{s.label}</div>
          </div>
        ))}
        <div data-reveal className="glass-dark flex flex-col justify-between rounded-[26px] px-6 py-5 text-white md:col-span-3">
          <span className="flex items-center gap-2 text-[13px] font-medium text-white/70">
            <i className="size-2 animate-pulse rounded-full bg-emerald-400" /> Status
          </span>
          <span className={`${display} mt-3 text-xl font-semibold leading-tight`}>Open to work & collaborations</span>
        </div>
      </div>

    </section>
  )
}

/* ============ PROJECTS (Finder) ============ */
const cats = ['All', 'Web', 'Mobile', 'Backend'] as const

export function Projects() {
  const [cat, setCat] = useState<(typeof cats)[number]>('All')
  const list = projects.filter(p => cat === 'All' || p.category === cat)
  return (
    <section id="projects" className="relative px-4 py-20">
      <Blobs />
      <div data-reveal className="mx-auto max-w-6xl">
        <Window title={`Projects · ${list.length} items`}>
          <div className="grid md:grid-cols-[190px_1fr]">
            <aside className="flex gap-1 overflow-x-auto border-black/5 p-3 md:flex-col md:border-r">
              <p className="hidden px-2 pb-1 text-[11px] font-semibold text-neutral-400 md:block">Favorites</p>
              {cats.map(c => (
                <button key={c} onClick={() => setCat(c)} className="relative flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[14px] font-medium">
                  {cat === c && <motion.span layoutId="cat" className="absolute inset-0 rounded-lg bg-black/[.08]" />}
                  <FolderIcon className="relative w-5" />
                  <span className="relative">{c}</span>
                </button>
              ))}
            </aside>
            <motion.div layout className="grid min-h-[420px] content-start gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map(p => (
                  <motion.a
                    layout
                    key={p.title}
                    href={p.href ?? '#projects'}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    className="group block"
                  >
                    <SpotlightCard theme="light" spotlightColor="rgba(0,0,0,.08)" className="!rounded-2xl !border-white/70 !bg-white/60 !p-0">
                      <Art p={p} className="aspect-[16/10] w-full" />
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className={`${display} text-[17px] font-semibold`}>{p.title}</h3>
                          <ArrowUpRight className="size-4 text-neutral-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900" />
                        </div>
                        <p className="mt-1 text-[13px] leading-snug text-neutral-600">{p.desc}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {p.stack.map(s => (
                            <span key={s} className="rounded-full bg-black/[.06] px-2 py-0.5 text-[11px] font-medium text-neutral-700">
                              {s}
                            </span>
                          ))}
                          <span className="ml-auto text-[11px] tabular-nums text-neutral-400">{p.year}</span>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.a>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </Window>
      </div>
    </section>
  )
}

/* ============ SKILLS (Launchpad) ============ */
export function Skills() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.from(gsap.utils.selector(root)('[data-app]'), {
        scale: 0, autoAlpha: 0, duration: 0.6, ease: 'back.out(2.2)', stagger: { each: 0.05, grid: 'auto', from: 'center' },
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      })
    },
    { scope: root },
  )
  return (
    <section id="skills" ref={root} className="relative px-4 py-24">
      <Blobs />
      <div className="mx-auto max-w-4xl text-center">
        <SplitText tag="h2" text="Launchpad" splitType="chars" delay={30} className={`${display} text-[clamp(2.2rem,6vw,4.5rem)] font-semibold tracking-tight`} />
        <p className="mt-2 text-neutral-600">The tools I reach for every day.</p>
        <div className="glass mt-10 grid grid-cols-3 gap-x-4 gap-y-8 rounded-[36px] p-8 sm:grid-cols-4 sm:p-12 md:grid-cols-6">
          {skills.map(s => (
            <div key={s.name} data-app>
              <motion.div whileHover={{ scale: 1.18, y: -8 }} whileTap={{ scale: 0.92 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} className="flex flex-col items-center gap-2">
                <div className="size-16 sm:size-[72px]">
                  <div className={`app-icon ${display} text-xl font-bold`} style={{ background: `linear-gradient(160deg, ${s.colors[0]}, ${s.colors[1]})` }}>
                    {s.short}
                  </div>
                </div>
                <span className="text-[12px] font-medium text-neutral-700">{s.name}</span>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============ WORKFLOW ============ */
export function Workflow() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({ scrollTrigger: { trigger: q('[data-flow]')[0], start: 'top 70%' } })
      tl.from(q('[data-step]'), { y: 80, autoAlpha: 0, rotation: i => [-8, 0, 8][i], duration: 0.9, ease: 'back.out(1.5)', stagger: 0.18 })
        .from(q('[data-arrow]'), { scaleX: 0, autoAlpha: 0, transformOrigin: 'left center', duration: 0.5, ease: 'power2.out', stagger: 0.18 }, '-=0.7')
    },
    { scope: root },
  )
  return (
    <section id="workflow" ref={root} className="relative px-4 py-24">
      <Blobs />
      <div className="mx-auto max-w-6xl text-center">
        <div className="mb-3 flex justify-center">
          <ShinyText text="HOW I WORK" color="#8e8e93" shineColor="#1d1d1f" speed={3} className="text-[13px] font-semibold tracking-[0.25em]" />
        </div>
        <SplitText tag="h2" text="My coding workflow" splitType="chars" delay={25} className={`${display} mt-2 text-[clamp(2.2rem,6vw,4.5rem)] font-semibold tracking-tight`} />
        <p className="mt-2 text-neutral-600">From the first sketch to shipped code. Three tools, one flow.</p>

        <div data-flow className="mt-14 grid items-start gap-10 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4">
          {workflow.map((w, i) => (
            <Fragment key={w.tool}>
              {i > 0 && (
                <div data-arrow className="hidden h-[240px] items-center md:flex">
                  <svg viewBox="0 0 80 16" className="w-16 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 8h72" strokeDasharray="2 7" />
                    <path d="M68 2l8 6-8 6" />
                  </svg>
                </div>
              )}
              <div data-step className="flex flex-col items-center">
                <TiltedCard
                  imageSrc={w.image}
                  altText={w.tool}
                  captionText={w.tool}
                  containerWidth={240}
                  containerHeight={240}
                  imageWidth={240}
                  imageHeight={240}
                  radius={44}
                  rotateAmplitude={14}
                  scaleOnHover={1.08}
                  glare={w.bare ? 0 : 0.35}
                  shadow={w.bare ? 0 : 0.5}
                  showTooltip
                  floating
                />
                <span className="glass mt-7 rounded-full px-3 py-1 text-[12px] font-semibold tabular-nums text-neutral-600">
                  {w.step} · {w.phase}
                </span>
                <h3 className={`${display} mt-3 text-2xl font-semibold`}>{w.tool}</h3>
                <p className="mt-2 max-w-[280px] text-[15px] leading-relaxed text-neutral-600">{w.desc}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============ CONTACT (folder footer) ============ */
const FOLDER_TOP = '#5a9dff'

function Slope({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 96 72" className={`-mx-px h-full w-24 shrink-0 ${flip ? '-scale-x-100' : ''}`} preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 0C30 0 38 12 48 36C58 60 66 72 96 72H0Z" fill={FOLDER_TOP} />
    </svg>
  )
}

export function Contact() {
  const root = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      gsap.from(q('[data-paper]'), {
        yPercent: 60, duration: 1, ease: 'back.out(1.6)', stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
      gsap.from(q('[data-foot]'), {
        y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: root.current, start: 'top 55%' },
      })
    },
    { scope: root },
  )
  const links = [{ label: 'Say hello', href: `mailto:${profile.email}` }, ...profile.links]
  return (
    <section id="contact" ref={root} className="relative px-2 pb-2 pt-28 sm:px-4 sm:pb-4">
      {/* papers peeking out of the folder */}
      <div className="pointer-events-none absolute inset-x-0 top-28 mx-auto h-24 w-[46%]" aria-hidden="true">
        <div data-paper className="absolute inset-x-[6%] -top-12 h-40 -rotate-2 rounded-xl bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,.3)]" />
        <div data-paper className="absolute inset-x-[12%] -top-8 h-40 rotate-1 rounded-xl bg-[#f2f2f4] shadow-[0_10px_30px_-12px_rgba(0,0,0,.3)]" />
      </div>

      <div className="relative drop-shadow-[0_-8px_30px_rgba(30,90,200,.18)]">
        {/* folder top edge: two raised tabs with a dip in the middle */}
        <div className="flex h-[72px] items-end">
          <div className="h-full w-[14%] rounded-tl-[32px] sm:w-[20%]" style={{ background: FOLDER_TOP }} />
          <Slope />
          <div className="flex-1" />
          <Slope flip />
          <div className="h-full w-[14%] rounded-tr-[32px] sm:w-[20%]" style={{ background: FOLDER_TOP }} />
        </div>

        {/* folder body */}
        <div
          className="-mt-px rounded-b-[32px] px-6 pb-32 pt-16 text-center text-white shadow-[inset_0_-2px_0_rgba(0,0,0,.08)] sm:px-12"
          style={{ background: `linear-gradient(180deg, ${FOLDER_TOP} 0%, #3d8bff 55%, #2f78ee 100%)` }}
        >
          <SplitText tag="h2" text={profile.name.toLowerCase()} splitType="chars" delay={25} className={`${display} text-[clamp(2.6rem,9vw,7rem)] font-semibold leading-none tracking-tight`} />
          <p data-foot className={`${display} mt-2 text-[clamp(1.1rem,2.4vw,1.9rem)] font-medium text-white/90`}>software engineer</p>

          <div data-foot className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[17px] font-semibold">
            {links.map((l, i) => (
              <Fragment key={l.label}>
                {i > 0 && <span className="size-1 rounded-full bg-white/50" />}
                <a
                  href={l.href}
                  target={i ? '_blank' : undefined}
                  rel="noreferrer"
                  className="relative after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-white after:transition-transform hover:after:scale-x-100"
                >
                  {l.label}
                </a>
              </Fragment>
            ))}
          </div>

          <div data-foot className="mt-20 flex flex-col items-center justify-between gap-4 text-[14px] text-white/75 sm:flex-row sm:items-end">
            <p>© 2026 {profile.name}. All rights reserved.</p>
            <p className="sm:text-right">
              Based in {profile.location}
              <br />
              Open to work & collaborations
              <br />
              Built with React, GSAP & Motion
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
