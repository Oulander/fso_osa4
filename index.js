const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}


mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then( () => {
    console.log('connected to database')
  })

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build)'))
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.logger)
app.use(middleware.error)

const server = http.createServer(app)

// This if clause is needed for supertest to not throw EADDRINUSE, as supertest
// does its own listening, and this one messes up with that. Another (maybe better)
// option would be to separate the server code above to a separate module and just do this
// listening in index.js. Supertest would then just use the server module and not this file.
// See https://blog.campvanilla.com/jest-expressjs-and-the-eaddrinuse-error-bac39356c33a
// including comments.
if (!module.parent) {
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
  })
}
server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
