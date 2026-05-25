import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'blog_user_identity'

export interface Identity {
  name: string
  locked: boolean
}

export function useIdentity(): {
  identity: Identity
  setName: (name: string) => void
  resetName: () => void
} {
  const [identity, setIdentity] = useState<Identity>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return { name: parsed.name || '', locked: true }
      } catch {
        return { name: '', locked: false }
      }
    }
    return { name: '', locked: false }
  })

  // Keep localStorage in sync
  useEffect(() => {
    if (identity.locked && identity.name) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: identity.name }))
    }
  }, [identity])

  const setName = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: trimmed }))
    setIdentity({ name: trimmed, locked: true })
  }, [])

  const resetName = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setIdentity({ name: '', locked: false })
  }, [])

  return { identity, setName, resetName }
}
