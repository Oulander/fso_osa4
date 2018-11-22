const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const { initialBlogs, initialUsers, blogsInDb, usersInDb, nonExistingId, randomUser } = require('./test_helper')

beforeAll(async () => {
  const userRemovePromise = User.remove({})
  const blogRemovePromise = Blog.remove({})

  await userRemovePromise
  const userSavePromises = initialUsers.map((user) => new User(user).save())
  await Promise.all(userSavePromises)

  const usersWithIds = await usersInDb()
  const userIds = usersWithIds.map(u => u.id)

  const initialBlogsWithUsers = initialBlogs.map((blog) => {
    return {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: userIds[Math.floor(Math.random()*userIds.length)]
    }
  })

  await blogRemovePromise
  const blogSavepromises = initialBlogsWithUsers.map((blog) => new Blog(blog).save())
  await Promise.all(blogSavepromises)
})

describe('Blog API tests:', async () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length)
  })

  test('a new blog can be added ', async () => {

    const blogs = await Blog.find({})
    const singleBlog = Blog.format(blogs[Math.floor(Math.random()*blogs.length)])
    delete singleBlog.id

    const blogsBefore = await blogsInDb()

    const user = await randomUser()

    const newBlog = {
      title: 'Morjesta vaan',
      author: 'Mina Vain',
      url: 'http://intternets',
      likes: 1002,
      user: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length + 1)
    expect(blogsAfter.map(b => {
      delete b.id
      return b
    })).toContainEqual(newBlog)
  })

  test('a blog with no url cannot be added ', async () => {
    const newBlog1 = {
      title: 'Morjesta vaan',
    }

    const newBlog2 = {
      url: 'Morjesta vaan',
    }

    const newBlog3 = {
      author: 'Morjesta vaan',
    }

    const blogsBefore = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog1)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(newBlog2)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(newBlog3)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length)
  })

  test('a blog with no likes will have 1 like ', async () => {
    const user = await randomUser()

    const newBlog = {
      title: 'Morjesta vuannii',
      author: 'Mina Vain',
      url: 'http://intternets',
      user: user.id
    }

    const blogsBefore = await blogsInDb()

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter.length).toBe(blogsBefore.length + 1)

  })

  describe('deletion of a blog', async () => {
    let newBlog

    beforeAll(async () => {
      const user = await randomUser()
      newBlog = new Blog({
        title: 'Poistuu kohta',
        author: 'Mina Vain',
        url: 'http://intternets',
        user: user.id
      })
      await newBlog.save()
    })

    test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
      const blogsBefore = await blogsInDb()

      await api
        .delete(`/api/blogs/${newBlog._id}`)
        .expect(204)

      const blogsAfter = await blogsInDb()

      expect(blogsAfter).not.toContainEqual(newBlog)
      expect(blogsAfter.length).toBe(blogsBefore.length - 1)
    })
  })

  test('a blog can be modified ', async () => {

    const response = await api.get('/api/blogs')
    const blogsBefore = response.body

    let updatedBlog = blogsBefore[0]
    updatedBlog.title = 'Updated Bloggy'

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await blogsInDb()
    expect(blogsAfter.length).toBe(blogsBefore.length)
    expect(blogsAfter.map(b => b.title)).toContainEqual(updatedBlog.title)
  })

  test('404 returned by GET /api/blogs/:id with nonexisting valid id', async () => {
    const validNonexistingId = await nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('400 is returned by GET /api/blogs/:id with invalid id', async () => {
    const invalidId = '1234567178181818'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })

})

describe('User API tests', async () => {

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'asdf',
      name: 'Qwer Tynen',
      password: 'S4la.SANA'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('POST /api/users fails if username already taken', async () => {
    const usersBeforeOperation = await usersInDb()
    const user = await randomUser()

    const newUser = {
      username: user.username,
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'username must be unique' })

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/users fails if username missing', async () => {
    const usersBeforeOperation = await usersInDb()

    const noUsernameUser = {
      name: 'Superuser',
      password: 'salainen'
    }

    const noUsernamePromise = api
      .post('/api/users')
      .send(noUsernameUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const noUsernameResult = await noUsernamePromise

    expect(noUsernameResult.body).toEqual({ error: 'username cannot be empty' })

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/users fails if name missing', async () => {
    const usersBeforeOperation = await usersInDb()

    const noNameUser = {
      username: 'duudelsson',
      password: 'salainen'
    }

    const noNamePromise = api
      .post('/api/users')
      .send(noNameUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const noNameResult = await noNamePromise

    expect(noNameResult.body).toEqual({ error: 'name cannot be empty' })

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/users fails if password too short', async () => {
    const usersBeforeOperation = await usersInDb()

    const badPasswordUser = {
      username: 'asdfweg',
      name: 'salainenTyyppi',
      password: '1'
    }

    const badPasswordPromise = api
      .post('/api/users')
      .send(badPasswordUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const badPasswordResult = await badPasswordPromise

    expect(badPasswordResult.body).toEqual({ error: 'password must have at least 3 characters' })

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })
})

afterAll(() => {
  server.close()
})
