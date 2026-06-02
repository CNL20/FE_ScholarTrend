import { Link } from 'react-router-dom'
import styles from './PaperCard.module.css'

function PaperCard({ paper }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>
        <Link to={`/papers/${paper.id}`}>{paper.title}</Link>
      </h3>
      <p className={styles.meta}>
        {paper.authors.join(', ')} • {paper.journal} • {paper.year}
      </p>
      <p className={styles.abstract}>{paper.abstract}</p>
    </article>
  )
}

export default PaperCard
