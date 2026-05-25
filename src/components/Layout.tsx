import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import DarkToggle from './DarkToggle'
import BackToTop from './BackToTop'
import Search from './Search'

interface LayoutProps {
  dark: boolean
  onToggleDark: () => void
}

export default function Layout({ dark, onToggleDark }: LayoutProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen relative">
      <Header
        darkToggle={<DarkToggle dark={dark} onToggle={onToggleDark} />}
        onSearch={() => setSearchOpen(true)}
      />
      <main className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        <div className="animate-fade-in-up">
          <Outlet />
        </div>
      </main>
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-xs text-gray-400/60 dark:text-gray-600">
          Built with React + Vite + Tailwind CSS
        </p>
      </footer>
      <BackToTop />
      <Search open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
