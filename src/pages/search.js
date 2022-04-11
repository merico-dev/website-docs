import '../styles/pages/search.scss'

import { Block, Button } from '@seagreenio/react-bulma'
import { FormattedMessage, useIntl } from 'gatsby-plugin-react-intl'
import React, { useEffect, useState } from 'react'
import { convertVersionName, ee, eeStable } from 'lib/version'
import { defaultDocInfo, setLoading, setSearchValue } from '../state'
import { useDispatch, useSelector } from 'react-redux'

import { Loading } from 'components/Loading'
import { SearchResult } from 'components/search/Result'
import { Seo } from 'components/Seo'
import { algoliaClient } from 'lib/algolia'
import clsx from 'clsx'
import { useLocation } from '@reach/router'

const matchToVersionList = match => {
  switch (match) {
    case 'ee':
      return ee
    default:
      return ee
  }
}

function replaceStableVersion(match) {
  switch (match) {
    case 'ee':
      return eeStable
    default:
      break
  }
}

const Search = () => {
  const intl = useIntl()
  const { locale } = intl

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const type = searchParams.get('type') || defaultDocInfo['type']
  const version = searchParams.get('version') || defaultDocInfo['version']
  const query = searchParams.get('q')

  const dispatch = useDispatch()

  const loading = useSelector(state => state.loading)

  const [selectedType, setSelectedType] = useState(type)
  const toAlgoliaVersion = version =>
    version === 'stable'
      ? convertVersionName(replaceStableVersion(selectedType))
      : version
  const [selectedVersion, _setSelectedVersion] = useState(
    toAlgoliaVersion(version)
  )
  const setSelectedVersion = version =>
    _setSelectedVersion(toAlgoliaVersion(version))
  const [selectedVersionList, setSelectedVersionList] = useState(
    matchToVersionList(type)
  )
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [docsTypesByLang, setDocsTypesByLang] = useState([])

  useEffect(() => {
    return () => dispatch(setSearchValue(''))
  }, [dispatch])

  useEffect(() => {
    const types = [
      {
        name: '企业版',
        match: 'ee',
      },
    ]

    setDocsTypesByLang(types)
  }, [intl, locale])

  const handleSetVersionList = match => () => {
    const versionList = matchToVersionList(match)

    setSelectedType(match)
    setSelectedVersionList(versionList)
    setSelectedVersion(versionList[0])
  }

  function execSearch() {
    dispatch(setLoading(true))

    const index = algoliaClient.initIndex(
      `${locale}-${selectedType}-${selectedVersion}`
    )

    index
      .search(query, {
        hitsPerPage: 150,
      })
      .then(({ hits }) => {
        setResults(hits)
        setSearched(true)
        dispatch(setLoading(false))
      })
  }

  useEffect(() => {
    if (selectedType && selectedVersion && query) {
      execSearch()
    } else {
      setResults([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedVersion, query])

  const TypeList = () => (
    <div className="list">
      {docsTypesByLang.map(type => (
        <Button
          key={type.name}
          color="white"
          size="small"
          className={clsx('item', selectedType === type.match && 'is-active')}
          onClick={handleSetVersionList(type.match)}
        >
          {type.name}
        </Button>
      ))}
    </div>
  )

  const VersionList = () => (
    <div className="list">
      {selectedVersionList.map(version => (
        <Button
          key={version}
          color="white"
          size="small"
          className={clsx(
            'item',
            selectedVersion === toAlgoliaVersion(version) && 'is-active'
          )}
          onClick={() => setSelectedVersion(toAlgoliaVersion(version))}
        >
          {toAlgoliaVersion(version)}
        </Button>
      ))}
    </div>
  )

  return (
    <>
      <Seo title="Search" />
      <div className="PingCAP-Docs-Search">
        <Block className="filter-panel">
          <Block>
            <div className="list-label">
              <FormattedMessage id="search.type" />
            </div>
            <TypeList />
          </Block>
          <Block>
            <div className="list-label">
              <FormattedMessage id="search.version" />
            </div>

            <VersionList />
          </Block>
        </Block>

        <Block style={{ position: 'relative' }}>
          <SearchResult results={results} searched={searched} />
          {loading && (
            <Loading
              stretched
              style={{ alignItems: 'start' }}
              imgProps={{
                style: {
                  marginTop: '2rem',
                },
              }}
            />
          )}
        </Block>
      </div>
    </>
  )
}

export default Search
