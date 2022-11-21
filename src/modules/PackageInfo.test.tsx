import React from 'react'
import { render, screen } from '@testing-library/react'
import PackageInfo from './PackageInfo'
import ReactRouter, { BrowserRouter } from 'react-router-dom'
import { DEPENDS_ARRAY, FILE, LONG_DESCRIPTION_TEXT, TEST_PACKAGE_NAME } from 'utils/test-utils'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom')
}))

beforeEach(() => {
  jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ name: TEST_PACKAGE_NAME })
})

describe('PackageInfo', () => {
  test('renders generic not found string when provided with `null` file', () => {
    render(<PackageInfo file={null} />, { wrapper: BrowserRouter })
    expect(screen.getByText('No package found.'))
  })

  test('returns generic not found string when provided with `undefined` package-name', () => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ name: undefined })
    render(<PackageInfo file={FILE} />, { wrapper: BrowserRouter })
    expect(screen.getByText('No package found.'))
  })

  test('renders expected package-name, ´description´, ´depends´ and ´dependend by´ fields from provided file', () => {
    render(<PackageInfo file={FILE} />, { wrapper: BrowserRouter })
    expect(screen.getByText(`Package: ${TEST_PACKAGE_NAME}`))
    expect(screen.getByText(/description/i))
    LONG_DESCRIPTION_TEXT.split('\n')
      .forEach((line) => expect(screen.getByText(line.trim())))
    expect(screen.getByText(/depends/i))
    DEPENDS_ARRAY
      .forEach(dep => expect(screen.getByText(dep)))
    expect(screen.getByText(/depended by/i))
    expect(screen.getByTestId('reverse-deps-btn'))
  })
})
