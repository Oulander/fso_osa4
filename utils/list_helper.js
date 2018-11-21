const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, currentItem) => {
    return sum + currentItem.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined
  let favoriteBlog = blogs.reduce((highestLikesBlog, currentBlog) => {
    if (highestLikesBlog.likes >= currentBlog.likes) {
      return highestLikesBlog
    }
    else return currentBlog
  })

  favoriteBlog = {
    'title': favoriteBlog.title,
    'author': favoriteBlog.author,
    'url': favoriteBlog.url,
    'likes': favoriteBlog.likes
  }

  return favoriteBlog
}


const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined
  const authors = blogs.reduce((authorsSoFar, currentBlog) => {
    if (authorsSoFar[currentBlog.author]) authorsSoFar[currentBlog.author] += 1
    else authorsSoFar[currentBlog.author] = 1
    return authorsSoFar
  }, {})

  const highestValueIndex = indexOfMax(Object.values(authors))
  let mostBlogsAuthor = Object.entries(authors)[highestValueIndex]

  mostBlogsAuthor = {
    'author': mostBlogsAuthor[0],
    'blogs': mostBlogsAuthor[1]
  }

  return mostBlogsAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return undefined
  const authors = blogs.reduce((authorsSoFar, currentBlog) => {
    if (authorsSoFar[currentBlog.author]) authorsSoFar[currentBlog.author] += currentBlog.likes
    else authorsSoFar[currentBlog.author] = currentBlog.likes
    return authorsSoFar
  }, {})

  const highestValueIndex = indexOfMax(Object.values(authors))
  let mostLikesAuthor = Object.entries(authors)[highestValueIndex]

  mostLikesAuthor = {
    'author': mostLikesAuthor[0],
    'likes': mostLikesAuthor[1]
  }

  console.log(mostLikesAuthor)

  return mostLikesAuthor
}

// from https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1
  }

  var max = arr[0]
  var maxIndex = 0

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i
      max = arr[i]
    }
  }

  return maxIndex
}


module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
