import { Link } from 'react-router-dom'
import type { Post } from '../types'

interface PostCardProps {
  post: Post
  selectedTags: string[]
  onTagClick: (tag: string) => void
}

export default function PostCard({ post, selectedTags, onTagClick }: PostCardProps) {
  return (
    <article className="glass-card glass-card-hover p-4 md:p-6 rounded-2xl">
      <Link to={`/post/${post.slug}`} className="block group">
        <h2 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {post.title}
        </h2>
      </Link>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">{post.date}</p>
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{post.excerpt}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className={`text-xs px-2.5 py-1 rounded-full transition-all duration-300 ${
              selectedTags.includes(tag)
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </article>
  )
}
