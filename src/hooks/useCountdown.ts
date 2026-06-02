import { useEffect, useMemo, useState } from 'react'

export function useCountdown(targetIso: string, enabled: boolean) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(interval)
  }, [])

  return useMemo(() => {
    const target = new Date(targetIso).getTime()
    const remaining = enabled ? Math.max(0, target - now) : Math.max(0, target - now)
    const totalSeconds = Math.ceil(remaining / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return {
      minutes,
      seconds,
      totalSeconds,
      remaining,
      isFinalRush: enabled && totalSeconds <= 10,
      isComplete: totalSeconds <= 0,
      label: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    }
  }, [enabled, now, targetIso])
}
