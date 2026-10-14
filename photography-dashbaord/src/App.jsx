import { Navigate, Route, Routes } from 'react-router-dom'
import PhotographerDashboard from './PhotographerDashboard.jsx'
import ProjectDetailsPage from './ProjectDetailsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PhotographerDashboard />} />
      <Route path="/dashboard" element={<PhotographerDashboard />} />
      <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
