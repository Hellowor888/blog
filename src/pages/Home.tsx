import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAllPosts, getAllTags } from '../utils/posts'
import type { Post } from '../types'
import { getAllCollections, type PhotoCollection } from '../data/photos'
import PostCard from '../components/PostCard'
import TagFilter from '../components/TagFilter'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [collections] = useState<PhotoCollection[]>(getAllCollections)

  useEffect(() => {
    getAllPosts().then(setPosts)
    getAllTags().then(setTags)
  }, [])

  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return posts
    return posts.filter((p) => selectedTags.every((t) => p.tags.includes(t)))
  }, [posts, selectedTags])

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div>
      {/* 摄影作品 */}
      {collections.length > 0 && (
        <section className="mb-8 md:mb-12">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 gradient-text">摄影作品</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collections.map((col) => (
              <Link
                key={col.id}
                to={`/collection/${col.id}`}
                className="group relative block overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] md:aspect-[4/3] overflow-hidden">
                  <img
                    src={col.cover}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">{col.name}</h3>
                  <p className="text-xs md:text-sm text-white/80 line-clamp-1">{col.description}</p>
                  <p className="text-xs text-white/60 mt-2">{col.photos.length} 张照片</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 最新文章 */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 gradient-text">最新文章</h2>

        <TagFilter tags={tags} selectedTags={selectedTags} onTagClick={handleTagClick} />

        {filteredPosts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">
            暂无文章
          </p>
        ) : (
          <div className="grid gap-6 article-grid">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                selectedTags={selectedTags}
                onTagClick={handleTagClick}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
