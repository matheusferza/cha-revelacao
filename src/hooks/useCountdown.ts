import { useEffect, useMemo, useState } from 'react'

export function useCountdown(targetIso: string, enabled: boolean) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(interval)
  }, [])

  return useMemo(() => {
    const target = new Date(targetIso).getTime()
    const remaining = Math.max(0, target - now)
    const totalSeconds = Math.ceil(remaining / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      remaining,
      isFinalRush: enabled && totalSeconds <= 10,
      isComplete: totalSeconds <= 0,
      label: `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    }
  }, [enabled, now, targetIso])
}
