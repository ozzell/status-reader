import React, { FC, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DESC_FIELD } from 'utils/constants'
import { getDepends, getDescription, getPackageNames, getReverseDepends, parseDepends } from 'utils/file-parsers'

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
      <Link to="/">Index Page</Link>
      <h2>Package: {packageName}</h2>
      <div>
        <h3>Description</h3>
        <p>{descriptionUi}</p>
      </div>
      <div>
        <h3>Depends</h3>
        <ul>
          {depends ? dependsUi(depends, file) : <li>(This package has no dependencies)</li>}
        </ul>
      </div>
      <div>
        <h3>Depended by</h3>
        {!showReverseDepends &&
          <div>
            <button data-testid="reverse-deps-btn" onClick={() => setShowReverseDepends(true)}>Load reverse dependencies</button>
            <p>This may take a few seconds...</p>
          </div>
         }
        <ul>
        {reverseDepends
          ? dependsUi(reverseDepends, file)
          : !showReverseDepends ?? <li>(No packages dependent on this package)</li>
        }
        </ul>
      </div>
    </div>
  )
}

export default PackageInfo
