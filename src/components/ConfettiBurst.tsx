import { motion } from 'framer-motion'

type ConfettiBurstProps = {
  gender: 'boy' | 'girl'
}

const pieces = Array.from({ length: 120 }, (_, index) => ({
  id: index,
  left: 35 + ((index * 19) % 30),
  rotate: (index * 47) % 360,
  x: ((index % 2 ? 1 : -1) * (80 + ((index * 23) % 520))),
  y: 180 + ((index * 31) % 520),
  delay: (index % 20) * 0.025,
}))

export function ConfettiBurst({ gender }: ConfettiBurstProps) {
  const colors =
    gender === 'boy'
      ? ['#e0f2fe', '#7dd3fc', '#38bdf8', '#2563eb', '#ffffff']
      : ['#fce7f3', '#f9a8d4', '#f472b6', '#db2777', '#ffffff']

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-1/2 h-4 w-2 rounded-[2px]"
          style={{
            left: `${piece.left}%`,
            background: colors[piece.id % colors.length],
            boxShadow: `0 0 16px ${colors[piece.id % colors.length]}`,
          }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: piece.rotate, scale: 0.4 }}
          animate={{ opacity: [0, 1, 1, 0], x: piece.x, y: piece.y, rotate: piece.rotate + 720, scale: [0.4, 1.3, 0.9] }}
          transition={{ duration: 4.5, delay: piece.delay, repeat: Infinity, repeatDelay: 0.9, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
