import { DEPENDS_FIELD, DESC_FIELD, NEWLINE_REGEX, NEW_PAR_REGEX } from './constants'

/** Throws error up, which gets catched in the ErrorBoundary */
const forbiddenFirstChars = (line: string | undefined): boolean => {
  const firstChar = line?.trim().charAt(0)
  if (firstChar === '#' || firstChar === '-') {
    throw new Error('Reading file: Forbidden first character in field name ( # or - )')
  }
  return true
}

export const getPackageNames = (file: string): string[] => {
  return file
    .split(NEWLINE_REGEX)
    .filter(line => line.toLowerCase().includes('package:'))
    .filter(forbiddenFirstChars)
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
        // Adds line with `description:` to list
        if (currentLine.toLowerCase().includes(DESC_FIELD)) {
          forbiddenFirstChars(currentLine)
          return [...acc, currentLine]
        }
        // Doesn't add anything in this iteration if `description` has not been added to list
        if (!acc.some(line => line.toLowerCase().includes(DESC_FIELD))) {
          return [...acc]
        }
        // If previous addition to list was `description` or ` .`, then adds this line to list
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
    const depends = selectedParagraph
      .split(NEWLINE_REGEX)
      .find(line => line.toLowerCase().includes(DEPENDS_FIELD))
    forbiddenFirstChars(depends)
    return depends
  }
}

export const parseDepends = (dependsString: string | undefined): string[] | null => {
  return dependsString
    ? dependsString.split(':').filter((part, i) => i !== 0).join()
      .replace(/\s+\|\s+/g, '|')
      .replace(/\s*\((.*?)\)\s*|,/g, '')
      .trim()
      .split(/\s/)
      .filter(dep => dep && !dep.match(/\s/))
    : null
}

export const getReverseDepends = (file: string, packageName: string): string[] => {
  return getPackageNames(file)
    .filter(name => name !== packageName)
    .filter(name => {
      const paragraph = getParagraph(file, name)
      const dependsString = paragraph?.split('\n').find(p =>
        p?.toLowerCase()?.includes(DEPENDS_FIELD) &&
        p?.match(new RegExp(`[\\s+|\\s+,]${packageName.replace(/\+/g, '\\+')}[\\s+|,\\s+]`, 'i')))
      if (dependsString) {
        forbiddenFirstChars(paragraph)
        return true
      }
      return false
    })
}
