import type { RevealSettings } from '../types/reveal'

export const defaultRevealSettings: RevealSettings = {
  gender: 'girl',
  babyName: 'Aurora',
  storyTitle: 'Nossa pequena grande espera',
  storyIntro:
    'Criamos este cantinho para que quem está longe possa acompanhar cada descoberta, cada cuidado e cada pedacinho da história que já começou antes mesmo do primeiro colo.',
  currentWeek: '20 semanas',
  nextMilestone: 'Próxima ultrassom e novos registros para a família',
  familyMessage:
    'Mesmo de longe, cada mensagem, ligação e pensamento bonito faz parte dessa chegada. Este espaço existe para encurtar a distância.',
  revealDate: new Date(Date.now() + 1000 * 60 * 3).toISOString(),
  countdownEnabled: true,
  revealed: false,
  musicEnabled: true,
  theme: 'aurora',
  finaleAnimation: 'confetti',
  effectIntensity: 'cinematic',
}
