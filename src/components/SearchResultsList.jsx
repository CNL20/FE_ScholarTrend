import PaperCard from './PaperCard'
import styles from './SearchResultsList.module.css'

function SearchResultsList({ papers }) {
  if (!papers.length) {
    return <p className={styles.empty}>No papers found for the current criteria.</p>
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
