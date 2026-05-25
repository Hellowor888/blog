import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllBooks, getAllMovies } from '../data/bookshelf'
import type { BookshelfItem } from '../data/bookshelf'

function ItemCard({ item }: { item: BookshelfItem }) {
  const hasChildren = item.children && item.children.length > 0

  return (
    <Link
      to={hasChildren ? `/bookshelf/${item.id}` : `/bookshelf/${item.id}/detail`}
      className="glass-card glass-card-hover rounded-xl px-5 py-4 flex items-center gap-4"
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
        item.type === 'book'
          ? 'bg-amber-100/80 dark:bg-amber-900/30'
          : 'bg-rose-100/80 dark:bg-rose-900/30'
      }`}>
        {item.type === 'book' ? '📖' : '🎬'}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">{item.title}</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.subtitle}</p>
      </div>

      <div className="shrink-0 text-gray-300 dark:text-gray-600">
        {hasChildren ? (
          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400">
            {item.children!.length} 部
          </span>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </Link>
  )
}

export default function BookshelfPage() {
  const [books] = useState(() => getAllBooks())
  const [movies] = useState(() => getAllMovies())

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-8 gradient-text">读书 & 观影</h1>

      {/* Books */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-amber-400" />
          在读 / 读过
        </h2>
        <div className="grid gap-3">
          {books.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Movies */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-rose-400" />
          在看 / 看过
        </h2>
        <div className="grid gap-3">
          {movies.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  )
}
