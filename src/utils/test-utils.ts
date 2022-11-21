/** Testing resources used by all test files */

export const TEST_PACKAGE_NAME = 'package-1'
export const SECOND_TEST_PACKAGE_NAME = 'package-2'
export const DESCRIPTION_TEXT = 'This package contains the Linux kernel image for version 3.2.0 on64 bit x86 SMP.'

// Contains correct syntax for multiline paragraph in control files (newlines followed by whitespace)
export const LONG_DESCRIPTION_TEXT = `query and manipulate user account information
 The AccountService project provides a set of D-Bus
 interfaces for querying and manipulating user account
 information and an implementation of these interfaces,
 based on the useradd, usermod and userdel commands.`

export const DEPENDS_ARRAY = ['libc6', 'libkrb5support0']
export const DEPENDS = `${DEPENDS_ARRAY[0]} (>= 2.14), ${DEPENDS_ARRAY[1]} (>= 1.7dfsg~beta2)`

export const FILE = `Package: ${TEST_PACKAGE_NAME}\nDescription: ${LONG_DESCRIPTION_TEXT}\nDepends: ${DEPENDS}\n
package:${SECOND_TEST_PACKAGE_NAME}\nDescription: ${DESCRIPTION_TEXT} 2.\nDepends: ${TEST_PACKAGE_NAME}, initramfs-tools (>= 0.36ubuntu6), crda (>= 1.1.1-1ubuntu2) | wireless-crda`
