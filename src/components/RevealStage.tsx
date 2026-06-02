import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { BookOpen, Maximize2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AmbientAudio } from './AmbientAudio'
import { ConfettiBurst } from './ConfettiBurst'
import { ParticleField } from './ParticleField'
import type { RevealSettings } from '../types/reveal'

type RevealStageProps = {
  settings: RevealSettings
  countdownLabel: string
  isFinalRush: boolean
  isRevealed: boolean
}

const themeClass = {
  aurora: 'from-[#090a24] via-[#311b65] to-[#071327]',
  starlight: 'from-[#050816] via-[#0d2446] to-[#2d102e]',
  velvet: 'from-[#160712] via-[#301333] to-[#101935]',
}

function requestFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    return
  }

  document.exitFullscreen()
}

export function RevealStage({ settings, countdownLabel, isFinalRush, isRevealed }: RevealStageProps) {
  const isBoy = settings.gender === 'boy'
  const revealTone = isBoy ? 'text-sky-100' : 'text-pink-100'
  const revealGlow = isBoy ? 'shadow-sky-400/50' : 'shadow-pink-400/50'
  const name = settings.babyName.trim()
  const welcome = name ? `${isBoy ? 'Bem-vindo' : 'Bem-vinda'}, ${name}` : ''

  return (
    <main
      className={clsx(
        'relative min-h-screen overflow-hidden bg-gradient-to-br text-white',
        themeClass[settings.theme],
        isFinalRush && !isRevealed && 'animate-suspense',
      )}
    >
      <AmbientAudio enabled={settings.musicEnabled} intense={isFinalRush} revealed={isRevealed} />
      <div className="absolute right-4 top-4 z-40 flex gap-2 sm:right-6 sm:top-6">
        <Link className="stage-tool" to="/historia" title="História do bebê">
          <BookOpen size={18} />
          <span className="hidden sm:inline">História</span>
        </Link>
        <button className="stage-tool" type="button" onClick={requestFullscreen} title="Modo tela cheia">
          <Maximize2 size={18} />
          <span className="hidden sm:inline">Tela cheia</span>
        </button>
      </div>
      <div
        className={clsx(
          'absolute inset-0 transition duration-1000',
          isRevealed && isBoy && 'bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.78),rgba(14,116,144,0.28)_34%,rgba(5,7,22,0.9)_72%)]',
          isRevealed && !isBoy && 'bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.8),rgba(190,24,93,0.28)_34%,rgba(5,7,22,0.9)_72%)]',
        )}
      />
      <motion.div
        className="absolute -left-36 top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-sky-300/25 blur-3xl"
        animate={{ scale: [1, 1.18, 1], x: [0, 80, 0], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-40 bottom-[-14rem] h-[38rem] w-[38rem] rounded-full bg-pink-300/25 blur-3xl"
        animate={{ scale: [1.15, 1, 1.15], x: [0, -80, 0], opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.08)_42%,transparent_58%)] opacity-70 animate-light-sweep" />
      <ParticleField revealed={isRevealed} gender={settings.gender} intense={isFinalRush} />
      {isRevealed && <ConfettiBurst gender={settings.gender} />}

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="countdown"
              className="mx-auto flex max-w-6xl flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: isFinalRush ? 1.04 : 1 }}
              exit={{ opacity: 0, scale: 1.12, filter: 'blur(16px)' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.p
                className="mb-5 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 backdrop-blur-md sm:text-sm"
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: isFinalRush ? 0.8 : 3, repeat: Infinity }}
              >
                A descoberta está chegando...
              </motion.p>
              <motion.h1
                className={clsx(
                  'font-black leading-none text-white drop-shadow-[0_0_38px_rgba(255,255,255,0.65)]',
                  'text-[clamp(5rem,22vw,20rem)]',
                )}
                animate={{
                  scale: isFinalRush ? [1, 1.08, 1] : [1, 1.025, 1],
                  textShadow: isFinalRush
                    ? ['0 0 22px #fff', '0 0 80px #f9a8d4', '0 0 80px #7dd3fc']
                    : ['0 0 18px #fff', '0 0 42px rgba(255,255,255,0.7)', '0 0 18px #fff'],
                }}
                transition={{ duration: isFinalRush ? 0.55 : 2.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                {countdownLabel}
              </motion.h1>
              <p className="mt-8 max-w-3xl text-base text-white/72 sm:text-xl">
                {settings.countdownEnabled
                  ? 'Luzes suaves, corações acelerados e um segredo prestes a mudar tudo.'
                  : 'Cronômetro pronto no telão. Inicie pelo painel quando chegar a hora.'}
              </p>
              {isFinalRush && (
                <motion.div
                  className="mt-10 h-1 w-64 overflow-hidden rounded-full bg-white/15"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="h-full rounded-full bg-white shadow-[0_0_28px_rgba(255,255,255,0.9)]"
                    animate={{ x: ['-100%', '120%'] }}
                    transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="reveal"
              className="mx-auto flex max-w-7xl flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.38, rotateX: 30, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
              transition={{ type: 'spring', stiffness: 82, damping: 10, delay: 0.35 }}
            >
              <motion.div
                className={clsx('rounded-[2rem] border border-white/25 bg-white/10 px-8 py-8 backdrop-blur-xl sm:px-14 sm:py-10', revealGlow)}
                animate={{ boxShadow: ['0 0 45px rgba(255,255,255,0.3)', '0 0 130px rgba(255,255,255,0.85)', '0 0 45px rgba(255,255,255,0.3)'] }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                <motion.p className="text-sm font-bold uppercase tracking-[0.45em] text-white/70 sm:text-base">
                  O grande momento chegou
                </motion.p>
                <motion.h2
                  className={clsx('mt-4 font-black leading-[0.9] tracking-normal', 'text-[clamp(4rem,15vw,14rem)]', revealTone)}
                  animate={{ scale: [1, 1.035, 1], y: [0, -8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {isBoy ? 'É MENINO' : 'É MENINA'}
                </motion.h2>
                {welcome && (
                  <motion.p
                    className="mt-6 text-[clamp(1.8rem,5vw,5rem)] font-bold text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.7)]"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  >
                    {welcome} {isBoy ? '💙' : '💖'}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}
