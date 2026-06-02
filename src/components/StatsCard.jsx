import styles from './StatsCard.module.css'

function StatsCard({ label, value }) {
  return (
    <article className={styles.card}>
      <p className={styles.label}>{label}</p>
      <h3 className={styles.value}>{value}</h3>
    </article>
  )
}

export default StatsCard
