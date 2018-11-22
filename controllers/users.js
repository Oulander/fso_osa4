const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user.js')

usersRouter.get('/', async (request, response) => {
  try{
    const users = await User
      .find({})
      .populate('blogs', { is:1, title:1, author:1, url:1, likes:1 })
    response.json(users.map(User.format))
  } catch(exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

usersRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const pwdMinLength = 3

    if (body.username === undefined){
      return response.status(400).json({ error: 'username cannot be empty' })
    }

    if (body.name === undefined){
      return response.status(400).json({ error: 'name cannot be empty' })
    }

    const existingUser = await User.find({ username: body.username })
    if (existingUser.length>0) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    if (body.password.length < pwdMinLength) {
      return response.status(400).json({ error: `password must have at least ${pwdMinLength} characters` })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
      adult: body.adult === undefined ? true : body.adult
    })

    const saved = await user.save()
    response.status(201).json(saved)

  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

usersRouter.get('/:id', async (request, response) => {
  try{
    const id = request.params.id
    const singleUser = await User.findById(id)
    if (singleUser) response.status(200).json(User.format(singleUser))
    else response.status(404).end()

  } catch (exception) {
    //console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = usersRouter
