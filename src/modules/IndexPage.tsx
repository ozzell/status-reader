/* eslint-disable @typescript-eslint/no-base-to-string */
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import FileUpload from 'components/FileUpload'
import { getPackageNames } from 'utils/file-parsers'

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
      <h2>Index Page</h2>
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
