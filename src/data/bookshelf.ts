export interface BookshelfItem {
  id: string
  title: string
  subtitle: string
  type: 'book' | 'movie'
  content: string
  color: string  // tailwind gradient classes
  children?: BookshelfItem[]
}

const books: BookshelfItem[] = [
  {
    id: 'harry-potter-books',
    title: 'Harry Potter',
    subtitle: 'J.K. Rowling',
    type: 'book',
    color: 'from-amber-700 via-red-800 to-amber-900',
    content: '',
    children: [
      { id: 'hp-book-1', title: 'Harry Potter and the\nPhilosopher\'s Stone', subtitle: 'J.K. Rowling', type: 'book', color: 'from-amber-600 to-orange-700', content: '' },
      { id: 'hp-book-2', title: 'Harry Potter and the\nChamber of Secrets', subtitle: 'J.K. Rowling', type: 'book', color: 'from-green-700 to-emerald-800', content: '' },
    ],
  },
  {
    id: 'red-mansions',
    title: '红楼梦',
    subtitle: '曹雪芹 · 上册',
    type: 'book',
    color: 'from-red-800 via-rose-700 to-red-900',
    content: '',
  },
  {
    id: 'dragon-kingdom',
    title: '龙族',
    subtitle: '江南',
    type: 'book',
    color: 'from-slate-700 via-gray-600 to-slate-800',
    content: '',
    children: [
      { id: 'dragon1', title: '龙族 I\n火之晨曦', subtitle: '江南', type: 'book', color: 'from-orange-600 to-red-700', content: '' },
      { id: 'dragon2', title: '龙族 II\n悼亡者之瞳', subtitle: '江南', type: 'book', color: 'from-blue-700 to-indigo-800', content: '' },
      { id: 'dragon3', title: '龙族 III\n黑月之潮', subtitle: '江南', type: 'book', color: 'from-purple-700 to-violet-800', content: '' },
    ],
  },
  {
    id: 'science-research-writing',
    title: 'Science Research\nWriting',
    subtitle: 'Hilary Glasman-deal',
    type: 'book',
    color: 'from-blue-800 to-cyan-700',
    content: '',
  },
]

const movies: BookshelfItem[] = [
  {
    id: 'harry-potter-movies',
    title: '哈利·波特',
    subtitle: '系列电影 · 2001-2011',
    type: 'movie',
    color: 'from-indigo-800 via-purple-700 to-indigo-900',
    content: '',
    children: [
      { id: 'hp-m1', title: '哈利·波特与\n魔法石', subtitle: 'Chris Columbus · 2001', type: 'movie', color: 'from-amber-500 to-yellow-600', content: '' },
      { id: 'hp-m2', title: '哈利·波特与\n密室', subtitle: 'Chris Columbus · 2002', type: 'movie', color: 'from-green-600 to-emerald-700', content: '' },
      { id: 'hp-m3', title: '哈利·波特与\n阿兹卡班的囚徒', subtitle: 'Alfonso Cuarón · 2004', type: 'movie', color: 'from-blue-600 to-indigo-700', content: '' },
      { id: 'hp-m4', title: '哈利·波特与\n火焰杯', subtitle: 'Mike Newell · 2005', type: 'movie', color: 'from-orange-500 to-red-600', content: '' },
      { id: 'hp-m5', title: '哈利·波特与\n凤凰社', subtitle: 'David Yates · 2007', type: 'movie', color: 'from-blue-500 to-cyan-600', content: '' },
      { id: 'hp-m6', title: '哈利·波特与\n混血王子', subtitle: 'David Yates · 2009', type: 'movie', color: 'from-emerald-600 to-teal-700', content: '' },
      { id: 'hp-m7', title: '哈利·波特与\n死亡圣器', subtitle: 'David Yates · 2010/2011', type: 'movie', color: 'from-gray-600 to-slate-700', content: '' },
    ],
  },
  {
    id: 'shawshank-redemption',
    title: '肖申克的救赎',
    subtitle: 'Frank Darabont · 1994',
    type: 'movie',
    color: 'from-sky-700 to-blue-800',
    content: '',
  },
  {
    id: 'catch-me-if-you-can',
    title: '猫鼠游戏',
    subtitle: 'Steven Spielberg · 2002',
    type: 'movie',
    color: 'from-amber-600 to-yellow-700',
    content: '',
  },
  {
    id: 'evangelion',
    title: '新世纪福音战士',
    subtitle: '庵野秀明 · 1995',
    type: 'movie',
    color: 'from-purple-700 to-violet-800',
    content: '',
  },
  {
    id: 'tokyo-love-story',
    title: '东京爱情故事',
    subtitle: '永山耕三 · 1991',
    type: 'movie',
    color: 'from-pink-500 to-rose-600',
    content: '',
  },
  {
    id: 'ming-lan',
    title: '知否知否\n应是绿肥红瘦',
    subtitle: '张开宙 · 2018',
    type: 'movie',
    color: 'from-emerald-600 to-green-700',
    content: '',
  },
  {
    id: 'xianjian-3',
    title: '仙剑奇侠传三',
    subtitle: '胡歌 / 杨幂 · 2009',
    type: 'movie',
    color: 'from-cyan-600 to-blue-700',
    content: '',
  },
]

export function getAllBooks(): BookshelfItem[] {
  return books
}

export function getAllMovies(): BookshelfItem[] {
  return movies
}

export function getItemById(id: string): BookshelfItem | null {
  for (const book of books) {
    if (book.id === id) return book
    if (book.children) {
      for (const child of book.children) {
        if (child.id === id) return child
      }
    }
  }
  for (const movie of movies) {
    if (movie.id === id) return movie
    if (movie.children) {
      for (const child of movie.children) {
        if (child.id === id) return child
      }
    }
  }
  return null
}
