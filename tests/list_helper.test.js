const listHelper = require('../utils/list_helper.js')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const listWithManyblogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

describe.skip('list helpers', () => {
  test('dummy is called', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })

  describe('total likes', () => {
    test('of empty list is zero', () => {
      expect(listHelper.totalLikes([])).toBe(0)
    })
    test('of a list with one item is correct', () => {
      expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
    })
    test('of a bigger list is calculated right', () => {
      expect(listHelper.totalLikes(listWithManyblogs)).toBe(36)
    })
  })

  describe('the blog with most likes', () => {

    const favoriteOne = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    }

    const favoriteMany = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    test('is undefined for an empty list', () => {
      expect(listHelper.favoriteBlog([])).toBe(undefined)
    })
    test('in a list of one blog is that one', () => {
      expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual(favoriteOne)
    })
    test('in a list of many is the correct one', () => {
      expect(listHelper.favoriteBlog(listWithManyblogs)).toEqual(favoriteMany)
    })


  })

  describe('the author with most blogs', () => {

    const mostBlogsOne = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }

    const mostBlogsMany =   {
      author: 'Robert C. Martin',
      blogs: 3
    }

    test('is undefined for an empty list', () => {
      expect(listHelper.mostBlogs([])).toBe(undefined)
    })
    test('in a list of one blog is that author', () => {
      expect(listHelper.mostBlogs(listWithOneBlog)).toEqual(mostBlogsOne)
    })
    test('in a list of many is the author with most blogs', () => {
      expect(listHelper.mostBlogs(listWithManyblogs)).toEqual(mostBlogsMany)
    })


  })

  describe('the author with most likes', () => {

    const mostLikesOne = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }

    const mostLikesMany =   {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    test('is undefined for an empty list', () => {
      expect(listHelper.mostLikes([])).toBe(undefined)
    })
    test('in a list of one blog is that author', () => {
      expect(listHelper.mostLikes(listWithOneBlog)).toEqual(mostLikesOne)
    })
    test('in a list of many is the author with most likes', () => {
      expect(listHelper.mostLikes(listWithManyblogs)).toEqual(mostLikesMany)
    })


  })
})
