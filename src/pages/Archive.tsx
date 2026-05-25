import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../utils/posts'
import type { Post } from '../types'

export default function Archive() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    getAllPosts().then(setPosts)
  }, [])

  const groupedByYear: Record<string, Post[]> = {}
  for (const post of posts) {
    const year = post.date.slice(0, 4) || '未知'
    if (!groupedByYear[year]) groupedByYear[year] = []
    groupedByYear[year].push(post)
  }

  const years = Object.keys(groupedByYear).sort((a, b) => (b > a ? 1 : -1))

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>暂无文章</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-8 gradient-text">文章归档</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">共 {posts.length} 篇文章</p>

      <div className="relative ml-4">
        {/* Timeline line */}
        <div className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 opacity-30" />

        {years.map((year) => (
          <div key={year} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 pl-6 relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/25" />
              {year}
            </h2>

            <div className="space-y-3 pl-6">
              {groupedByYear[year].map((post) => (
                <Link
                  key={post.slug}
                  to={`/post/${post.slug}`}
                  className="block glass-card glass-card-hover rounded-xl px-4 py-3"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1">
                      {post.title}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                      {post.date.slice(5)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
