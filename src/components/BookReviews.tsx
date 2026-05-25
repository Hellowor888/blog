import { useState, useEffect, useCallback } from 'react'
import Stars from './Stars'
import { getReviews, addReview, deleteReview } from '../utils/reviews'
import type { BookshelfReview } from '../utils/reviews'
import { useIdentity } from '../hooks/useIdentity'

const ADMIN_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

async function sha256(message: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function avgRating(reviews: BookshelfReview[]): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((a, r) => a + (r.rating || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export default function BookReviews({ itemId }: { itemId: string }) {
  const [reviews, setReviews] = useState<BookshelfReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { identity, setName: saveIdentity } = useIdentity()

  const [nameInput, setNameInput] = useState('')
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [authed, setAuthed] = useState(false)
  const [pwd, setPwd] = useState('')
  const [pwdError, setPwdError] = useState(false)

  const load = useCallback(async () => {
    try {
      setError('')
      const data = await getReviews(itemId)
      setReviews(data)
    } catch (err: any) {
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [itemId])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nameToUse = identity.locked ? identity.name : nameInput.trim()
    if (!nameToUse || rating === 0 || !text.trim()) return

    try {
      setSubmitting(true)
      setSubmitError('')

      // Save identity on first use
      if (!identity.locked) {
        saveIdentity(nameInput.trim())
      }

      await addReview({
        itemId,
        name: nameToUse,
        rating,
        text: text.trim(),
        time: new Date().toLocaleString('zh-CN'),
      })
      setRating(0)
      setText('')
      setNameInput('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 2500)
      await load()
    } catch (err: any) {
      setSubmitError(err.message || '提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAuth = async () => {
    const hash = await sha256(pwd)
    if (hash === ADMIN_PASSWORD_HASH) {
      setAuthed(true)
      setPwdError(false)
    } else {
      setPwdError(true)
      setTimeout(() => setPwdError(false), 2000)
    }
  }

  const handleDelete = async (id: string) => {
    if (!authed) return
    try {
      await deleteReview(id)
      setReviews(prev => prev.filter(r => r._id !== id))
    } catch (err: any) {
      console.error('删除失败:', err)
    }
  }

  const avg = avgRating(reviews)

  return (
    <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-8">
      {/* Rating summary */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">读者评价</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(avg)} readonly size="sm" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{avg}</span>
            <span className="text-xs text-gray-400">({reviews.length} 条评价)</span>
          </div>
        )}
      </div>

      {/* Review form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 md:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">写下你的评价</p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          {identity.locked ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">昵称：</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                {identity.name}
              </span>
            </div>
          ) : (
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="你的昵称（确定后不可修改）"
              maxLength={30}
              className="w-full sm:w-56 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow text-sm"
            />
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">评分：</span>
            <Stars rating={rating} onRate={setRating} />
            {rating > 0 && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{rating} 星</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="分享你的读后感或观后感..."
            rows={3}
            maxLength={1000}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow text-sm resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={(!identity.locked && !nameInput.trim()) || rating === 0 || !text.trim() || submitting}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {submitting ? '提交中...' : '提交评价'}
          </button>
          {submitted && (
            <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium animate-pulse">
              评价成功！
            </span>
          )}
          {submitError && (
            <span className="text-red-500 text-sm">{submitError}</span>
          )}
        </div>
      </form>

      {/* Reviews list */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">加载评价中...</p>
      ) : error ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">{error}</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-center py-8 text-sm">暂无评价，来写第一条吧</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((r) => (
            <div key={r._id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{r.name}</span>
                  <Stars rating={r.rating || 0} readonly size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{r.time}</span>
                  {authed && (
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      title="删除评价"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Admin auth */}
      <div className="mt-6 flex items-center justify-end gap-2">
        {!authed ? (
          <>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              placeholder="管理员"
              className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <button
              onClick={handleAuth}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              确认
            </button>
          </>
        ) : (
          <button
            onClick={() => { setAuthed(false); setPwd('') }}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            退出管理
          </button>
        )}
        {pwdError && <span className="text-red-500 text-xs">密码错误</span>}
      </div>
    </div>
  )
}
