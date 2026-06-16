import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminStats, getSyncLogs } from "../../services/adminService";
import styles from "./AdminDashboardPage.module.css";

const metricDefinitions = [
  {
    key: "users",
    label: "Total users",
    helper: "Registered accounts",
    aliases: ["totalUsers", "userCount", "users"],
    icon: "users",
    tone: "green",
  },
  {
    key: "papers",
    label: "Research papers",
    helper: "Indexed publications",
    aliases: ["totalPapers", "paperCount", "papers"],
    icon: "papers",
    tone: "blue",
  },
  {
    key: "topics",
    label: "Tracked topics",
    helper: "Active research areas",
    aliases: ["totalTopics", "topicCount", "topics", "keywords"],
    icon: "topics",
    tone: "amber",
  },
  {
    key: "active",
    label: "Active accounts",
    helper: "Available to sign in",
    aliases: ["activeUsers", "activeUserCount", "activeAccounts"],
    icon: "activity",
    tone: "violet",
  },
];

function Icon({ name, size = 20 }) {
  const paths = {
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      </>
    ),
    papers: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h8M8 17h6" />
      </>
    ),
    topics: (
      <>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="8" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </>
    ),
    activity: (
      <>
        <path d="M3 12h4l2-7 4 14 2-7h6" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    database: (
      <>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v7c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12v7c0 1.66 4.03 3 9 3s9-1.34 9-3v-7" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  );
}

function getMetricValue(stats, aliases) {
  for (const key of aliases) {
    if (stats?.[key] !== undefined && stats[key] !== null) {
      const value = stats[key];
      return typeof value === "number" ? value.toLocaleString() : String(value);
    }
  }
  return "--";
}

function normalizeLogs(result) {
  const logs = result?.items || result?.logs || result?.data || result;
  return Array.isArray(logs) ? logs.slice(0, 5) : [];
}

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function AdminDashboardPage() {
  const [stats, setStats] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function fetchDashboard() {
      setLoading(true);
      setError("");

      const [statsResult, logsResult] = await Promise.allSettled([
        getAdminStats(),
        getSyncLogs(),
      ]);

      if (!active) return;

      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value || {});
      } else {
        setStats({});
        setError(
          statsResult.reason?.response?.data?.message ||
            "The admin API is not responding. Start the backend to load live metrics.",
        );
      }

      if (logsResult.status === "fulfilled") {
        setLogs(normalizeLogs(logsResult.value));
      } else {
        setLogs([]);
      }

      setLoading(false);
    }

    fetchDashboard();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const lastSync = stats.lastSync || stats.lastSuccessfulSync || logs[0]?.createdAt;
  const health = stats.systemHealth || stats.health || (error ? "Disconnected" : "Operational");
  const isHealthy = !error && String(health).toLowerCase() !== "unhealthy";

  return (
    <section className={styles.dashboardPage}>
      <div className={styles.hero}>
        <div>
          <span className={styles.kicker}>Workspace summary</span>
          <h2 className={styles.pageTitle}>Good to see you.</h2>
          <p className={styles.pageSubtitle}>
            Monitor platform activity, user access, and research data from one place.
          </p>
        </div>
        <button
          type="button"
          className={styles.refreshButton}
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={loading}
        >
          <Icon name="refresh" size={17} />
          {loading ? "Refreshing..." : "Refresh data"}
        </button>
      </div>

      {error && (
        <div className={styles.alert} role="alert">
          <span className={styles.alertDot} />
          <div>
            <strong>Live data unavailable</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className={styles.statsGrid}>
        {metricDefinitions.map((metric) => (
          <article className={styles.metricCard} key={metric.key}>
            <div className={`${styles.metricIcon} ${styles[metric.tone]}`}>
              <Icon name={metric.icon} />
            </div>
            <div className={styles.metricContent}>
              <p>{metric.label}</p>
              <strong className={loading ? styles.loadingValue : ""}>
                {loading ? "" : getMetricValue(stats, metric.aliases)}
              </strong>
              <span>{metric.helper}</span>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelKicker}>Data pipeline</span>
              <h3>Recent synchronization</h3>
            </div>
            <div className={`${styles.statusBadge} ${isHealthy ? styles.online : styles.offline}`}>
              <span />
              {health}
            </div>
          </div>

          <div className={styles.syncSummary}>
            <div className={styles.syncIcon}>
              <Icon name="database" size={22} />
            </div>
            <div>
              <span>Last successful sync</span>
              <strong>{loading ? "Checking status..." : formatDate(lastSync)}</strong>
            </div>
          </div>

          <div className={styles.logList}>
            {logs.length > 0 ? (
              logs.map((log, index) => {
                const status = log.status || log.result || "Completed";
                const source = log.source || log.provider || log.type || "Metadata sync";
                const date = log.completedAt || log.createdAt || log.startedAt;
                return (
                  <div className={styles.logRow} key={log.id || `${source}-${index}`}>
                    <span className={styles.logMarker} />
                    <div className={styles.logMain}>
                      <strong>{source}</strong>
                      <span>{formatDate(date)}</span>
                    </div>
                    <span className={styles.logStatus}>{status}</span>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <Icon name="clock" size={22} />
                <p>No synchronization history is available yet.</p>
              </div>
            )}
          </div>
        </article>

        <aside className={styles.sideColumn}>
          <article className={`${styles.panel} ${styles.healthPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelKicker}>Platform</span>
                <h3>System health</h3>
              </div>
            </div>
            <div className={styles.healthVisual}>
              <div className={`${styles.healthRing} ${isHealthy ? styles.ringOnline : styles.ringOffline}`}>
                <span />
              </div>
              <div>
                <strong>{isHealthy ? "All systems normal" : "Connection required"}</strong>
                <p>
                  {isHealthy
                    ? "Core services are responding normally."
                    : "Metrics will appear when the API is online."}
                </p>
              </div>
            </div>
          </article>

          <article className={`${styles.panel} ${styles.quickPanel}`}>
            <span className={styles.panelKicker}>Shortcuts</span>
            <h3>Quick actions</h3>
            <Link to="/admin/users" className={styles.quickLink}>
              <span>
                <strong>Manage users</strong>
                <small>Review accounts and access</small>
              </span>
              <Icon name="arrow" size={18} />
            </Link>
            <Link to="/admin/api-config" className={styles.quickLink}>
              <span>
                <strong>Check integrations</strong>
                <small>API endpoint and sync setup</small>
              </span>
              <Icon name="arrow" size={18} />
            </Link>
          </article>
        </aside>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
