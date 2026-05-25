import type { Post } from '../types'

const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
})

function calcReadingTime(content: string): number {
  const chineseChars = (content.match(/[一-鿿]/g) || []).length
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length
  // Chinese: ~400 chars/min, English: ~200 words/min
  const minutes = Math.ceil(chineseChars / 400 + englishWords / 200)
  return Math.max(1, minutes)
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const frontmatterStr = match[1]
  const content = match[2]
  const data: Record<string, unknown> = {}

  for (const line of frontmatterStr.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value: unknown = line.slice(idx + 1).trim()

    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s: string) => s.trim())
    }

    data[key] = value
  }

  return { data, content }
}

export async function getAllPosts(): Promise<Post[]> {
  const posts: Post[] = []

  for (const [path, loader] of Object.entries(modules)) {
    const raw = (await loader()) as string
    const { data, content } = parseFrontmatter(raw)
    const slug = path.replace('../content/posts/', '').replace('.md', '')

    posts.push({
      slug,
      title: (data.title as string) ?? slug,
      date: (data.date as string) ?? '',
      tags: (data.tags as string[]) ?? [],
      excerpt: (data.excerpt as string) ?? '',
      content,
      readingTime: calcReadingTime(content),
    })
  }

  posts.sort((a, b) => (b.date > a.date ? 1 : -1))
  return posts
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts()
  const tagSet = new Set<string>()
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}
