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
      <p>
        邮箱：<a href="mailto:Chendongsheng0616@163.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">Chendongsheng0616@163.com</a>
      </p>

      <div className="mt-8">
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
          &larr; 返回首页
        </Link>
      </div>
    </div>
  )
}
