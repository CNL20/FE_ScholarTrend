import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AdminApiConfigPage from './pages/admin/AdminApiConfigPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage'
import BookmarksPage from './pages/BookmarksPage'
import DashboardPage from './pages/DashboardPage'
import FollowingPage from './pages/FollowingPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import NotificationsPage from './pages/NotificationsPage'
import PaperDetailPage from './pages/PaperDetailPage'
import RegisterPage from './pages/RegisterPage'
import SearchPage from './pages/SearchPage'
import SearchResultsPage from './pages/SearchResultsPage'
import TrendChartPage from './pages/TrendChartPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/papers/:paperId" element={<PaperDetailPage />} />
        <Route path="/trends" element={<TrendChartPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/following" element={<FollowingPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUserManagementPage />} />
        <Route path="/admin/api-config" element={<AdminApiConfigPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
