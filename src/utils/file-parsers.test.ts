import { getDepends, getDescription, getPackageNames, getReverseDepends } from './file-parsers'
import { DEPENDS, DESCRIPTION_TEXT, FILE, FILE2, FILE3, SECOND_TEST_PACKAGE_NAME, TEST_PACKAGE_NAME } from './test-utils'

describe('file-parsers.ts', () => {
  describe('getPackageNames', () => {
    test('returns array of package-names read from given file', () => {
      const packageNames = getPackageNames(FILE)
      expect(packageNames.length).toBe(2)
      expect(packageNames).toContain(TEST_PACKAGE_NAME)
      expect(packageNames).toContain(SECOND_TEST_PACKAGE_NAME)
    })
    test('returns empty array when no packageänames could be found', () => {
      const packageNames = getPackageNames('')
      expect(packageNames.length).toBe(0)
      expect(packageNames).toStrictEqual([])
    })
  })

  describe('getDescription', () => {
    test('returns correct text as part of returned array', () => {
      const description = getDescription(FILE, SECOND_TEST_PACKAGE_NAME)
      expect(description?.[0]).toContain(DESCRIPTION_TEXT)
    })
    test('returns undefined with non-existing package-name given', () => {
      const description = getDescription(FILE, 'non-existing-package')
      expect(description).toBe(undefined)
    })
  })

  describe('getDepends', () => {
    test('returns correct text as part of returned array', () => {
      const depends = getDepends(FILE, TEST_PACKAGE_NAME)
      expect(depends).toContain(DEPENDS)
    })
    test('returns undefined with non-existing package-name given', () => {
      const depends = getDepends(FILE, 'non-existing-package')
      expect(depends).toBe(undefined)
    })
  })

  describe('getReverseDepends', () => {
    test('returns empty array when non-existing package-name given', () => {
      const depends = getReverseDepends(FILE, 'non-existing-package')
      expect(depends.length).toBe(0)
      expect(depends).toStrictEqual([])
    })
    test('returns correct text as part of returned array when it is encircled by whitespace on the left and , on the right', () => {
      const depends = getReverseDepends(FILE, TEST_PACKAGE_NAME)
      expect(depends).toContain(SECOND_TEST_PACKAGE_NAME)
    })
    test('returns correct package name as part of returned array when it is encircled by whitespace', () => {
      const depends = getReverseDepends(FILE2, TEST_PACKAGE_NAME)
      expect(depends).toContain(SECOND_TEST_PACKAGE_NAME)
    })
    test('returns correct package name as part of returned array when it is encircled by |-charcters', () => {
      const depends = getReverseDepends(FILE3, TEST_PACKAGE_NAME)
      expect(depends).toContain(SECOND_TEST_PACKAGE_NAME)
    })
  })
})
