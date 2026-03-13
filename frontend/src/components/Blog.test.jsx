import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'

vi.mock('../services/blogs', () => ({
  default: {
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('<Blog />', () => {
  let setBlogs
  const blog = {
    id: '123',
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 0,
    user: {
      name: 'name',
      username: 'username',
      token: 'token',
    },
  }

  beforeEach(() => {
    setBlogs = vi.fn()
    blogService.update.mockResolvedValue({ ...blog, likes: blog.likes + 1 })

    render(
      <Blog
        blog={blog}
        blogs={[blog]}
        user={{
          name: 'name',
          username: 'username',
          token: 'token',
        }}
        setBlogs={setBlogs}
      />,
    )
  })

  test('renders only title and author by default', () => {
    screen.getByText('title author')

    const urlElement = screen.queryByText('url')
    const likesElement = screen.queryByText('likes 0')
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })

  test('after clicking the button, details are displayed', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    screen.queryByText('url')
    screen.queryByText('likes 0')
  })

  test('after clicking the like button twice, handleLike runs twice', async () => {
    blogService.update.mockClear()

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(blogService.update).toHaveBeenCalledTimes(2)
    expect(setBlogs).toHaveBeenCalledTimes(2)
  })
})
