const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const BLOG_USER_POPULATE = { username: 1, name: 1 }
const populateBlogUser = (blogOrQuery) =>
  blogOrQuery.populate('user', BLOG_USER_POPULATE)

blogsRouter.get('/', async (request, response) => {
  const blogs = await populateBlogUser(Blog.find({}))
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const body = request.body

  const blog = new Blog({ ...body, user: request.user._id })

  const savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()

  await populateBlogUser(savedBlog)
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (request.user._id.toString() !== blog.user.toString()) {
    return response
      .status(401)
      .json({ error: 'only creator of the blog can delete it' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const body = request.body

  if (body.likes === undefined) {
    return response.status(400).json({ error: 'likes are required' })
  }

  const blog = await populateBlogUser(Blog.findById(request.params.id))

  if (!blog) return response.status(404).end()
  blog.likes = body.likes

  const result = await blog.save()
  response.json(result)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'comment is required' })
  }

  const blog = await populateBlogUser(Blog.findById(request.params.id))

  if (!blog) return response.status(404).end()
  blog.comments = blog.comments.concat(body.content)

  const result = await blog.save()
  response.json(result)
})

module.exports = blogsRouter
