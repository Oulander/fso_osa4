const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

async function createPasswordHash(password){
  const passwordHash = await bcrypt.hash(password, 10)
  return passwordHash
}

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  }
]

const initialUsers = [
  {
    username: 'user1',
    name: 'marja',
    passwordHash: createPasswordHash('asghj').toString(),
    adult: true,
  },
  {
    username: 'user2',
    name: 'mikko',
    passwordHash: createPasswordHash('werjh').toString(),
    adult: false,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(Blog.format)
}

const nonExistingId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User.format)
}

const randomUser = async () => {
  const users = await User.find({})
  return User.format(users[Math.floor(Math.random()*users.length)])
}

module.exports = {
  initialBlogs, initialUsers, blogsInDb, nonExistingId, usersInDb, randomUser
}
