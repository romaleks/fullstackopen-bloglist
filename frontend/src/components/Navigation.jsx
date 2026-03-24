import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setUser } from '../reducers/userReducer'

const Navigation = () => {
  const user = useSelector(({ user }) => user)

  const dispatch = useDispatch()

  const handleLogout = () => {
    localStorage.removeItem('loggedBlogAppUser')
    dispatch(setUser(null))
  }

  return (
    <div
      style={{
        marginBottom: '15px',
        padding: '5px',
        display: 'flex',
        gap: '5px',
        background: 'lightGrey',
      }}
    >
      <Link to={'/'}>blogs</Link>
      <Link to={'/users'}>users</Link>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </div>
  )
}
export default Navigation
