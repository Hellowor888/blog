import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1 className="gradient-text text-2xl md:text-3xl">关于我</h1>

      <p>
        你好！欢迎来到我的个人博客。
      </p>

      <h2>关于这个博客</h2>
      <p>
        这里记录我的学习笔记、技术分享和生活感悟。希望能对你有所帮助。
      </p>

      <h2>联系方式</h2>
      <p>
        如有任何问题或建议，欢迎通过以下方式联系我：
      </p>
      <a
        href="mailto:Chendongsheng0616@163.com"
        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-pink-500 dark:hover:text-pink-400 transition-colors no-underline"
        title="Chendongsheng0616@163.com"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </a>

      <div className="mt-8">
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
          &larr; 返回首页
        </Link>
      </div>
    </div>
  )
}
