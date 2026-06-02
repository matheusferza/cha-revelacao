import { Home, Maximize2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ParticleField } from './ParticleField'
import { PublicNav } from './PublicNav'
import { useRevealSettings } from '../hooks/useRevealSettings'

type StoryLayoutProps = {
  eyebrow: string
  title: string
  intro: string
  children: ReactNode
}

function requestFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    return
  }

  document.exitFullscreen()
}

export function StoryLayout({ eyebrow, title, intro, children }: StoryLayoutProps) {
  const { settings } = useRevealSettings()

  return (
    <main className="relative min-h-screen overflow-hidden bg-story text-white">
      <ParticleField revealed={false} gender={settings.gender} intense={false} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,22,0.08),rgba(7,8,22,0.82)_56%,rgba(7,8,22,0.98))]" />

      <header className="public-header relative z-10 mx-auto max-w-7xl px-5 py-5 sm:px-8">
        <div className="public-header-actions">
          <Link className="button-ghost" to="/">
            <Home size={18} /> Revelação
          </Link>
        </div>
        <PublicNav />
        <button className="button-ghost" type="button" onClick={requestFullscreen}>
          <Maximize2 size={18} /> Tela cheia
        </button>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-5 max-w-5xl text-[clamp(2.8rem,7vw,6.8rem)] font-black leading-[0.95]">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72 sm:text-xl">{intro}</p>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 sm:px-8">{children}</section>
    </main>
  )
}
