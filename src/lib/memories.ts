export type Memory = {
  id: string
  title: string
  text: string
  image?: string
  createdAt: string
}

export const MEMORY_STORAGE_KEY = 'baby_memories_timeline'

export const starterMemories: Memory[] = [
  {
    id: 'starter-1',
    title: 'A descoberta',
    text: 'O dia em que tudo mudou e a palavra família ganhou um novo tamanho.',
    createdAt: '2026-01-01T12:00:00.000Z',
  },
  {
    id: 'starter-2',
    title: 'Primeiros planos',
    text: 'Começamos a imaginar quarto, colo, rotina, nomes e todos os pequenos detalhes da chegada.',
    createdAt: '2026-01-08T12:00:00.000Z',
  },
]

export function readMemories() {
  const saved = localStorage.getItem(MEMORY_STORAGE_KEY)
  return saved ? (JSON.parse(saved) as Memory[]) : starterMemories
}

export function saveMemories(memories: Memory[]) {
  localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories))
}
