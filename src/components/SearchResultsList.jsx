import PaperCard from './PaperCard'
import styles from './SearchResultsList.module.css'

function SearchResultsList({ papers }) {
  if (!papers.length) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>No papers found for the current criteria.</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>
  )
}

export default SearchResultsList
