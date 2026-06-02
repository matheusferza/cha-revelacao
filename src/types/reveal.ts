export type Gender = 'boy' | 'girl'
export type VisualTheme = 'aurora' | 'starlight' | 'velvet'
export type FinaleAnimation = 'confetti' | 'fireworks' | 'slowMotion'
export type EffectIntensity = 'soft' | 'cinematic' | 'epic'

export type RevealSettings = {
  gender: Gender
  babyName: string
  storyTitle: string
  storyIntro: string
  currentWeek: string
  nextMilestone: string
  familyMessage: string
  revealDate: string
  countdownEnabled: boolean
  revealed: boolean
  musicEnabled: boolean
  theme: VisualTheme
  finaleAnimation: FinaleAnimation
  effectIntensity: EffectIntensity
  createdAt?: unknown
  updatedAt?: unknown
}
