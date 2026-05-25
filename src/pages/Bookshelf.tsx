import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllBooks, getAllMovies } from '../data/bookshelf'
import type { BookshelfItem } from '../data/bookshelf'

function SeriesStack({ item }: { item: BookshelfItem }) {
  const kids = item.children!.slice(0, 3)

  return (
    <div className="relative w-36 h-48 mx-auto">
      {/* Render back to front so earlier covers peek out behind */}
      {kids.map((kid, i) => {
        const n = kids.length
        const pos = n - 1 - i // 0 = front, 1 = middle, 2 = back
        const tx = pos * 4   // 0, 4, 8 px right
        const ty = -(pos * 5) // 0, -5, -10 px up
        return (
          <div
            key={kid.id}
            className="absolute top-0 left-0 w-36 h-48 rounded-lg overflow-hidden shadow-md"
            style={{
              transform: `translate(${tx}px, ${ty}px)`,
              zIndex: 10 - pos,
            }}
          >
            {kid.cover ? (
              <img
                src={`/blog/covers/${kid.cover}`}
                alt={kid.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${kid.color} flex flex-col items-center justify-center p-3 text-center`}>
                <span className="text-lg mb-1">{kid.type === 'book' ? '📖' : '🎬'}</span>
                <span className="text-white font-bold text-[10px] leading-tight drop-shadow-md whitespace-pre-line">{kid.title}</span>
              </div>
            )}
          </div>
        )
      })}
      {/* Series name badge */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-800/90 backdrop-blur px-2.5 py-0.5 rounded-full shadow border border-gray-200 dark:border-gray-700 z-20">
        <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
          {item.title}
        </span>
      </div>
    </div>
  )
}

function CoverCard({ item }: { item: BookshelfItem }) {
  const hasChildren = item.children && item.children.length > 0

  return (
    <Link
      to={hasChildren ? `/bookshelf/${item.id}` : `/bookshelf/${item.id}/detail`}
      className="block group"
    >
      {hasChildren ? (
        <SeriesStack item={item} />
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
