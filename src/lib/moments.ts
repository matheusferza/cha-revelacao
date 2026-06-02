export type MomentIcon = 'ultrasound' | 'sparkles' | 'baby' | 'heart'

export type MomentItem = {
  id: string
  icon: MomentIcon
  title: string
  text: string
}

export const MOMENTS_STORAGE_KEY = 'baby_moments'

export const starterMoments: MomentItem[] = [
  {
    id: 'ultrasounds',
    icon: 'ultrasound',
    title: 'Ultrassons',
    text: 'Aqui reunimos os exames, batimentos, imagens e pequenos sinais que transformam espera em presença.',
  },
  {
    id: 'discoveries',
    icon: 'sparkles',
    title: 'Descobertas',
    text: 'Cada novidade ganha espaço: sintomas, primeiras compras, palpites, nomes, planos e tudo que faz a casa mudar de ritmo.',
  },
  {
    id: 'fatherhood',
    icon: 'baby',
    title: 'Caminhada até a paternidade',
    text: 'Um registro carinhoso da nossa preparação emocional, dos medos bonitos e da vontade enorme de fazer tudo dar certo.',
  },
  {
    id: 'now',
    icon: 'heart',
    title: 'Agora',
    text: 'Atualizações para quem quer acompanhar de perto, mesmo quando a distância não permite estar fisicamente junto.',
  },
]

export function readMoments() {
  const saved = localStorage.getItem(MOMENTS_STORAGE_KEY)
  return saved ? (JSON.parse(saved) as MomentItem[]) : starterMoments
}

export function saveMoments(moments: MomentItem[]) {
  localStorage.setItem(MOMENTS_STORAGE_KEY, JSON.stringify(moments))
}
