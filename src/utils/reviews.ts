const API_BASE = 'https://guestbook-messages-d9cr3be1af85c-1436650635.ap-shanghai.app.tcloudbase.com/bookshelf'

export interface BookshelfReview {
  _id: string
  itemId: string
  name: string
  rating: number
  text: string
  time: string
  createdAt?: string
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

export async function getReviews(itemId: string): Promise<BookshelfReview[]> {
  const data = await api('?itemId=' + encodeURIComponent(itemId))
  return data || []
}

export async function addReview(review: {
  itemId: string
  name: string
  rating: number
  text: string
  time: string
}): Promise<void> {
  await api('', {
    method: 'POST',
    body: JSON.stringify(review),
  })
}

export async function deleteReview(id: string): Promise<void> {
  await api('/' + id, { method: 'DELETE' })
}
