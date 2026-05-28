import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useIdentity } from '../hooks/useIdentity'
import Danmaku from '../components/Danmaku'

interface Message {
  _id: string
  name: string
  text: string
  time: string
  createdAt?: string
}

const API_BASE = 'https://guestbook-messages-d9cr3be1af85c-1436650635.ap-shanghai.app.tcloudbase.com/guestbook'
const ADMIN_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

async function sha256(message: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function api(path: string, options?: RequestInit) {
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  const json = await res.json()
  if (json.code !== 0) throw new Error(json.message || '请求失败')
  return json.data
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([])
  const { identity, setName: saveIdentity } = useIdentity()
  const [nameInput, setNameInput] = useState('')
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [pwd, setPwd] = useState('')
  const [pwdError, setPwdError] = useState(false)
  const [dbStatus, setDbStatus] = useState<'connecting' | 'ok' | 'error'>('connecting')
  const [dbError, setDbError] = useState('')
  const pwdRef = useRef<HTMLInputElement>(null)

  const loadMessages = useCallback(async () => {
    try {
      setDbStatus('connecting')
      const msgs = await api('')
      setMessages(msgs || [])
      setDbStatus('ok')
      setLoading(false)
    } catch (err: any) {
      console.error('加载留言失败:', err)
      setDbStatus('error')
      setDbError(err.message || String(err))
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nameToUse = identity.locked ? identity.name : nameInput.trim()
    if (!nameToUse || !text.trim()) return

    try {
      // Save identity on first use
      if (!identity.locked) {
        saveIdentity(nameInput.trim())
      }

      await api('', {
        method: 'POST',
        body: JSON.stringify({
          name: nameToUse,
          text: text.trim(),
          time: new Date().toLocaleString('zh-CN'),
        }),
      })
      console.log('留言已提交')
      setNameInput('')
      setText('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 2500)
      await loadMessages()
    } catch (err: any) {
      console.error('留言提交失败:', err)
      alert('留言提交失败: ' + (err.message || '未知错误'))
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

  const danmakuTexts = useMemo(() => messages.map((m) => m.text), [messages])

  const handleDelete = async (id: string) => {
    if (!authed) return
    try {
      await api('/' + id, { method: 'DELETE' })
      setMessages(prev => prev.filter(m => m._id !== id))
    } catch (err: any) {
      console.error('删除失败:', err)
    }
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-6 gradient-text">给我留言</h1>

      <Danmaku messages={danmakuTexts} />

      {dbStatus !== 'ok' && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          dbStatus === 'connecting'
            ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        }`}>
          {dbStatus === 'connecting' ? '数据库连接中...' : `数据库连接失败: ${dbError}`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
            你的名字
          </label>
          {identity.locked ? (
            <div className="flex items-center gap-2">
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
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm"
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
            留言内容
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="写下你想说的话..."
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm resize-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={(!identity.locked && !nameInput.trim()) || !text.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            提交留言
          </button>
          {submitted && (
            <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium animate-pulse">
              留言成功！
            </span>
          )}
        </div>
      </form>

      {!authed ? (
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            管理员登录以查看留言
          </p>
          <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
            <input
              ref={pwdRef}
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              placeholder="请输入密码"
              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAuth}
              className="px-4 py-1.5 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded-lg text-sm hover:opacity-80 transition-opacity"
            >
              确认
            </button>
          </div>
          {pwdError && (
            <p className="text-red-500 text-sm mt-2">密码错误</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              全部留言（{messages.length}）
            </h2>
            <button
              onClick={() => { setAuthed(false); setPwd('') }}
              className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              退出管理
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">加载中...</p>
          ) : messages.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">暂无留言</p>
          ) : (
            <div className="grid gap-4">
              {messages.map((msg) => (
                <div key={msg._id} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-sm">{msg.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-3">{msg.time}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      title="删除留言"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
