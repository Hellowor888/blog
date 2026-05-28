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

  // Deduplicate by text content and assign random track params
  const tracked: TrackedMsg[] = useMemo(() => {
    const seen = new Set<string>()
    const result: TrackedMsg[] = []
    for (const text of messages) {
      if (seen.has(text)) continue
      seen.add(text)
      result.push({
        id: idCounter++,
        text,
        top: 2 + Math.random() * 88, // 2-90% of container height
        duration: 8 + Math.random() * 12, // 8-20s to cross
        delay: 0 + Math.random() * 10, // 0-10s delay
      })
    }
    return result
  }, [messages])

  useEffect(() => {
    // Remove stale keyframes from previous render
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
          `@keyframes dm-${m.id} { from { transform: translateX(100vw); } to { transform: translateX(-100%); } }`
      )
      .join('\n')
    el.textContent = rules

    return () => {
      // Clean up only when unmounting entirely
    }
  }, [tracked])

  if (tracked.length === 0) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-50"
    >
      {tracked.map((m) => (
        <div
          key={m.id}
          className="absolute whitespace-nowrap text-sm font-medium opacity-40 dark:opacity-25 text-gray-700 dark:text-gray-300"
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
