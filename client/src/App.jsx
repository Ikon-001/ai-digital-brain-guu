import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Chat from './pages/Chat'
import NotificationForm from './pages/NotificationForm'
import ChatLogs from './pages/ChatLogs'
import NotificationLogs from './pages/NotificationLogs'
import UserManagement from './pages/UserManagement'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin/notify" element={<NotificationForm />} />
        <Route path="/admin/chat-logs" element={<ChatLogs />} />
        <Route path="/admin/notification-logs" element={<NotificationLogs />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Routes>
    </>
  )
}

export default App