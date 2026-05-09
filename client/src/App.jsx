import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminAuth from './components/AdminAuth'
import Home from './pages/Home'
import Chat from './pages/Chat'
import NotificationForm from './pages/NotificationForm'
import ChatLogs from './pages/ChatLogs'
import NotificationLogs from './pages/NotificationLogs'
import UserManagement from './pages/UserManagement'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Announcements from './pages/Announcements'
import Feedback from './pages/Feedback'
import AdminFeedback from './pages/AdminFeedback'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin/notify" element={<AdminAuth><NotificationForm /></AdminAuth>} />
        <Route path="/admin/chat-logs" element={<AdminAuth><ChatLogs /></AdminAuth>} />
        <Route path="/admin/notification-logs" element={<AdminAuth><NotificationLogs /></AdminAuth>} />
        <Route path="/admin/users" element={<AdminAuth><UserManagement /></AdminAuth>} />
        <Route path="/admin/feedback" element={<AdminAuth><AdminFeedback /></AdminAuth>} />
      </Routes>
    </>
  )
}

export default App