import { useParams, Link } from 'react-router-dom'
import { getItemById } from '../data/bookshelf'

export default function BookshelfDetail() {
  const { id } = useParams<{ id: string }>()
  const item = id ? getItemById(id) : null

  if (!item) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4 text-gray-300 dark:text-gray-700">404</p>
        <p className="text-gray-500">未找到</p>
        <Link to="/bookshelf" className="text-blue-500 hover:underline mt-2 inline-block">返回清单</Link>
      </div>
    )
  }

  const hasChildren = item.children && item.children.length > 0

  if (hasChildren) {
    return (
      <div>
        <Link to="/bookshelf" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
          &larr; 返回清单
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{item.type === 'book' ? '📖' : '🎬'}</span>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">{item.title}</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
        </header>

        <div className="grid gap-3">
          {item.children!.map((child) => (
            <Link
              key={child.id}
              to={`/bookshelf/${child.id}/detail`}
              className="glass-card glass-card-hover rounded-xl px-5 py-4 flex items-center gap-4"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                child.type === 'book'
                  ? 'bg-amber-100/80 dark:bg-amber-900/30'
                  : 'bg-rose-100/80 dark:bg-rose-900/30'
              }`}>
                {child.type === 'book' ? '📖' : '🎬'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{child.title}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{child.subtitle}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // Single item detail (placeholder)
  return (
    <div>
      <Link to="/bookshelf" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
        &larr; 返回清单
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{item.type === 'book' ? '📖' : '🎬'}</span>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">{item.title}</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
      </header>

      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-4xl mb-4">📝</p>
        <p className="text-gray-500 dark:text-gray-400">观后感 / 读后感尚未写完</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">内容稍后更新，敬请期待</p>
      </div>
    </div>
  )
}
