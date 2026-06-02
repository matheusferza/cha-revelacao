import { motion } from 'framer-motion'
import clsx from 'clsx'

type ParticleFieldProps = {
  revealed?: boolean
  gender?: 'boy' | 'girl'
  intense?: boolean
}

const particles = Array.from({ length: 72 }, (_, index) => ({
  id: index,
  size: 2 + (index % 7),
  left: (index * 37) % 100,
  top: (index * 53) % 100,
  duration: 5 + (index % 9),
  delay: (index % 11) * 0.16,
}))

export function ParticleField({ revealed = false, gender = 'girl', intense = false }: ParticleFieldProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={clsx(
            'absolute rounded-full blur-[0.5px]',
            revealed && gender === 'boy' && 'bg-sky-200 shadow-[0_0_18px_rgba(56,189,248,0.95)]',
            revealed && gender === 'girl' && 'bg-pink-200 shadow-[0_0_18px_rgba(244,114,182,0.95)]',
            !revealed && 'bg-white/70 shadow-[0_0_16px_rgba(255,255,255,0.7)]',
          )}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: revealed ? [-80, -260, -80] : [-24, 24, -24],
            x: revealed ? [0, particle.id % 2 ? 140 : -140, 0] : [0, particle.id % 2 ? 18 : -18, 0],
            opacity: revealed ? [0.15, 1, 0.25] : [0.25, intense ? 0.9 : 0.55, 0.25],
            scale: revealed ? [1, 2.8, 1.2] : [1, intense ? 1.8 : 1.25, 1],
          }}
          transition={{
            duration: revealed ? 2.8 + (particle.id % 4) : particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
