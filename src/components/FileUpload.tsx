import React, { FC } from 'react'

interface FileUploadProps {
  handleFileInput: (event: React.ChangeEvent<HTMLInputElement>) => void
  error: DOMException | null
}

const FileUpload: FC<FileUploadProps> = ({ handleFileInput, error }) => {
  return (
    <div>
      <input
        type="file"
        accept=".real, .txt"
        onChange={handleFileInput}
      />
      <div>
        {error?.toString()}
      </div>
    </div>
  )
}

export default FileUpload
