import React, { FC, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DESC_FIELD } from 'utils/constants'
import { getDepends, getDescription, getPackageNames, getReverseDepends, parseDepends } from 'utils/file-parsers'

// @ TODO Add `back to index page´link
const PackageInfo: FC<{ file: string | null }> = ({ file }) => {
  const { name: packageName } = useParams()
  const [showReverseDepends, setShowReverseDepends] = useState(false)

  const splitAltDeps = useMemo(() => (dep: string, file: string): Array<JSX.Element | string> =>
    dep.split('|').map(altDep =>
      getPackageNames(file).includes(altDep)
        ? <Link key={dep} onClick={() => setShowReverseDepends(false)} to={`/packages/${dep}`}>{altDep}</Link>
        : altDep
    ), [])

  const dependsUi = useMemo(() => (deps: string[] | null, file: string): JSX.Element[] | undefined =>
    deps?.map((dep, i) =>
      // @ TODO Maybe add pipe to alternative deps
      <li key={`${dep}-${i}`}>{getPackageNames(file).includes(dep)
        ? <Link onClick={() => setShowReverseDepends(false)} to={`/packages/${dep}`}>{dep}</Link>
        : splitAltDeps(dep, file).map(d => typeof d === 'string' ? ` ${d} ` : d)}
      </li>
    ), [])

  if (!packageName || !file) {
    return <p>No package found.</p>
  }

  const description = getDescription(file, packageName)
  const descriptionUi = description
    ?.map((line, i) =>
      <span key={`${line}-${i}`}>
        {line.toLowerCase().includes(DESC_FIELD) ? line.split(':')[1] : line.replace(/\s[.]/, '')}<br />
      </span>
    )

  const dependsString = getDepends(file, packageName)
  const depends = parseDepends(dependsString)

  const reverseDepends = showReverseDepends ? getReverseDepends(file, packageName) : null

  return (
    <div>
      <h1>{packageName}</h1>
      <div>
        <h2>Description</h2>
        {descriptionUi}
      </div>
      <div>
        <h2>Depends</h2>
        <ul>
          {depends ? dependsUi(depends, file) : <li>(This package has no dependencies)</li>}
        </ul>
      </div>
      <div>
        <h2>Depended by</h2>
        <button disabled={showReverseDepends} onClick={() => setShowReverseDepends(true)}>Load reverse dependencies</button>
        {!showReverseDepends && <p>This may take a few seconds...</p>}
        <ul>
        { reverseDepends ? dependsUi(reverseDepends, file) : !showReverseDepends ?? <li>(No packages dependent on this package)</li> }
        </ul>
      </div>
    </div>
  )
}

export default PackageInfo
