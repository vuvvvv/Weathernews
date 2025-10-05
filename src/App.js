import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthPage from './authpage'
import HomePage from './homepage'
import NewsPage from './newspage'
import ProtectedRoute from './ProtectedRoute'

export default function App() {
  return (
    <Router>
      <Routes>
 
        <Route path="/" element={<HomePage />} />


        <Route path="/login" element={<AuthPage />} />


        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <NewsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
