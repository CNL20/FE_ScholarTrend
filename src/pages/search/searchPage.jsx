import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './searchPage.module.css'

function SearchPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ query: '', searchType: 'All' })

  const handleSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams()

    if (form.query.trim()) params.set('query', form.query.trim())
    if (form.searchType !== 'All') params.set('searchType', form.searchType)

    navigate(`/search/results?${params.toString()}`)
  }

  return (
    <section className={styles.hero}>
      <h1 className={styles.heroTitle}>Discover Research</h1>
      <p className={styles.heroSubtitle}>
        Search millions of academic publications, authors, and journals
      </p>
      <div className={styles.panel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="query" className={styles.label}>Search query</label>
            <input
              id="query"
              className={styles.input}
              placeholder="e.g. machine learning, neural networks..."
              value={form.query}
              onChange={(event) => setForm((prev) => ({ ...prev, query: event.target.value }))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="searchType" className={styles.label}>Search in</label>
            <select
              id="searchType"
              className={styles.input}
              value={form.searchType}
              onChange={(event) => setForm((prev) => ({ ...prev, searchType: event.target.value }))}
            >
              <option value="All">All fields</option>
              <option value="Title">Title</option>
              <option value="Abstract">Abstract</option>
              <option value="Author">Author</option>
              <option value="Keyword">Keyword</option>
            </select>
          </div>
          <button type="submit" className={styles.button}>
            Search Publications
          </button>
        </form>
      </div>
    </section>
  )
}

export default SearchPage
