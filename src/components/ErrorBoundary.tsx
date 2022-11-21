import React from 'react'
import { FILE_NAME } from 'utils/constants'

interface Props {
  children: React.ReactNode
}

class ErrorBoundary extends React.Component<Props> {
  state = { hasError: false, error: { message: '' } }

  static getDerivedStateFromError (error: { message: string }): { hasError: boolean, error: { message: string } } {
    return { hasError: true, error }
  }

  componentDidCatch (error: any, errorInfo: any): void {
    console.error({ error, errorInfo })
    this.state.hasError && sessionStorage.removeItem(FILE_NAME)
  }

  render (): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Error occurred</h1>
          <p>{this.state?.error?.message}</p>
          <p>The file has been removed from session storage so you can upload a new one.</p>
          <a href="/">Go back to home page</a>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
