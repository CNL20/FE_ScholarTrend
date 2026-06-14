import { Link } from 'react-router-dom'
import styles from './PaperCard.module.css'

function PaperCard({ paper }) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Link to={`/papers/${paper.id}`}>{paper.title}</Link>
        </h3>
        <span className={styles.yearBadge}>{paper.year ?? 'N/A'}</span>
      </div>
      <div className={styles.authors}>
        {(paper.authors ?? []).map((author) => (
          <Link key={author} to={`/authors/${encodeURIComponent(author)}`} className={styles.authorPill}>
            {author}
          </Link>
        ))}
      </div>
      <p className={styles.journal}>{paper.journal || 'Unknown journal'}</p>
      <p className={styles.abstract}>{paper.abstract || 'No abstract available.'}</p>
    </article>
  )
}

export default PaperCard
