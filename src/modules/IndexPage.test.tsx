import React from 'react'
import { render, screen, within } from '@testing-library/react'
import IndexPage from './IndexPage'
import { BrowserRouter } from 'react-router-dom'
import { FILE, SECOND_TEST_PACKAGE_NAME, TEST_PACKAGE_NAME } from 'utils/test-utils'

describe('IndexPage', () => {
  test('renders file-uploader when provided with ´null´-file', () => {
    render(<IndexPage file={null} handleFileInput={jest.fn} error={null} />)
    expect(screen.getByText(/upload a status file/i))
    expect(screen.getByTestId('file-uploader'))
  })

  test('renders with page title and a list containing package-names from the provided file', () => {
    render(<IndexPage file={FILE} handleFileInput={jest.fn} error={null} />, { wrapper: BrowserRouter })
    expect(screen.getByText(/index page/i))

    const list = screen.getByRole('list')
    expect(within(list).getByText(TEST_PACKAGE_NAME))
    expect(within(list).getByText(SECOND_TEST_PACKAGE_NAME))
    expect(within(list).queryAllByRole('listitem').length).toBe(2)
  })

  test('renders with page title and nothing else when file does not include package-names', () => {
    render(<IndexPage file={'just a string of text'} handleFileInput={jest.fn} error={null} />, { wrapper: BrowserRouter })
    expect(screen.getByText(/index page/i))
    const list = screen.getByRole('list')
    const items = within(list).queryAllByRole('listitem')
    expect(items.length).toBe(0)
  })
})
