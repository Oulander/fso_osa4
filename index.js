const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
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
app.use('/api/blogs', blogsRouter)
app.use(middleware.logger)
app.use(middleware.error)

const server = http.createServer(app)
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
