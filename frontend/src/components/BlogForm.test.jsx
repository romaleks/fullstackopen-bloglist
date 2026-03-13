import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let createBlog
  let setNotification

  beforeEach(() => {
    createBlog = vi.fn()
    setNotification = vi.fn()

    render(
      <BlogForm createBlog={createBlog} setNotification={setNotification} />,
    )
  })

  test('after submitting the form, callback function executes with right props', async () => {
    const user = userEvent.setup()

    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')

    await user.type(titleInput, 'My test title')
    await user.type(authorInput, 'My test author')
    await user.type(urlInput, 'http://test.url')

    const createButton = screen.getByText('create')
    await user.click(createButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'My test title',
      author: 'My test author',
      url: 'http://test.url',
    })

    expect(setNotification).toHaveBeenCalledTimes(1)
    expect(setNotification).toHaveBeenCalledWith({
      message: 'a new blog My test title added',
      isSuccessful: true,
    })
  })
})
