import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCollectionById } from '../data/photos'

export default function Collection() {
  const { id } = useParams<{ id: string }>()
  const collection = id ? getCollectionById(id) : null
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (!collection) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4 text-gray-300 dark:text-gray-700">404</p>
        <p className="text-gray-500">相册未找到</p>
        <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">返回首页</Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="text-sm text-blue-500 hover:underline mb-4 inline-block">
        &larr; 返回首页
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 gradient-text">{collection.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{collection.description}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          {collection.photos.length} 张照片
        </p>
      </header>

      {/* 照片瀑布流 */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {collection.photos.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${collection.name} 照片 ${i + 1}`}
            className="w-full mb-4 rounded-xl cursor-pointer hover:brightness-90 transition-all duration-300"
            loading="lazy"
            onClick={() => setLightbox(src)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-pointer"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
