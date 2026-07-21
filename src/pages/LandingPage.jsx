import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDashboardOverview } from '../services/dashboardService'
import styles from './LandingPage.module.css'

const features = [
  {
    title: 'Search & Discover',
    description:
      'Search millions of academic papers across journals, conferences, and preprint archives with powerful filters.',
  },
  {
    title: 'Trend Analysis',
    description:
      'Visualize publication activity by year, track emerging topics, and identify research hotspots in real time.',
  },
  {
    title: 'Smart Alerts',
    description:
      'Get notified when new papers match your interests, when bookmarked papers receive citations, and more.',
  },
]

function LandingPage() {
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    getDashboardOverview().then(setOverview).catch(() => {});
  }, []);

  const stats = [
    { value: overview ? overview.totalPapers.toLocaleString() : '-', label: 'Publications Indexed' },
    { value: overview ? overview.totalJournals.toLocaleString() : '-', label: 'Tracked Journals' },
    { value: overview ? overview.totalAuthors.toLocaleString() : '-', label: 'Active Researchers' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <p className={styles.badge}>
          Scientific Journal Publication Trend Tracking System
        </p>
        <h1 className={styles.heading}>
          Discover publication trends with{' '}
          <span className={styles.gradientText}>ScholarTrend</span>.
        </h1>
        <p className={styles.subtitle}>
          Search papers, visualize publication activity by year, and keep your
          personalized watchlist updated — all in one beautiful platform.
        </p>
        <div className={styles.actions}>
          <Link to="/search" className={styles.primary}>
            Start Searching
          </Link>
          <Link to="/pricing" className={styles.secondary}>
            View Premium Plans →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why ScholarTrend?</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <article key={feature.title} className={styles.featureCard}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>
            Ready to explore the future of research?
          </h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of researchers who trust ScholarTrend to stay ahead.
          </p>
          <div className={styles.ctaActions}>
            <Link 
              to={isAuthenticated ? "/dashboard" : "/login"} 
              className={styles.ctaBtnPrimary}
            >
              {isAuthenticated ? "Continue with Free Plan" : "Get Started — It's Free"}
            </Link>
            <Link to="/pricing" className={styles.ctaBtnPremium}>
              View Premium Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
