export type StoryPage = {
  id: string
  title: string
  subtitle: string
  body: string
  createdAt: string
}

export const STORY_PAGES_STORAGE_KEY = 'baby_story_pages'

export const starterStoryPages: StoryPage[] = [
  {
    id: 'story-1',
    title: 'O começo de tudo',
    subtitle: 'Quando a notícia chegou',
    body:
      'A notícia chegou como luz entrando pela janela: baixinha, bonita, mudando o clima da casa inteira. Desde esse primeiro instante, tudo começou a ganhar outro sentido.',
    createdAt: '2026-01-01T12:00:00.000Z',
  },
  {
    id: 'story-2',
    title: 'Primeiros cuidados',
    subtitle: 'Entre exames, planos e sonhos',
    body:
      'Consultas, exames, conversas longas e aquela mistura de ansiedade boa com amor crescendo todo dia. Cada detalhe virou parte de uma caminhada que queremos guardar.',
    createdAt: '2026-01-08T12:00:00.000Z',
  },
  {
    id: 'story-3',
    title: 'Perto mesmo de longe',
    subtitle: 'Um espaço para encurtar distâncias',
    body:
      'Cada pessoa querida pode acompanhar daqui os próximos capítulos, como se estivesse sentada na sala junto com a família, participando de cada pequena descoberta.',
    createdAt: '2026-01-15T12:00:00.000Z',
  },
]

export function readStoryPages() {
  const saved = localStorage.getItem(STORY_PAGES_STORAGE_KEY)
  return saved ? (JSON.parse(saved) as StoryPage[]) : starterStoryPages
}

export function saveStoryPages(pages: StoryPage[]) {
  localStorage.setItem(STORY_PAGES_STORAGE_KEY, JSON.stringify(pages))
}
