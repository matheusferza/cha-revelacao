import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminPage } from './pages/AdminPage'
import { BabyStoryPage } from './pages/BabyStoryPage'
import { MemoriesPage } from './pages/MemoriesPage'
import { MomentsPage } from './pages/MomentsPage'
import { MessagesPage } from './pages/MessagesPage'
import { RevealPage } from './pages/RevealPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RevealPage />} />
      <Route path="/historia" element={<BabyStoryPage />} />
      <Route path="/momentos" element={<MomentsPage />} />
      <Route path="/recados" element={<MessagesPage />} />
      <Route path="/memorias" element={<MemoriesPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
