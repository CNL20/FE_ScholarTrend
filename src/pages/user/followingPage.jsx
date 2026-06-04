import { following } from '../../data/mockData'
import styles from './simpleListPage.module.css'

function FollowingPage() {
  return (
    <section className={styles.panel}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>My Following</h1>
      </div>
      <ul className={styles.list}>
        {following.map((item) => (
          <li key={item} className={styles.listItem}>
            <span className={styles.listItemText}>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default FollowingPage
