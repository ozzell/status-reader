import React, { FC, useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import IndexPage from 'modules/IndexPage'
import PackageInfo from 'modules/PackageInfo'

import './App.css'

const FILE_NAME = 'file'

const App: FC = () => {
  const [file, setFile] = useState<string | null>(null)
  const [error, setError] = useState<DOMException | null>(null)

  useEffect(() => {
    const fileFromStorage = sessionStorage.getItem(FILE_NAME)
    if (fileFromStorage) setFile(fileFromStorage)
  }, [])

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const inputFile = event.target.files?.[0]
    const reader = new FileReader()

    reader.onload = (event) => {
      const result = event?.target?.result
      if (result) {
        sessionStorage.setItem(FILE_NAME, result.toString())
        setFile(result.toString())
      }
    }
    reader.onerror = (event) => {
      const error = event?.target?.error
      if (error) setError(error)
    }

    if (inputFile) reader.readAsText(inputFile)
  }

  return (
    <div>
      <h1>Status Reader</h1>
    <Router>
      <Routes>
        <Route
          path="packages/:name"
          element={<PackageInfo file={file} />}
        />
        <Route
          path="packages"
          element={
            <IndexPage file={file} handleFileInput={handleFileInput} error={error} />
          }
        />
        <Route
          path="/"
          element={<Navigate to="packages" replace />}
        />
      </Routes>
    </Router>
    </div>
  )
}

export default App
