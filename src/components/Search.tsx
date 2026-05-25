import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts } from '../utils/posts'
import type { Post } from '../types'

interface SearchProps {
  open: boolean
  onClose: () => void
}

export default function Search({ open, onClose }: SearchProps) {
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [results, setResults] = useState<Post[]>([])

  useEffect(() => {
    getAllPosts().then(setPosts)
  }, [])

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); return }
    const lower = q.toLowerCase()
    setResults(
      posts.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.content.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower))
      ).slice(0, 10)
    )
  }, [posts])

  useEffect(() => {
    doSearch(query)
  }, [query, doSearch])

  useEffect(() => {
    if (open) {
      setQuery('')
      document.body.style.overflow = 'hidden'
      setTimeout(() => document.getElementById('search-input')?.focus(), 100)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open ? onClose() : onClose() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-w-xl mx-auto mt-[15vh] px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-base"
            />
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {query && results.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">没有找到相关文章</p>
            ) : results.length > 0 ? (
              results.map((p) => (
                <Link
                  key={p.slug}
                  to={`/post/${p.slug}`}
                  onClick={onClose}
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{p.excerpt}</p>
                </Link>
              ))
            ) : query ? null : (
              <p className="text-center text-gray-400 py-4 text-xs">输入关键词搜索文章标题、内容和标签</p>
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Esc</kbd> 关闭 · <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Ctrl+K</kbd> 打开
          </div>
        </div>
      </div>
    </div>
  )
}
