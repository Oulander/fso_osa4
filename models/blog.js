const mongoose = require('mongoose')

const Schema = mongoose.Schema
const blogSchema = new Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

blogSchema.statics.format = function(blog) {
  return {
    id: blog._id.toString(),
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: blog.user.toString()
  }
}

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
