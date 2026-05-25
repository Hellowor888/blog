interface StarsProps {
  rating: number
  onRate?: (n: number) => void
  readonly?: boolean
  size?: 'sm' | 'md'
}

export default function Stars({ rating, onRate, readonly = false, size = 'md' }: StarsProps) {
  const textSize = size === 'sm' ? 'text-sm' : 'text-xl'
  const gap = size === 'sm' ? 'gap-0.5' : 'gap-1'

  return (
    <div className={`flex items-center ${gap}`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= rating
        const half = !filled && n - 0.5 <= rating

        if (readonly || !onRate) {
          return (
            <span
              key={n}
              className={`${textSize} ${filled ? 'text-amber-400' : half ? 'text-amber-300' : 'text-gray-300 dark:text-gray-600'} transition-colors`}
            >
              {filled ? '★' : half ? '★' : '☆'}
            </span>
          )
        }

        return (
          <button
            key={n}
            type="button"
            onClick={() => onRate(n)}
            onMouseEnter={(e) => {
              const btns = e.currentTarget.parentElement!.children
              for (let i = 0; i < btns.length; i++) {
                const el = btns[i] as HTMLElement
                el.style.color = i < n ? '' : ''
              }
            }}
            className={`${textSize} transition-all duration-150 hover:scale-110 ${
              filled ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 dark:text-gray-600 hover:text-amber-300'
            }`}
            aria-label={`${n}星`}
          >
            {filled ? '★' : '☆'}
          </button>
        )
      })}
    </div>
  )
}
