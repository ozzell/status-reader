/* eslint-disable @typescript-eslint/no-base-to-string */
import React, { FC } from 'react'
import FileUpload from 'components/FileUpload'
import { Link } from 'react-router-dom'
import { NEWLINE_REGEX } from 'utils/constants'

// @TODO Maybe handle '#'
const getPackageNames = (file: string): string[] => {
  return file
    .split(NEWLINE_REGEX)
    .filter(line => line.toLowerCase().includes('package:'))
    .map(line => line.split(':')[1].trim())
    .filter(line => !!line)
}

interface IndexPageProps {
  file: string | null
  handleFileInput: (event: React.ChangeEvent<HTMLInputElement>) => void
  error: DOMException | null
}

const IndexPage: FC<IndexPageProps> = ({ file, handleFileInput, error }) => {
  if (!file) {
    return <FileUpload handleFileInput={handleFileInput} error={error} />
  }

  return (
    <div>
      <h1>Index Page</h1>
      <ul>
        {getPackageNames(file)
          .sort((a, b) => a.localeCompare(b))
          .map(packageName =>
            <li key={packageName}>
              <Link to={packageName}>{packageName}</Link>
            </li>
          )}
      </ul>
    </div>
  )
}

export default IndexPage
