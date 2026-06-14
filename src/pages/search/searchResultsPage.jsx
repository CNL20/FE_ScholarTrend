import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchResultsList from '../../components/SearchResultsList'
import Pagination from '../../components/Pagination'
import Skeleton from '../../components/Skeleton'
import { searchPapers } from '../../services/paperService'
import styles from './searchResultsPage.module.css'

function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const searchKey = searchParams.toString()
  const prevSearchKey = useRef(searchKey)
  const [papers, setPapers] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const isNewSearch = prevSearchKey.current !== searchKey
    if (isNewSearch) prevSearchKey.current = searchKey

    async function fetchResults() {
      setLoading(true)
      setError('')
      try {
        const query = searchParams.get('query') ?? searchParams.get('keyword') ?? ''
        const searchType = searchParams.get('searchType') ?? 'All'
        const currentPage = isNewSearch ? 1 : page
        if (isNewSearch) setPage(1)
        const params = { query, searchType, page: currentPage, pageSize: 10 }

        const result = await searchPapers(params)
        setPapers(result.items)
        setTotalCount(result.totalCount)
        setTotalPages(result.totalPages)
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load search results')
        setPapers([])
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, page])

  if (loading) {
    return (
      <section className={styles.resultsPage}>
        <div className={styles.pageHeader}>
          <Skeleton variant="title" width="40%" />
        </div>
        <Skeleton variant="card" count={3} />
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.resultsPage}>
        <p>{error}</p>
      </section>
    )
  }

  return (
    <section className={styles.resultsPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Search Results</h1>
        <p className={styles.summary}>
          Found <span className={styles.summaryCount}>{totalCount}</span> matching paper(s).
        </p>
      </div>
      <SearchResultsList papers={papers} />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  )
}

export default SearchResultsPage
