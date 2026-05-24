import matter from 'gray-matter'
import type { Post } from '../types'

const modules = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
})

export async function getAllPosts(): Promise<Post[]> {
  const posts: Post[] = []

  for (const [path, loader] of Object.entries(modules)) {
    const raw = (await loader()) as string
    const { data, content } = matter(raw)
    const slug = path.replace('../content/posts/', '').replace('.md', '')

    posts.push({
      slug,
      title: data.title ?? slug,
      date: data.date ?? '',
      tags: data.tags ?? [],
      excerpt: data.excerpt ?? '',
      content,
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
