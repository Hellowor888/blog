import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPostBySlug } from '../utils/posts'
import type { Post as PostType } from '../types'

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<PostType | null>(null)

  useEffect(() => {
    if (slug) {
      getPostBySlug(slug).then(setPost)
    }
  }, [slug])

  if (!post) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-4">404</p>
        <p>文章未找到</p>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block">
          返回首页
        </Link>
      </div>
    )
  }

  return (
    <article>
      <header className="mb-8">
        <Link to="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          &larr; 返回首页
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-3 gradient-text">{post.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{post.date}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-img:rounded-xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
