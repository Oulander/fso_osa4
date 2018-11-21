const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog.js')
const { initialBlogs, blogsInDb, format } = require('./test_helper')

beforeAll(async () => {
  await Blog.remove({})

  for (let singleBlogContent of initialBlogs) {
    let blogObject = new Blog(singleBlogContent)
    await blogObject.save()
  }
})

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

test('a specific blog is within the returned notes', async () => {
  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  expect(titles).toContain('TDD harms architecture')
})

test('a new blog can be added ', async () => {
  const newBlog = {
    title: 'Morjesta vaan',
    author: 'Mina Vain',
    url: 'http://intternets',
    likes: 1000
  }

  const blogsBefore = await blogsInDb()

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await blogsInDb()
  expect(blogsAfter.length).toBe(blogsBefore.length + 1)
  expect(blogsAfter).toContainEqual(newBlog)
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
  const newBlog = {
    title: 'Morjesta vuannii',
    author: 'Mina Vain',
    url: 'http://intternets',
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
    newBlog = new Blog({
      title: 'Poistuu kohta',
      author: 'Mina Vain',
      url: 'http://intternets',
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
  console.log(updatedBlog)
  updatedBlog.title = 'Updated Bloggy'

  await api
    .put(`/api/blogs/${updatedBlog.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await blogsInDb()
  expect(blogsAfter.length).toBe(blogsBefore.length)
  expect(blogsAfter).toContainEqual(format(updatedBlog))
})

afterAll(() => {
  server.close()
})
