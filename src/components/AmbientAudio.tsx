import { useEffect, useMemo, useRef } from 'react'

type AmbientAudioProps = {
  enabled: boolean
  revealed: boolean
  intense: boolean
}

export function AmbientAudio({ enabled, revealed, intense }: AmbientAudioProps) {
  const contextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])

  const frequencies = useMemo(() => {
    if (revealed) return [261.63, 329.63, 392, 523.25]
    if (intense) return [98, 146.83, 220]
    return [130.81, 196, 261.63]
  }, [intense, revealed])

  useEffect(() => {
    if (!enabled) {
      oscillatorsRef.current.forEach((oscillator) => oscillator.stop())
      oscillatorsRef.current = []
      return
    }

    const startAudio = () => {
      const context = contextRef.current ?? new AudioContext()
      contextRef.current = context
      oscillatorsRef.current.forEach((oscillator) => oscillator.stop())

      const master = context.createGain()
      master.gain.value = revealed ? 0.04 : 0.025
      master.connect(context.destination)

      oscillatorsRef.current = frequencies.map((frequency, index) => {
        const oscillator = context.createOscillator()
        const gain = context.createGain()
        oscillator.type = index === 0 ? 'sine' : 'triangle'
        oscillator.frequency.value = frequency
        gain.gain.value = 0.12 / (index + 1)
        oscillator.connect(gain)
        gain.connect(master)
        oscillator.start()
        return oscillator
      })
    }

    window.addEventListener('pointerdown', startAudio, { once: true })
    return () => window.removeEventListener('pointerdown', startAudio)
  }, [enabled, frequencies, revealed])

  return null
}
