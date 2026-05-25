import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllPosts } from '../utils/posts'

interface TagStat {
  name: string
  count: number
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagStat[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getAllPosts().then((posts) => {
      const map: Record<string, number> = {}
      for (const post of posts) {
        for (const tag of post.tags) {
          map[tag] = (map[tag] || 0) + 1
        }
      }
      const list = Object.entries(map)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
      setTags(list)
    })
  }, [])

  const maxCount = useMemo(() => (tags.length > 0 ? Math.max(...tags.map((t) => t.count)) : 1), [tags])

  const getSizeClass = (count: number) => {
    const ratio = count / maxCount
    if (ratio >= 0.8) return 'text-xl md:text-2xl font-bold'
    if (ratio >= 0.5) return 'text-lg md:text-xl font-semibold'
    if (ratio >= 0.3) return 'text-base md:text-lg font-medium'
    return 'text-sm md:text-base'
  }

  const getOpacity = (count: number) => {
    const ratio = count / maxCount
    return 0.5 + ratio * 0.5
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>暂无标签</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2 gradient-text">标签</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{tags.length} 个标签</p>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => navigate(`/?tag=${encodeURIComponent(tag.name)}`)}
            className={`${getSizeClass(tag.count)} text-indigo-600 dark:text-indigo-400 hover:text-pink-500 dark:hover:text-pink-400 transition-all duration-300 hover:scale-110`}
            style={{ opacity: getOpacity(tag.count) }}
          >
            {tag.name}
            <sup className="text-xs ml-0.5 text-gray-400">{tag.count}</sup>
          </button>
        ))}
      </div>
    </div>
  )
}
