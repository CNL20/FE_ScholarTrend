import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './searchPage.module.css'

function SearchPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ keyword: '', author: '', journal: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    const params = new URLSearchParams(form)
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
            <label htmlFor="keyword" className={styles.label}>Keyword</label>
            <input
              id="keyword"
              className={styles.input}
              placeholder="e.g. machine learning, neural networks…"
              value={form.keyword}
              onChange={(event) => setForm((prev) => ({ ...prev, keyword: event.target.value }))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="author" className={styles.label}>Author</label>
            <input
              id="author"
              className={styles.input}
              placeholder="e.g. John Smith"
              value={form.author}
              onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="journal" className={styles.label}>Journal</label>
            <input
              id="journal"
              className={styles.input}
              placeholder="e.g. Nature, IEEE Access"
              value={form.journal}
              onChange={(event) => setForm((prev) => ({ ...prev, journal: event.target.value }))}
            />
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
