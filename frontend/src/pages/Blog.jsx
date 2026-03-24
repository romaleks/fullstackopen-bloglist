import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const user = useSelector(({ user }) => user)
  const [comment, setComment] = useState('')

  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['blogs'] })

      const previousBlogs = queryClient.getQueryData(['blogs'])

      queryClient.setQueryData(['blogs'], (oldBlogs = []) =>
        oldBlogs.map((item) =>
          item.id === variables.id ? { ...item, likes: item.likes + 1 } : item,
        ),
      )

      return { previousBlogs }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousBlogs) {
        queryClient.setQueryData(['blogs'], context.previousBlogs)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const handleLike = () => {
    likeMutation.mutate({
      id: blog.id,
      updatedBlog: {
        ...blog,
        likes: blog.likes + 1,
      },
    })
  }

  const deleteMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const navigate = useNavigate()

  const handleDelete = () => {
    if (window.confirm(`Remove "${blog.title}"?`)) {
      deleteMutation.mutate(blog.id)
      navigate('/')
    }
  }

  const commentMutation = useMutation({
    mutationFn: ({ id, content }) => blogService.addComment(id, content),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['blogs'] })

      const previousBlogs = queryClient.getQueryData(['blogs'])

      queryClient.setQueryData(['blogs'], (oldBlogs = []) =>
        oldBlogs.map((item) =>
          item.id === variables.id
            ? { ...item, comments: item.comments.concat(variables.content) }
            : item,
        ),
      )

      return { previousBlogs }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousBlogs) {
        queryClient.setQueryData(['blogs'], context.previousBlogs)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    const trimmedComment = comment.trim()
    if (!trimmedComment || commentMutation.isPending) {
      return
    }

    commentMutation.mutate({ id: blog.id, content: trimmedComment })
    setComment('')
  }

  if (!blog) {
    return <div>loading blog...</div>
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes} <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      {user.username === blog.user.username && (
        <button
          style={{ backgroundColor: 'red', color: 'white' }}
          onClick={handleDelete}
        >
          remove
        </button>
      )}
      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="submit"
          disabled={commentMutation.isPending || !comment.trim()}
        >
          {commentMutation.isPending ? 'adding...' : 'add comment'}
        </button>
      </form>
      <ul>
        {blog.comments.map((comment, i) => (
          <li key={i}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}
export default Blog
