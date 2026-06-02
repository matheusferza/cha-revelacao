import { BookOpen, HeartHandshake, Image, MessageCircleHeart } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const publicLinks = [
  { to: '/historia', label: 'História', icon: BookOpen },
  { to: '/memorias', label: 'Memórias', icon: Image },
  { to: '/recados', label: 'Recados', icon: MessageCircleHeart },
  { to: '/momentos', label: 'Momentos', icon: HeartHandshake },
]

export function PublicNav() {
  return (
    <nav className="public-nav" aria-label="Navegação pública">
      {publicLinks.map((link) => {
        const Icon = link.icon
        return (
          <NavLink className={({ isActive }) => clsx(isActive && 'active')} key={link.to} to={link.to}>
            <Icon size={17} />
            <span>{link.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
