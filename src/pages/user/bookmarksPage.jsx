import SearchResultsList from '../../components/SearchResultsList'
import { papers } from '../../data/mockData'
import styles from './simpleListPage.module.css'

function BookmarksPage() {
  return (
    <section className={styles.panel}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Bookmarks</h1>
      </div>
      <SearchResultsList papers={papers.slice(0, 2)} />
    </section>
  )
}

export default BookmarksPage
