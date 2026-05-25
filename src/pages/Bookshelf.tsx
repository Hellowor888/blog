import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllBooks, getAllMovies } from '../data/bookshelf'
import type { BookshelfItem } from '../data/bookshelf'

function SeriesStack({ item, expanded }: { item: BookshelfItem; expanded: boolean }) {
  const kids = item.children!

  return (
    <div className="relative w-36 h-48 mx-auto">
      {kids.map((kid, i) => (
        <div
          key={kid.id}
          className="absolute top-0 w-36 h-48 rounded-lg overflow-hidden shadow-md transition-all duration-300 ease-out"
          style={{
            left: expanded ? `${i * 37}px` : '0px',
            zIndex: kids.length - i,
            transitionDelay: expanded
              ? `${i * 50}ms`
              : `${(kids.length - 1 - i) * 30}ms`,
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
      ))}
    </div>
  )
}

function CoverCard({ item }: { item: BookshelfItem }) {
  const hasChildren = item.children && item.children.length > 0
  const [expanded, setExpanded] = useState(false)

  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren && isTouchDevice && !expanded) {
      e.preventDefault()
      setExpanded(true)
    }
  }

  const linkTo = hasChildren
    ? `/bookshelf/${item.id}`
    : `/bookshelf/${item.id}/detail`

  return (
    <Link
      to={linkTo}
      className="block group"
      onClick={handleClick}
      onMouseEnter={() => hasChildren && !isTouchDevice && setExpanded(true)}
      onMouseLeave={() => hasChildren && !isTouchDevice && setExpanded(false)}
    >
      {hasChildren ? (
        <SeriesStack item={item} expanded={expanded} />
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

      {/* Subtitle below the cover */}
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
