import { useRef } from 'react'
import BlogForm from '../components/BlogForm'
import BlogList from '../components/BlogList'
import Togglable from '../components/Togglable'

const Home = () => {
  const blogFormRef = useRef()

  return (
    <div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
      <BlogList />
    </div>
  )
}
export default Home
