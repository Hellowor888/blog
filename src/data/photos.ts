export interface PhotoCollection {
  id: string
  name: string
  description: string
  cover: string
  photos: string[]
}

const BASE = import.meta.env.BASE_URL

const collections: PhotoCollection[] = [
  {
    id: 'luoyang',
    name: '洛阳',
    description: '千年古都，牡丹花城。漫步龙门石窟，感受盛唐遗风。',
    cover: `${BASE}photos/photo1.jpg`,
    photos: [
      `${BASE}photos/photo1.jpg`,
      `${BASE}photos/photo2.jpg`,
      `${BASE}photos/photo3.jpg`,
      `${BASE}photos/photo4.jpg`,
      `${BASE}photos/photo5.jpg`,
    ],
  },
]

export function getAllCollections(): PhotoCollection[] {
  return collections
}

export function getCollectionById(id: string): PhotoCollection | null {
  return collections.find((c) => c.id === id) ?? null
}
