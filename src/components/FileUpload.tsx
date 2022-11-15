import React, { FC } from 'react'

interface FileUploadProps {
  id: string
  handleFileInput: (event: React.ChangeEvent<HTMLInputElement>) => void
  error: DOMException | null
}

const FileUpload: FC<FileUploadProps> = ({ id, handleFileInput, error }) => {
  return (
    <div>
      <input
        id={id}
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
