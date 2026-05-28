import { useEffect, useRef, useMemo } from 'react'

interface Props {
  messages: string[]
}

interface TrackedMsg {
  id: number
  text: string
  top: number
  duration: number
  delay: number
}

let idCounter = 0

export default function Danmaku({ messages }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const tracked: TrackedMsg[] = useMemo(() => {
    const seen = new Set<string>()
    const result: TrackedMsg[] = []
    for (const text of messages) {
      if (seen.has(text)) continue
      seen.add(text)
      result.push({
        id: idCounter++,
        text,
        top: 5 + Math.random() * 80, // 5-85% within the strip
        duration: 8 + Math.random() * 12, // 8-20s to cross
        delay: 0 + Math.random() * 8, // 0-8s delay before first appearance
      })
    }
    return result
  }, [messages])

  useEffect(() => {
    const styleId = 'danmaku-keyframes'
    let el = document.getElementById(styleId) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = styleId
      document.head.appendChild(el)
    }

    const rules = tracked
      .map(
        (m) =>
          `@keyframes dm-${m.id} { 0% { left: 100%; transform: translateX(0); } 100% { left: 0%; transform: translateX(-100%); } }`
      )
      .join('\n')
    el.textContent = rules

    return () => {
      // Keep keyframes until component truly unmounts
      if (containerRef.current && typeof document !== 'undefined') {
        // Cleanup handled by parent re-render cycle
      }
    }
  }, [tracked])

  if (tracked.length === 0) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 backdrop-blur pointer-events-none select-none"
      style={{ height: 60 }}
    >
      {tracked.map((m) => (
        <div
          key={m.id}
          className="absolute whitespace-nowrap text-sm font-medium opacity-45 dark:opacity-30 text-gray-600 dark:text-gray-300"
          style={{
            top: `${m.top}%`,
            animation: `dm-${m.id} ${m.duration}s linear ${m.delay}s infinite`,
          }}
        >
          {m.text}
        </div>
      ))}
    </div>
  )
}
