import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { defaultRevealSettings } from '../lib/defaults'
import { db, isFirebaseConfigured } from '../lib/firebase'
import type { RevealSettings } from '../types/reveal'

const SETTINGS_KEY = 'reveal_settings_demo'
const DOC_PATH = ['reveal_settings', 'main'] as const

function normalizeSettings(settings: RevealSettings): RevealSettings {
  return {
    ...settings,
    storyTitle: settings.storyTitle.replace('está longa', 'está longe'),
  }
}

function readDemoSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY)
  const settings = saved ? ({ ...defaultRevealSettings, ...JSON.parse(saved) } as RevealSettings) : defaultRevealSettings
  return normalizeSettings(settings)
}

export function useRevealSettings() {
  const [settings, setSettings] = useState<RevealSettings>(() =>
    isFirebaseConfigured && db ? defaultRevealSettings : readDemoSettings(),
  )
  const [loading, setLoading] = useState(() => Boolean(isFirebaseConfigured && db))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      return
    }

    const ref = doc(db, ...DOC_PATH)
    return onSnapshot(
      ref,
      async (snapshot) => {
        if (!snapshot.exists()) {
          await setDoc(ref, { ...defaultRevealSettings, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
          return
        }

        setSettings(normalizeSettings({ ...defaultRevealSettings, ...snapshot.data() } as RevealSettings))
        setLoading(false)
      },
      (snapshotError) => {
        setError(snapshotError.message)
        setLoading(false)
      },
    )
  }, [])

  const updateSettings = useCallback(async (patch: Partial<RevealSettings>) => {
    if (!isFirebaseConfigured || !db) {
      const next = normalizeSettings({ ...readDemoSettings(), ...patch, updatedAt: new Date().toISOString() })
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
      setSettings(next)
      return
    }

    await setDoc(doc(db, ...DOC_PATH), { ...patch, updatedAt: serverTimestamp() }, { merge: true })
  }, [])

  return useMemo(
    () => ({ settings, loading, error, updateSettings, isDemo: !isFirebaseConfigured }),
    [error, loading, settings, updateSettings],
  )
}
