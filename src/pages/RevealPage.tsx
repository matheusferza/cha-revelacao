import { RevealStage } from '../components/RevealStage'
import { useCountdown } from '../hooks/useCountdown'
import { useRevealSettings } from '../hooks/useRevealSettings'

export function RevealPage() {
  const { settings, loading } = useRevealSettings()
  const countdown = useCountdown(settings.revealDate, settings.countdownEnabled)
  const isRevealed = settings.revealed || countdown.isComplete

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#08091b] text-white">
        <div className="h-14 w-14 animate-spin rounded-full border border-white/20 border-t-white" />
      </main>
    )
  }

  return (
    <RevealStage
      settings={settings}
      countdownLabel={countdown.label}
      isFinalRush={countdown.isFinalRush}
      isRevealed={isRevealed}
    />
  )
}
