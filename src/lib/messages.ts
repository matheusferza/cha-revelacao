export type FamilyMessage = {
  id: string
  author: string
  text: string
  createdAt: string
}

export const MESSAGE_STORAGE_KEY = 'baby_family_messages'

export function readMessages() {
  const saved = localStorage.getItem(MESSAGE_STORAGE_KEY)
  return saved ? (JSON.parse(saved) as FamilyMessage[]) : []
}

export function saveMessages(messages: FamilyMessage[]) {
  localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages))
}
