import React, { FC } from 'react'
import { useParams } from 'react-router-dom'

const PackageInfo: FC<{ file: string | null }> = ({ file }) => {
  const { name } = useParams()
  return (
    <div>
      {name}
    </div>
  )
}

export default PackageInfo
