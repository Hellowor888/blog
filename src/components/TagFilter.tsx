interface TagFilterProps {
  tags: string[]
  selectedTags: string[]
  onTagClick: (tag: string) => void
}

export default function TagFilter({ tags, selectedTags, onTagClick }: TagFilterProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {selectedTags.length > 0 && (
        <button
          onClick={() => selectedTags.forEach(onTagClick)}
          className="text-xs px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/60 transition-all duration-300"
        >
          清除筛选
        </button>
      )}
      {tags.map((tag) => (
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
  )
}
