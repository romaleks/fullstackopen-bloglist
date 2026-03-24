import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useMatch } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Navigation from './components/Navigation'
import Notification from './components/Notification'
import Blog from './pages/Blog'
import Home from './pages/Home'
import User from './pages/User'
import Users from './pages/Users'
import { setUser } from './reducers/userReducer'
import blogService from './services/blogs'
import userService from './services/users'

const App = () => {
  const user = useSelector(({ user }) => user)

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })
  const users = usersQuery.data ?? []

  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })
  const blogs = blogsQuery.data ?? []

  const dispatch = useDispatch()

  const userMatch = useMatch('/users/:id')
  const blogMatch = useMatch('/blogs/:id')

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }, [])

  const foundUser = userMatch
    ? users.find((user) => user.id === userMatch.params.id)
    : null

  const foundBlog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null

  return (
    <div>
      <Notification />
      {!user && (
        <div>
          <h2>Log in to application</h2>
          <LoginForm />
        </div>
      )}
      {user && (
        <div>
          <h2>Blogs</h2>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User user={foundUser} />} />
            <Route path="/blogs/:id" element={<Blog blog={foundBlog} />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
