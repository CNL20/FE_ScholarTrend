import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { papers } from '../../data/mockData'
import styles from './paperDetailPage.module.css'

function PaperDetailPage() {
  const { paperId } = useParams()
  const [bookmarked, setBookmarked] = useState(false)

  const paper = useMemo(() => papers.find((item) => item.id === paperId), [paperId])

  if (!paper) {
    return <p className={styles.notFound}>Paper not found.</p>
  }

  return (
    <div className={styles.detailPage}>
      <article className={styles.panel}>
        <h1 className={styles.title}>{paper.title}</h1>

        <div className={styles.metaGrid}>
          <div className={styles.metaCard}>
            <div className={styles.metaLabel}>Authors</div>
            <div className={styles.metaValue}>{paper.authors.join(', ')}</div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaLabel}>Year</div>
            <div className={styles.metaValue}>{paper.year}</div>
          </div>
          <div className={styles.metaCard}>
            <div className={styles.metaLabel}>Journal</div>
            <div className={styles.metaValue}>{paper.journal}</div>
          </div>
        </div>

        <div className={styles.abstractSection}>
          <div className={styles.abstractLabel}>Abstract</div>
          <p className={styles.abstractText}>{paper.abstract}</p>
        </div>

        <button
          type="button"
          className={`${styles.button} ${bookmarked ? styles.bookmarked : ''}`}
          onClick={() => setBookmarked((prev) => !prev)}
        >
          {bookmarked ? 'Bookmarked' : 'Bookmark Paper'}
        </button>
      </article>
    </div>
  )
}

export default PaperDetailPage
