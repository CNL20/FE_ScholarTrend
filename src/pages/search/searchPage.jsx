import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './searchPage.module.css'

function SearchPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    query: '',
    searchType: 'All',
    yearFrom: '',
    yearTo: '',
    minCitations: '',
    pageSize: '10',
  })
  const [error, setError] = useState('')

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    const yearFrom = form.yearFrom ? Number(form.yearFrom) : null
    const yearTo = form.yearTo ? Number(form.yearTo) : null

    if (yearFrom && yearTo && yearFrom > yearTo) {
      setError('The start year cannot be later than the end year.')
      return
    }

    const params = new URLSearchParams()
    if (form.query.trim()) params.set('query', form.query.trim())
    if (form.searchType !== 'All') params.set('searchType', form.searchType)
    if (form.yearFrom) params.set('yearFrom', form.yearFrom)
    if (form.yearTo) params.set('yearTo', form.yearTo)
    if (form.minCitations) params.set('minCitations', form.minCitations)
    params.set('page', '1')
    params.set('pageSize', form.pageSize)

    navigate(`/search/results?${params.toString()}`)
  }

  return (
    <section className={styles.searchPage}>
      <div className={styles.hero}>
        <span className={styles.eyebrow}>Academic discovery</span>
        <h1 className={styles.heroTitle}>Find research that moves your work forward</h1>
        <p className={styles.heroSubtitle}>
          Search publications by title, abstract, author, keyword, year, and citation impact.
        </p>
      </div>

      <div className={styles.panel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.mainSearch}>
            <label htmlFor="query" className={styles.label}>Search publications</label>
            <div className={styles.searchRow}>
              <input
                id="query"
                className={styles.searchInput}
                placeholder="Try machine learning, cloud computing, or an author name"
                value={form.query}
                onChange={handleChange('query')}
                autoFocus
              />
              <select
                id="searchType"
                className={styles.typeSelect}
                aria-label="Search field"
                value={form.searchType}
                onChange={handleChange('searchType')}
              >
                <option value="All">All fields</option>
                <option value="Title">Title</option>
                <option value="Abstract">Abstract</option>
                <option value="Author">Author</option>
                <option value="Keyword">Keyword</option>
                <option value="Journal">Journal</option>
              </select>
            </div>
          </div>

          <div className={styles.filterHeader}>
            <span>Refine results</span>
            <small>All filters are optional</small>
          </div>

          <div className={styles.filterGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="yearFrom" className={styles.label}>From year</label>
              <input
                id="yearFrom"
                className={styles.input}
                type="number"
                min="1900"
                max="2100"
                placeholder="e.g. 2020"
                value={form.yearFrom}
                onChange={handleChange('yearFrom')}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="yearTo" className={styles.label}>To year</label>
              <input
                id="yearTo"
                className={styles.input}
                type="number"
                min="1900"
                max="2100"
                placeholder="e.g. 2026"
                value={form.yearTo}
                onChange={handleChange('yearTo')}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="minCitations" className={styles.label}>Minimum citations</label>
              <input
                id="minCitations"
                className={styles.input}
                type="number"
                min="0"
                placeholder="e.g. 10"
                value={form.minCitations}
                onChange={handleChange('minCitations')}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="pageSize" className={styles.label}>Results per page</label>
              <select
                id="pageSize"
                className={styles.input}
                value={form.pageSize}
                onChange={handleChange('pageSize')}
              >
                <option value="10">10 results</option>
                <option value="20">20 results</option>
                <option value="50">50 results</option>
              </select>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formFooter}>
            <p>Leave the search box empty to browse all publications.</p>
            <button type="submit" className={styles.button}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m21 19.6-4.8-4.8a7.5 7.5 0 1 0-1.4 1.4l4.8 4.8L21 19.6ZM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z" />
              </svg>
              Search publications
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default SearchPage
