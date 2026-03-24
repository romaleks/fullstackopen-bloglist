import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const BlogForm = ({ blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatch(setNotification(`a new blog ${variables.title} added`, true, 5))

      setTitle('')
      setAuthor('')
      setUrl('')
      blogFormRef?.current?.toggleVisibility()
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error || error.message || 'An error occurred'
      dispatch(setNotification(errorMessage, false, 5))
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    newBlogMutation.mutate({ title, author, url })
  }

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            title:
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}
export default BlogForm
