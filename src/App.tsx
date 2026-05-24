import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useDarkMode } from './hooks/useDarkMode'
import Layout from './components/Layout'
import Home from './pages/Home'
import Post from './pages/Post'
import About from './pages/About'
import Guestbook from './pages/Guestbook'
import Collection from './pages/Collection'

export default function App() {
  const [dark, toggleDark] = useDarkMode()

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout dark={dark} onToggleDark={toggleDark} />}>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<Post />} />
          <Route path="/collection/:id" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/guestbook" element={<Guestbook />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
