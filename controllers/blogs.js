const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try{
    const blogs = await Blog.find({})
    response.json(blogs.map(Blog.format))
  } catch(exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.post('/', async (request, response) => {
  try{
    const body = request.body
    if(body.title === undefined||body.url === undefined){
      return response.status(400).json({ error: 'both title & url required' })
    }

    if(body.likes === undefined){
      body.likes = 0
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes
    })

    const saved = await blog.save()
    response.status(201).json(saved)
  } catch(exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try{
    const id = request.params.id
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
    console.log(id)
    const updated = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.status(200).json(Blog.format(updated))

  } catch(exception){
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = blogsRouter
