import { motion } from 'framer-motion'
import { MessageCircleHeart, Send } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { StoryLayout } from '../components/StoryLayout'
import { useSharedCollection } from '../hooks/useSharedCollection'
import { MESSAGE_STORAGE_KEY, type FamilyMessage } from '../lib/messages'

export function MessagesPage() {
  const { items: messages, upsertItem } = useSharedCollection<FamilyMessage>('family_messages', MESSAGE_STORAGE_KEY)
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')

  const sortedMessages = useMemo(
    () => [...messages].sort((first, second) => second.createdAt.localeCompare(first.createdAt)),
    [messages],
  )

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextMessage = {
      id: crypto.randomUUID(),
      author: author.trim() || 'Família',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }

    if (!nextMessage.text) return

    await upsertItem(nextMessage)
    setAuthor('')
    setText('')
  }

  return (
    <StoryLayout
      eyebrow="Recados"
      title="Um lugar para fortalecer nossos laços"
      intro="Família e amigos podem deixar palavras de carinho, força e presença. Um mural simples para guardar o amor de quem caminha junto."
    >
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.form className="panel" onSubmit={handleSubmit} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-5 flex items-center gap-3">
            <div className="feature-icon">
              <MessageCircleHeart size={24} />
            </div>
            <div>
              <p className="eyebrow">Deixe seu carinho</p>
              <h2 className="text-2xl font-black">Recado para o bebê</h2>
            </div>
          </div>
          <label className="field mb-4 block">
            <span>Seu nome</span>
            <input className="input" value={author} onChange={(event) => setAuthor(event.target.value)} placeholder="Vovó, titia, amigo..." />
          </label>
          <label className="field mb-5 block">
            <span>Mensagem</span>
            <textarea className="input min-h-40 resize-y" value={text} onChange={(event) => setText(event.target.value)} placeholder="Escreva um recado para guardar esse momento..." />
          </label>
          <button className="button-primary w-full" type="submit">
            <Send size={18} /> Enviar recado
          </button>
        </motion.form>

        <div className="grid gap-4">
          {sortedMessages.length === 0 ? (
            <article className="empty-state">Nenhum recado ainda. O primeiro carinho pode nascer aqui.</article>
          ) : (
            sortedMessages.map((message, index) => (
              <motion.article
                className="message-card"
                key={message.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <p>{message.text}</p>
                <strong>{message.author}</strong>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </StoryLayout>
  )
}
