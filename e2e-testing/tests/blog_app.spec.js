const { test, expect, beforeEach, describe } = require('@playwright/test')
import { createBlog, loginWith } from './helper'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test user',
        username: 'test_user',
        password: '123',
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test_user', '123')
      await expect(page.getByText('Test user logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'test_user', 'wrong')

      const notification = page.getByTestId('notification')
      await expect(notification).toContainText('invalid username or password')
      await expect(notification).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Test user logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'test_user', '123')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Cool blog', 'John Doe', 'https://lol')

      const notification = page.getByTestId('notification')
      await expect(notification).toContainText('a new blog Cool blog added')
      await expect(notification).toHaveCSS('color', 'rgb(0, 128, 0)')
      await expect(page.getByText('Cool blog John Doe')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Cool blog', 'John Doe', 'https://lol')
      })

      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('blog can be removed', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        page.on('dialog', async (dialog) => {
          if (dialog.type() === 'confirm') {
            await dialog.accept()
          }
        })

        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Cool blog John Doe')).not.toBeVisible()
      })

      test('remove button visible only to the creator of the blog', async ({
        page,
        request,
      }) => {
        await request.post('/api/users', {
          data: {
            name: 'Other user',
            username: 'other_user',
            password: 'abc',
          },
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'other_user', 'abc')

        await page.getByRole('button', { name: 'view' }).click()
        await expect(
          page.getByRole('button', { name: 'remove' }),
        ).not.toBeVisible()
      })

      test('blogs are arranged in the order according to the likes', async ({
        page,
      }) => {
        await createBlog(page, 'Boring blog', 'Elon Musk', 'https://lollol')

        const boringBlog = page.getByTestId('blog-item').filter({
          hasText: 'Boring blog Elon Musk',
        })

        let blogItems = page.getByTestId('blog-item')
        await expect(blogItems.first()).toContainText('Cool blog John Doe')
        await expect(blogItems.last()).toContainText('Boring blog Elon Musk')

        await boringBlog.getByRole('button', { name: 'view' }).click()
        await boringBlog.getByRole('button', { name: 'like' }).click()

        blogItems = page.getByTestId('blog-item')
        await expect(blogItems.first()).toContainText('Boring blog Elon Musk')
        await expect(blogItems.last()).toContainText('Cool blog John Doe')
      })
    })
  })
})
