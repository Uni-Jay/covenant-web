import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Sermons from './pages/Sermons'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Donate from './pages/Donate'
import PrayerRequest from './pages/PrayerRequest'
import Ministries from './pages/Ministries'
import BibleStudy from './pages/BibleStudy'
import LiveStream from './pages/LiveStream'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
// import Register from './pages/Register'
import AdminLayout from './components/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminSermons from './pages/Admin/Sermons'
import AdminEvents from './pages/Admin/Events'
import AdminBibleStudy from './pages/Admin/BibleStudy'
import AdminGallery from './pages/Admin/Gallery'
import AdminBlog from './pages/Admin/Blog'
import AdminMembers from './pages/Admin/Members'
import AdminPrayerRequests from './pages/Admin/PrayerRequests'
import AdminDonations from './pages/Admin/Donations'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="sermons" element={<Sermons />} />
        <Route path="events" element={<Events />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contact" element={<Contact />} />
        <Route path="donate" element={<Donate />} />
        <Route path="prayer-request" element={<PrayerRequest />} />
        <Route path="ministries" element={<Ministries />} />
        <Route path="bible-study" element={<BibleStudy />} />
        <Route path="live" element={<LiveStream />} />
      </Route>

      {/* Admin Login Route */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes - Protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="sermons" element={<AdminSermons />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="bible-study" element={<AdminBibleStudy />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="members" element={<AdminMembers />} />
        <Route path="prayer-requests" element={<AdminPrayerRequests />} />
        <Route path="donations" element={<AdminDonations />} />
      </Route>
      </Routes>
    </>
  )
}

export default App
