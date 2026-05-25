import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  darkToggle: React.ReactNode
  onSearch: () => void
}

export default function Header({ darkToggle, onSearch }: HeaderProps) {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = (path: string) =>
    `transition-all duration-300 px-3 py-1.5 rounded-lg text-sm font-medium ${
      pathname === path
        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
    }`

  const mobileLinkClass = (path: string) =>
    `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
      pathname === path
        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50'
    }`

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          {/* Logo — geometric sunrise */}
          <svg className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Sun — upper semicircle */}
            <path d="M10 32 A14 14 0 0 1 38 32" fill="url(#logoGrad)" />
            {/* Horizon line */}
            <line x1="6" y1="32" x2="42" y2="32" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Subtle halo ring */}
            <circle cx="24" cy="23" r="3" fill="none" stroke="url(#logoGrad)" strokeWidth="2" opacity="0.6" />
          </svg>
          <span className="blog-title text-xl sm:text-2xl font-bold gradient-text">
            Rising From The East
          </span>
        </Link>

        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/" className={linkClass('/')}>首页</Link>
          <Link to="/guestbook" className={linkClass('/guestbook')}>给我留言</Link>
          <Link to="/about" className={linkClass('/about')}>关于我</Link>
          <button onClick={onSearch} className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300" title="搜索 (Ctrl+K)">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <span className="ml-1">{darkToggle}</span>
        </nav>

        {/* 移动端：搜索 + 暗色切换 + 汉堡按钮 */}
        <div className="flex items-center gap-1 md:hidden">
          <button onClick={onSearch} className="p-2 rounded-lg hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors" aria-label="搜索">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {darkToggle}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors"
            aria-label="菜单"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200/50 dark:border-gray-800/50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl px-4 py-3 space-y-1">
          <Link to="/" onClick={() => setMenuOpen(false)} className={mobileLinkClass('/')}>首页</Link>
          <Link to="/guestbook" onClick={() => setMenuOpen(false)} className={mobileLinkClass('/guestbook')}>给我留言</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className={mobileLinkClass('/about')}>关于我</Link>
        </nav>
      )}
    </header>
  )
}
