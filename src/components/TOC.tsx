import { useEffect, useState, useMemo } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function TOC({ content }: { content: string }) {
  const [activeId, setActiveId] = useState('')

  const items = useMemo(() => {
    const headings: TOCItem[] = []
    const regex = /^(#{2,4})\s+(.+)$/gm
    let m: RegExpExecArray | null
    while ((m = regex.exec(content)) !== null) {
      const text = m[2]
      const id = text
        .toLowerCase()
        .replace(/[^\w一-鿿\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '')
      headings.push({ id, text, level: m[1].length })
    }
    return headings
  }, [content])

  useEffect(() => {
    if (items.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-64px 0px -80% 0px' }
    )
    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  if (items.length < 2) return null

  return (
    <nav className="hidden xl:block sticky top-20 w-56 shrink-0 ml-8 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
        目录
      </h3>
      <ul className="space-y-1 border-l-2 border-gray-200 dark:border-gray-800">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-sm py-1 transition-colors duration-200 ${
                activeId === item.id
                  ? 'text-indigo-600 dark:text-indigo-400 font-medium border-l-2 -ml-[2px] border-indigo-600 dark:border-indigo-400 pl-3'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 pl-[10px]'
              }`}
              style={{ paddingLeft: activeId === item.id ? undefined : `${(item.level - 2) * 12 + 10}px` }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
