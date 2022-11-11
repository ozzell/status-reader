import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import { NEWLINE_REGEX, NEW_PAR_REGEX } from 'utils/constants'

const DESC_FIELD = 'description:'

const getParagraph = (file: string, packageName: string): string | undefined => {
  return file
    .split(NEW_PAR_REGEX)
    .find(paragraph =>
      paragraph
        .split(NEWLINE_REGEX)
        .find(line =>
          // @TODO Maybe escape other special chars too:
          // https://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
          line
            .replace(/\s*/g, '')
            .match(new RegExp('^' + 'package:' + packageName.replace(/\+/g, '\\+') + '$', 'i'))
        )
    )
}

const getDescription = (file: string, packageName: string): string[] | undefined => {
  const selectedParagraph = getParagraph(file, packageName)
  if (selectedParagraph) {
    const description = selectedParagraph
      .split(NEWLINE_REGEX)
      .reduce((acc: string[], currentLine: string, i: number) => {
        // Add line with `description:` to list
        if (currentLine.toLowerCase().includes(DESC_FIELD)) {
          return [...acc, currentLine]
        }
        // Don't add anything in this iteration if `description` has not been added to list
        if (!acc.some(line => line.toLowerCase().includes(DESC_FIELD))) {
          return [...acc]
        }
        // If previous addition to list was `description` or ` .`, then add this line to list
        // @TODO Maybe handle . (empty line inside description value)
        if (
          acc[acc.length - 1].toLowerCase().includes(DESC_FIELD) ||
          acc[acc.length - 1].substring(0, 1).match(/\s/g)
        ) {
          return currentLine.substring(0, 1).match(/\s/g)
            ? [...acc, currentLine]
            : [...acc]
        }
        return [...acc]
      }, [])
    return description
  }
}

const getDepends = (file: string, packageName: string): string | undefined => {
  const selectedParagraph = getParagraph(file, packageName)
  if (selectedParagraph) {
    return selectedParagraph
      .split(NEWLINE_REGEX)
      .find(line => line.toLowerCase().includes('depends:'))
  }
}

const getReverseDepends = (file: string, packageName: string): string | undefined => {
  return undefined
}

const PackageInfo: FC<{ file: string | null }> = ({ file }) => {
  const { name: packageName } = useParams()

  if (!packageName || !file) {
    return <p>No package found.</p>
  }

  const description = getDescription(file, packageName)
  const depends = getDepends(file, packageName)
  const reverseDepends = getReverseDepends(file, packageName)

  return (
    <div>
      <h1>{packageName}</h1>
      <div>
        <h2>Description</h2>
        {description?.map((line, i) => <p key={`${line}-${i}`}>{line.toLowerCase().includes(DESC_FIELD) ? line.split(':')[1] : line}</p>)}
      </div>
      <div>
        <h2>Depends</h2>
        {depends ? depends.split(':')[1] : null}
      </div>
    </div>
  )
}

export default PackageInfo
