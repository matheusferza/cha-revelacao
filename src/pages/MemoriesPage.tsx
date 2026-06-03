import { motion } from 'framer-motion'
import { StoryLayout } from '../components/StoryLayout'
import { useSharedCollection } from '../hooks/useSharedCollection'
import { MEMORY_STORAGE_KEY, starterMemories } from '../lib/memories'

export function MemoriesPage() {
  const { items: memories } = useSharedCollection('memories', MEMORY_STORAGE_KEY, starterMemories)

  return (
    <StoryLayout
      eyebrow="Memórias"
      title="Linha do tempo da nossa história"
      intro="Um lugar para guardar fotos e textos desde a descoberta da gravidez até o nascimento, como um álbum vivo da chegada do bebê."
    >
      <div className="timeline-list timeline-list-wide">
        {memories.map((memory, index) => (
          <motion.article
            className="memory-card memory-card-view"
            key={memory.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            {memory.image && <img src={memory.image} alt={memory.title} />}
            <div>
              <span>{String(memories.length - index).padStart(2, '0')}</span>
              <h2>{memory.title}</h2>
              <p>{memory.text}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </StoryLayout>
  )
}
