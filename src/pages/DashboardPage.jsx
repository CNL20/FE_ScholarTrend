import StatsCard from '../components/StatsCard'
import { quickStats, trendingTopics } from '../data/mockData'
import styles from './dashboardPage.module.css'

const quickActions = [
  { label: 'Search Papers' },
  { label: 'View Trends' },
  { label: 'Bookmarks' },
  { label: 'Settings' },
]

function DashboardPage() {
  const userName = localStorage.getItem('userName') || 'Researcher'

  return (
    <section className={styles.dashboard}>
      {/* Welcome Header */}
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>
          Welcome back, <span className={styles.nameHighlight}>{userName}</span>
        </h1>
        <p className={styles.welcomeSubtitle}>
          Here&apos;s what&apos;s happening in your research world today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {quickStats.map((item) => (
          <StatsCard
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <article className={styles.panel}>
        <h2 className={styles.panelTitle}>Quick Actions</h2>
        <div className={styles.quickActions}>
          {quickActions.map((action) => (
            <button key={action.label} className={styles.actionBtn}>
              <span className={styles.actionLabel}>{action.label}</span>
            </button>
          ))}
        </div>
      </article>

      {/* Trending Topics */}
      <article className={styles.panel}>
        <h2 className={styles.panelTitle}>Trending Topics</h2>
        <div className={styles.topicsGrid}>
          {trendingTopics.map((topic) => (
            <span key={topic} className={styles.topicPill}>
              {topic}
            </span>
          ))}
        </div>
      </article>
    </section>
  )
}

export default DashboardPage
