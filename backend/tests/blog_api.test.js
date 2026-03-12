const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  let token

  beforeEach(async () => {
    await User.deleteMany({})
    const user = await helper.createTestUser()
    token = helper.generateToken(user)

    await Blog.deleteMany({})
    const blogsWithUser = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: user._id,
    }))
    await Blog.insertMany(blogsWithUser)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named "id"', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      assert.ok(blog.id, 'Blog should have an id property')
      assert.strictEqual(typeof blog.id, 'string', 'id should be a string')
      assert.ok(!blog._id, 'Blog should not have _id property')
      assert.ok(!blog.__v, 'Blog should not have __v property')
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'New Blog Post',
        author: 'John Doe',
        url: 'http://example.com/new-blog-post',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: `Bearer ${token}` })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((b) => b.title)
      assert.ok(
        titles.includes('New Blog Post'),
        'New blog title should be saved',
      )
    })

    test('sets a value of "likes" property to 0 if it is missing', async () => {
      const newBlog = {
        title: 'New Blog Post',
        author: 'John Doe',
        url: 'http://example.com/new-blog-post',
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .set({ Authorization: `Bearer ${token}` })
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status code 400 if data invalid', async () => {
      const newBlog1 = {
        author: 'John Doe',
        url: 'http://example.com/new-blog-post',
        likes: 5,
      }

      const newBlog2 = {
        title: 'New Blog Post',
        author: 'John Doe',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog1)
        .set({ Authorization: `Bearer ${token}` })
        .expect(400)

      await api
        .post('/api/blogs')
        .send(newBlog2)
        .set({ Authorization: `Bearer ${token}` })
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 if token is not provided', async () => {
      const newBlog = {
        title: 'New Blog Post',
        author: 'John Doe',
        url: 'http://example.com/new-blog-post',
      }

      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map((n) => n.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    })
  })

  describe('updation of a blog', () => {
    test('succeeds with status code 204 if id and data is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: 5 })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(updatedBlog.body.likes, 5)
    })

    test('fails with status code 400 if "likes" is missing', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api.put(`/api/blogs/${blogToUpdate.id}`).send({}).expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
