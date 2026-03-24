import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'
import blogService from '../services/blogs'
import loginService from '../services/login'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (user) => {
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))

      setUsername('')
      setPassword('')
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || 'Wrong credentials'
      dispatch(setNotification(errorMessage, false, 5))
    },
  })

  const handleLogin = (event) => {
    event.preventDefault()
    loginMutation.mutate({ username, password })
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
}
export default LoginForm
