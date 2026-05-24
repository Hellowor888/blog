import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  darkToggle: React.ReactNode
}

export default function Header({ darkToggle }: HeaderProps) {
  const { pathname } = useLocation()

  const linkClass = (path: string) =>
    `transition-all duration-300 px-3 py-1.5 rounded-lg text-sm font-medium ${
      pathname === path
        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50'
    }`

  return (
    <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 dark:bg-gray-950/70 border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight">
          <span className="gradient-text">rising from the east</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/" className={linkClass('/')}>首页</Link>
          <Link to="/guestbook" className={linkClass('/guestbook')}>给我留言</Link>
          <Link to="/about" className={linkClass('/about')}>关于我</Link>
          <span className="ml-2">{darkToggle}</span>
        </nav>
      </div>
    </header>
  )
}
