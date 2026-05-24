import { useState, useEffect, useRef } from 'react'

interface Message {
  id: number
  name: string
  text: string
  time: string
}

// 管理员密码的 SHA-256 哈希（代码中不存储明文密码）
// 修改密码：将新密码的 SHA-256 哈希替换下面的值即可
// 在线计算哈希：https://emn178.github.io/online-tools/sha256.html
const ADMIN_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

async function sha256(message: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}
const STORAGE_KEY = 'blog-guestbook-messages'

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMessages(msgs: Message[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs))
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>(loadMessages)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [pwd, setPwd] = useState('')
  const [pwdError, setPwdError] = useState(false)
  const pwdRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return

    const newMsg: Message = {
      id: Date.now(),
      name: name.trim(),
      text: text.trim(),
      time: new Date().toLocaleString('zh-CN'),
    }

    setMessages((prev) => [newMsg, ...prev])
    setName('')
    setText('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
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

  const handleDelete = (id: number) => {
    if (!authed) return
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">给我留言</h1>

      {/* 留言表单——所有人可见 */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
            你的名字
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入你的名字"
            maxLength={30}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm"
          />
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
        <button
          type="submit"
          disabled={!name.trim() || !text.trim()}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          提交留言
        </button>
        {submitted && (
          <span className="ml-3 text-green-600 dark:text-green-400 text-sm">
            留言成功，感谢！
          </span>
        )}
      </form>

      {/* 管理员查看区域 */}
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

          {messages.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">
              暂无留言
            </p>
          ) : (
            <div className="grid gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-sm">{msg.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 ml-3">
                        {msg.time}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(msg.id)}
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
