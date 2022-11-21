import React from 'react'
import { render, screen } from '@testing-library/react'
import PackageInfo from './PackageInfo'
import ReactRouter, { BrowserRouter } from 'react-router-dom'

const TEST_PACKAGE_NAME = 'test-package'
// Contains correct syntax for multiline paragraph in control files (newlines followed by whitespace)
const DESCRIPTION_TEXT = `query and manipulate user account information
 The AccountService project provides a set of D-Bus
 interfaces for querying and manipulating user account
 information and an implementation of these interfaces,
 based on the useradd, usermod and userdel commands.`
const DEPENDS = 'libc6 (>= 2.14), libkrb5support0 (>= 1.7dfsg~beta2)'
const DEPENDS_ARRAY = ['libc6', 'libkrb5support0']

const FILE = `Package:${TEST_PACKAGE_NAME}\nDescription: ${DESCRIPTION_TEXT}\nDepends: ${DEPENDS}
Package: test-pack-2\nDescription: descrition 2.\nDepends: initramfs-tools (>= 0.36ubuntu6), crda (>= 1.1.1-1ubuntu2) | wireless-crda`
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
    DESCRIPTION_TEXT.split('\n')
      .forEach((line) => expect(screen.getByText(line.trim())))
    expect(screen.getByText(/depends/i))
    DEPENDS_ARRAY
      .forEach(dep => expect(screen.getByText(dep)))
    expect(screen.getByText(/depended by/i))
    expect(screen.getByTestId('reverse-deps-btn'))
  })
})
