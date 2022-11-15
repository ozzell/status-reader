import { DESC_FIELD, NEWLINE_REGEX, NEW_PAR_REGEX } from './constants'

// @TODO Maybe handle '#'
export const getPackageNames = (file: string): string[] => {
  return file
    .split(NEWLINE_REGEX)
    .filter(line => line.toLowerCase().includes('package:'))
    .map(line => line.split(':')[1].trim())
    .filter(line => !!line)
}

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
            .match(new RegExp(`^package:\\s*${packageName.replace(/\+/g, '\\+')}$`, 'i'))
        )
    )
}

export const getDescription = (file: string, packageName: string): string[] | undefined => {
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

export const getDepends = (file: string, packageName: string): string | undefined => {
  const selectedParagraph = getParagraph(file, packageName)
  if (selectedParagraph) {
    return selectedParagraph
      .split(NEWLINE_REGEX)
      .find(line => line.toLowerCase().includes('depends:'))
  }
}

// @ TODO Think about regex perf: https://www.loggly.com/blog/five-invaluable-techniques-to-improve-regex-performance/
export const parseDepends = (dependsString: string | undefined): string[] | null => {
  return dependsString
    ? dependsString.split(':').filter((part, i) => i !== 0).join()
      .replace(/\s+\|\s+/g, '|')
      .replace(/\s*\((.*?)\)\s*/g, '')
      .replace(/,/g, '')
      .trim()
      .split(/\s/)
      .filter(dep => dep && !dep.match(/\s/))
    : null
}

export const getReverseDepends = (file: string, packageName: string): string[] | undefined => {
  return getPackageNames(file)
    .filter(name => {
      const paragraph = getParagraph(file, name)
      return paragraph?.toLowerCase()?.includes('depends:') && paragraph?.toLowerCase()?.includes(packageName)
    })
}
