import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const SITE = 'https://hellowor888.github.io/blog'

function rssPlugin(): Plugin {
  return {
    name: 'rss',
    apply: 'build',
    closeBundle() {
      const postsDir = path.resolve(__dirname, 'src/content/posts')
      if (!fs.existsSync(postsDir)) return

      const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))
      const items: { title: string; slug: string; date: string; excerpt: string }[] = []

      for (const file of files) {
        const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
        const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
        if (!match) continue
        const fm: Record<string, string> = {}
        for (const line of match[1].split('\n')) {
          const i = line.indexOf(':')
          if (i === -1) continue
          fm[line.slice(0, i).trim()] = line.slice(i + 1).trim()
        }
        items.push({
          title: fm.title || file,
          slug: file.replace('.md', ''),
          date: fm.date || '',
          excerpt: fm.excerpt || '',
        })
      }

      items.sort((a, b) => (b.date > a.date ? 1 : -1))

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Rising From The East</title>
  <link>${SITE}</link>
  <description>个人博客 · 生活随想、学习笔记、生活分享</description>
  <language>zh-CN</language>
  <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items.map((p) => `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${SITE}/#/post/${p.slug}</link>
    <guid isPermaLink="true">${SITE}/#/post/${p.slug}</guid>
    <pubDate>${p.date ? new Date(p.date).toUTCString() : ''}</pubDate>
    <description>${escapeXml(p.excerpt)}</description>
  </item>`).join('\n')}
</channel>
</rss>`

      fs.writeFileSync(path.resolve(__dirname, 'dist/feed.xml'), xml)
      console.log('  RSS feed generated → dist/feed.xml')
    },
  }
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export default defineConfig({
  plugins: [react(), rssPlugin()],
  base: '/blog/',
  assetsInclude: ['**/*.md'],
})
