import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getItemById } from '../data/bookshelf'
import BookReviews from '../components/BookReviews'

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

  // Series collection view
  if (hasChildren) {
    return (
      <div>
        <Link to="/bookshelf" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
          &larr; 返回清单
        </Link>

        <header className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">{item.type === 'book' ? '📖' : '🎬'}</span>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">{item.title}</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
        </header>

        {/* Series overview — if parent has content, show it */}
        {item.content && (
          <div className="prose dark:prose-invert max-w-none mb-10 glass-card rounded-2xl p-6 md:p-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.content}
            </ReactMarkdown>
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {item.type === 'book' ? '系列书目' : '系列作品'}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {item.children!.map((child) => (
            <Link
              key={child.id}
              to={`/bookshelf/${child.id}/detail`}
              className="block group"
            >
              <div className={`w-36 h-48 rounded-lg bg-gradient-to-br ${child.color} shadow-lg group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center mx-auto`}>
                <span className="text-2xl mb-2">{child.type === 'book' ? '📖' : '🎬'}</span>
                <span className="text-white font-bold text-sm leading-tight drop-shadow-md whitespace-pre-line">{child.title}</span>
              </div>
              <div className="text-center mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">{child.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>

        <BookReviews itemId={item.id} />
      </div>
    )
  }

  // Single item detail with markdown content
  return (
    <div>
      <Link to="/bookshelf" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
        &larr; 返回清单
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">{item.type === 'book' ? '📖' : '🎬'}</span>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">{item.title}</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.subtitle}</p>
      </header>

      {item.content ? (
        <div className="prose dark:prose-invert max-w-none glass-card rounded-2xl p-6 md:p-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {item.content}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-gray-500 dark:text-gray-400">观后感 / 读后感尚未写完</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">内容稍后更新，敬请期待</p>
        </div>
      )}

      <BookReviews itemId={item.id} />
    </div>
  )
}
