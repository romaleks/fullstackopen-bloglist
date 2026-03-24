import { useQuery } from '@tanstack/react-query'
import Blog from './Blog'
import blogService from '../services/blogs'

const BlogList = () => {
  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (result.isLoading) {
    return <div>loading blogs...</div>
  }

  const blogs = result.data

  return (
    <div>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} blogs={blogs} />
        ))}
    </div>
  )
}
export default BlogList
