import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllBooks, getAllMovies } from '../data/bookshelf'
import type { BookshelfItem } from '../data/bookshelf'

function CoverCard({ item }: { item: BookshelfItem }) {
  const hasChildren = item.children && item.children.length > 0

  return (
    <Link
      to={hasChildren ? `/bookshelf/${item.id}` : `/bookshelf/${item.id}/detail`}
      className="block group"
    >
      {hasChildren ? (
        /* Stacked series — 3 covers slightly offset */
        <div className="relative h-48 w-36 mx-auto">
          {/* Back cover */}
          <div className={`absolute inset-0 w-36 h-48 rounded-lg bg-gradient-to-br ${item.color} shadow-lg rotate-[-8deg] origin-bottom-left opacity-60`} />
          {/* Middle cover */}
          <div className={`absolute inset-0 w-36 h-48 rounded-lg bg-gradient-to-br ${item.color} shadow-lg rotate-[4deg] origin-bottom-right opacity-80`} />
          {/* Front cover */}
          <div className={`absolute inset-0 w-36 h-48 rounded-lg bg-gradient-to-br ${item.color} shadow-xl flex flex-col items-center justify-center p-4 text-center`}>
            <span className="text-2xl mb-2">{item.type === 'book' ? '📖' : '🎬'}</span>
            <span className="text-white font-bold text-sm leading-tight drop-shadow-md">{item.title}</span>
            <span className="text-white/70 text-[10px] mt-1 drop-shadow-md">{item.children!.length} 部</span>
          </div>
        </div>
      ) : (
        /* Single cover */
        <div className="w-36 h-48 mx-auto">
          {item.cover ? (
            <img
              src={`/blog/covers/${item.cover}`}
              alt={item.title}
              className="w-36 h-48 rounded-lg object-cover shadow-lg group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300"
              loading="lazy"
            />
          ) : (
            <div className={`w-36 h-48 rounded-lg bg-gradient-to-br ${item.color} shadow-lg group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center`}>
              <span className="text-2xl mb-2">{item.type === 'book' ? '📖' : '🎬'}</span>
              <span className="text-white font-bold text-sm leading-tight drop-shadow-md whitespace-pre-line">{item.title}</span>
            </div>
          )}
        </div>
      )}

      {/* Title and subtitle below the cover */}
      <div className="text-center mt-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-amber-400" />
          在读 / 读过
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((item) => (
            <CoverCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Movies */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-rose-400" />
          在看 / 看过
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((item) => (
            <CoverCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  )
}
