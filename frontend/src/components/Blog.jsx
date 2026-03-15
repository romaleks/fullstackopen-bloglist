import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, user }) => {
  const [isDetailsShown, setIsDetailsShown] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = async () => {
    const returnedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    })
    setBlogs(
      blogs.map((blog) => (blog.id === returnedBlog.id ? returnedBlog : blog)),
    )
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove "${blog.title}"?`)) {
      const blogToDelete = blog
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id))
    }
  }

  return (
    <div style={blogStyle} data-testid="blog-item">
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setIsDetailsShown(!isDetailsShown)}>
          {isDetailsShown ? 'hide' : 'view'}
        </button>
      </div>
      {isDetailsShown && (
        <>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {user.username === blog.user.username && (
            <button
              style={{ backgroundColor: 'red', color: 'white' }}
              onClick={handleDelete}
            >
              remove
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Blog
