export interface BookshelfItem {
  id: string
  title: string
  subtitle: string
  type: 'book' | 'movie'
  content: string
  children?: BookshelfItem[]
}

const books: BookshelfItem[] = [
  {
    id: 'harry-potter-1-2',
    title: 'Harry Potter',
    subtitle: 'J.K. Rowling',
    type: 'book',
    content: '',
    children: [
      { id: 'hp1', title: "Harry Potter and the Philosopher's Stone", subtitle: 'J.K. Rowling', type: 'book', content: '' },
      { id: 'hp2', title: 'Harry Potter and the Chamber of Secrets', subtitle: 'J.K. Rowling', type: 'book', content: '' },
    ],
  },
  {
    id: 'red-mansions',
    title: '红楼梦（上册）',
    subtitle: '曹雪芹',
    type: 'book',
    content: '',
  },
  {
    id: 'dragon-kingdom',
    title: '龙族',
    subtitle: '江南',
    type: 'book',
    content: '',
    children: [
      { id: 'dragon1', title: '龙族 I：火之晨曦', subtitle: '江南', type: 'book', content: '' },
      { id: 'dragon2', title: '龙族 II：悼亡者之瞳', subtitle: '江南', type: 'book', content: '' },
      { id: 'dragon3', title: '龙族 III：黑月之潮', subtitle: '江南', type: 'book', content: '' },
    ],
  },
  {
    id: 'science-research-writing',
    title: 'Science Research Writing',
    subtitle: 'Hilary Glasman-deal',
    type: 'book',
    content: '',
  },
]

const movies: BookshelfItem[] = [
  {
    id: 'harry-potter-movies',
    title: '哈利·波特 系列',
    subtitle: '2001 - 2011',
    type: 'movie',
    content: '',
    children: [
      { id: 'hp-m1', title: '哈利·波特与魔法石', subtitle: 'Chris Columbus · 2001', type: 'movie', content: '' },
      { id: 'hp-m2', title: '哈利·波特与密室', subtitle: 'Chris Columbus · 2002', type: 'movie', content: '' },
      { id: 'hp-m3', title: '哈利·波特与阿兹卡班的囚徒', subtitle: 'Alfonso Cuarón · 2004', type: 'movie', content: '' },
      { id: 'hp-m4', title: '哈利·波特与火焰杯', subtitle: 'Mike Newell · 2005', type: 'movie', content: '' },
      { id: 'hp-m5', title: '哈利·波特与凤凰社', subtitle: 'David Yates · 2007', type: 'movie', content: '' },
      { id: 'hp-m6', title: '哈利·波特与混血王子', subtitle: 'David Yates · 2009', type: 'movie', content: '' },
      { id: 'hp-m7', title: '哈利·波特与死亡圣器', subtitle: 'David Yates · 2010 / 2011', type: 'movie', content: '' },
    ],
  },
  {
    id: 'shawshank-redemption',
    title: '肖申克的救赎',
    subtitle: 'Frank Darabont · 1994',
    type: 'movie',
    content: '',
  },
  {
    id: 'catch-me-if-you-can',
    title: '猫鼠游戏',
    subtitle: 'Steven Spielberg · 2002',
    type: 'movie',
    content: '',
  },
  {
    id: 'evangelion',
    title: '新世纪福音战士',
    subtitle: '庵野秀明 · 1995',
    type: 'movie',
    content: '',
  },
  {
    id: 'tokyo-love-story',
    title: '东京爱情故事',
    subtitle: '永山耕三 / 本间欧彦 · 1991',
    type: 'movie',
    content: '',
  },
  {
    id: 'ming-lan',
    title: '知否知否应是绿肥红瘦',
    subtitle: '张开宙 · 2018',
    type: 'movie',
    content: '',
  },
  {
    id: 'xianjian-3',
    title: '仙剑奇侠传三',
    subtitle: '胡歌 / 杨幂 · 2009',
    type: 'movie',
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
