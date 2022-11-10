import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

test('Renders app heading element', () => {
  render(<App />)
  const headingElement = screen.getByText(/Status Reader/i)
  expect(headingElement).toBeInTheDocument()
})
