import { motion } from 'framer-motion'
import { Baby, HeartPulse, ScanHeart, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { StoryLayout } from '../components/StoryLayout'
import { readMoments, type MomentIcon } from '../lib/moments'

const iconMap = {
  ultrasound: ScanHeart,
  sparkles: Sparkles,
  baby: Baby,
  heart: HeartPulse,
} satisfies Record<MomentIcon, typeof ScanHeart>

export function MomentsPage() {
  const [moments] = useState(() => readMoments())

  return (
    <StoryLayout
      eyebrow="Amor perto"
      title="Momentos que estamos passando"
      intro="Ultrassons, descobertas e a caminhada até a paternidade reunidos em um lugar só, para aproximar quem ama e está longe."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {moments.map((moment, index) => {
          const Icon = iconMap[moment.icon]
          return (
            <motion.article
              className="feature-card"
              key={moment.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="feature-icon">
                <Icon size={24} />
              </div>
              <h2>{moment.title}</h2>
              <p>{moment.text}</p>
            </motion.article>
          )
        })}
      </div>
    </StoryLayout>
  )
}
