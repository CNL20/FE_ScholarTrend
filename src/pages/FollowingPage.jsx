import { following } from '../data/mockData'
import styles from './SimpleListPage.module.css'

function FollowingPage() {
  return (
    <section className={styles.panel}>
      <h1>My Following</h1>
      <ul>
        {following.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export default FollowingPage
