export interface PhotoCollection {
  id: string
  name: string
  description: string
  cover: string
  photos: string[]
}

const collections: PhotoCollection[] = [
  {
    id: 'luoyang',
    name: '洛阳',
    description: '千年古都，牡丹花城。漫步龙门石窟，感受盛唐遗风。',
    cover: '/photos/照片1.jpg',
    photos: [
      '/photos/照片1.jpg',
      '/photos/照片2.jpg',
      '/photos/照片3.jpg',
      '/photos/照片4.jpg',
      '/photos/照片5.jpg',
    ],
  },
]

export function getAllCollections(): PhotoCollection[] {
  return collections
}

export function getCollectionById(id: string): PhotoCollection | null {
  return collections.find((c) => c.id === id) ?? null
}
