import { notifications } from '../../data/mockData'
import styles from './simpleListPage.module.css'

function NotificationsPage() {
  return (
    <section className={styles.panel}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Notifications</h1>
      </div>
      <ul className={styles.list}>
        {notifications.map((item) => (
          <li key={item} className={styles.listItem}>
            <span className={styles.listItemText}>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default NotificationsPage
