import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, CalendarHeart, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { ParticleField } from '../components/ParticleField'
import { PublicNav } from '../components/PublicNav'
import { useRevealSettings } from '../hooks/useRevealSettings'
import { useSharedCollection } from '../hooks/useSharedCollection'
import { STORY_PAGES_STORAGE_KEY, starterStoryPages } from '../lib/storyPages'

function requestFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    return
  }

  document.exitFullscreen()
}

export function BabyStoryPage() {
  const { settings, loading } = useRevealSettings()
  const babyName = settings.babyName.trim() || 'nosso bebê'
  const { items: storedStoryPages } = useSharedCollection('story_pages', STORY_PAGES_STORAGE_KEY, starterStoryPages)
  const storyPages = useMemo(
    () => [...storedStoryPages].sort((firstPage, secondPage) => firstPage.createdAt.localeCompare(secondPage.createdAt)),
    [storedStoryPages],
  )
  const [pageIndex, setPageIndex] = useState(0)
  const visiblePageIndex = Math.min(pageIndex, Math.max(0, storyPages.length - 1))
  const currentPage = storyPages[visiblePageIndex]

  function previousPage() {
    setPageIndex(Math.max(0, visiblePageIndex - 1))
  }

  function nextPage() {
    setPageIndex(Math.min(storyPages.length - 1, visiblePageIndex + 1))
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#08091b] text-white">
        <div className="h-14 w-14 animate-spin rounded-full border border-white/20 border-t-white" />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-story text-white">
      <ParticleField revealed={false} gender={settings.gender} intense />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,22,0.05),rgba(7,8,22,0.72)_58%,rgba(7,8,22,0.96))]" />

      <header className="public-header relative z-10 mx-auto max-w-7xl px-5 py-5 sm:px-8">
        <div className="public-header-actions">
          <Link className="button-ghost" to="/">
            <ArrowLeft size={18} /> Revelação
          </Link>
        </div>
        <PublicNav />
        <button className="button-ghost" type="button" onClick={requestFullscreen}>
          <Maximize2 size={18} /> Tela cheia
        </button>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <motion.div className="story-book-intro" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <p className="eyebrow">História</p>
            <h1>Livro do bebê</h1>
          </div>
          <div className="story-book-chips">
            <span><Sparkles size={17} /> {babyName}</span>
            <span>{settings.currentWeek}</span>
            <span><CalendarHeart size={17} /> {settings.nextMilestone}</span>
          </div>
        </motion.div>

        <motion.div
          className="book-shell"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <div className="book-page book-cover-page">
            <p className="eyebrow">Livro do bebê</p>
            <h2>{settings.storyTitle}</h2>
            <p>{settings.storyIntro}</p>
            <div className="book-cover-meta">
              <span><BookOpen size={18} /> {storyPages.length} páginas</span>
              <span>{babyName}</span>
            </div>
          </div>

          <article className="book-page book-content-page">
            {currentPage ? (
              <>
                <span className="book-page-number">Página {String(visiblePageIndex + 1).padStart(2, '0')}</span>
                <h3>{currentPage.title}</h3>
                <strong>{currentPage.subtitle}</strong>
                <p>{currentPage.body}</p>
              </>
            ) : (
              <p>Nenhuma página publicada ainda.</p>
            )}
          </article>
        </motion.div>

        <div className="book-controls">
          <button className="button-ghost" disabled={visiblePageIndex === 0} onClick={previousPage}>
            <ChevronLeft size={18} /> Anterior
          </button>
          <div className="book-dots">
            {storyPages.map((page, index) => (
              <button
                aria-label={`Abrir página ${index + 1}`}
                className={clsx(index === visiblePageIndex && 'active')}
                key={page.id}
                onClick={() => setPageIndex(index)}
              />
            ))}
          </div>
          <button className="button-ghost" disabled={visiblePageIndex >= storyPages.length - 1} onClick={nextPage}>
            Próxima <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </main>
  )
}
