import { useEffect, useState } from "react";
import { getAdminStats } from "../../services/adminService";
import styles from "./AdminApiConfigPage.module.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5141/api";

function Icon({ name, size = 19 }) {
  const paths = {
    server: (
      <>
        <rect x="3" y="4" width="18" height="6" rx="2" />
        <rect x="3" y="14" width="18" height="6" rx="2" />
        <path d="M7 7h.01M7 17h.01" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
      </>
    ),
    code: (
      <>
        <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
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

function AdminApiConfigPage() {
  const [connection, setConnection] = useState("checking");
  const [message, setMessage] = useState("Checking the admin API...");

  const testConnection = async () => {
    setConnection("checking");
    setMessage("Checking the admin API...");

    const startedAt = performance.now();
    try {
      await getAdminStats();
      const duration = Math.max(1, Math.round(performance.now() - startedAt));
      setConnection("connected");
      setMessage(`Connected successfully in ${duration} ms.`);
    } catch (error) {
      setConnection("disconnected");
      setMessage(
        error.response?.data?.message ||
          "The frontend could not reach the admin API. Verify the backend and token.",
      );
    }
  };

  useEffect(() => {
    let active = true;
    const startedAt = performance.now();

    getAdminStats()
      .then(() => {
        if (!active) return;
        const duration = Math.max(1, Math.round(performance.now() - startedAt));
        setConnection("connected");
        setMessage(`Connected successfully in ${duration} ms.`);
      })
      .catch((error) => {
        if (!active) return;
        setConnection("disconnected");
        setMessage(
          error.response?.data?.message ||
            "The frontend could not reach the admin API. Verify the backend and token.",
        );
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className={styles.configPage}>
      <div className={styles.hero}>
        <div>
          <span className={styles.kicker}>Infrastructure</span>
          <h2 className={styles.pageTitle}>API & integrations</h2>
          <p className={styles.pageSubtitle}>
            Inspect the frontend connection and confirm the services used by the admin console.
          </p>
        </div>
        <button
          type="button"
          className={styles.testButton}
          onClick={testConnection}
          disabled={connection === "checking"}
        >
          <Icon name="refresh" size={17} />
          {connection === "checking" ? "Testing..." : "Test connection"}
        </button>
      </div>

      <article className={styles.connectionCard}>
        <div className={styles.connectionHeader}>
          <div className={styles.serverIcon}><Icon name="server" size={22} /></div>
          <div>
            <span>Primary service</span>
            <h3>ScholarTrend API</h3>
          </div>
          <div className={`${styles.connectionBadge} ${styles[connection]}`}>
            <i />
            {connection === "checking" ? "Checking" : connection}
          </div>
        </div>
        <div className={styles.endpointBlock}>
          <span>Base URL</span>
          <code>{baseUrl}</code>
        </div>
        <p className={styles.connectionMessage}>{message}</p>
      </article>

      <div className={styles.contentGrid}>
        <article className={styles.panel}>
          <div className={styles.panelTitle}>
            <div className={styles.smallIcon}><Icon name="code" /></div>
            <div>
              <span>Runtime configuration</span>
              <h3>Frontend environment</h3>
            </div>
          </div>

          <dl className={styles.detailList}>
            <div>
              <dt>Environment variable</dt>
              <dd><code>VITE_API_BASE_URL</code></dd>
            </div>
            <div>
              <dt>Authentication</dt>
              <dd>JWT bearer token</dd>
            </div>
            <div>
              <dt>Unauthorized response</dt>
              <dd>Redirect to login</dd>
            </div>
            <div>
              <dt>Sync schedule</dt>
              <dd>Managed by backend</dd>
            </div>
          </dl>

          <div className={styles.infoBox}>
            <strong>Deployment note</strong>
            <p>
              The API URL is injected when Vite builds the frontend. Change it in the environment
              file, then rebuild the application.
            </p>
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelTitle}>
            <div className={styles.smallIcon}><Icon name="shield" /></div>
            <div>
              <span>Security</span>
              <h3>Connection checklist</h3>
            </div>
          </div>

          <div className={styles.checkList}>
            <div>
              <span className={styles.checkIcon}><Icon name="check" size={14} /></span>
              <p><strong>Token interceptor</strong><small>JWT is attached to protected requests.</small></p>
            </div>
            <div>
              <span className={styles.checkIcon}><Icon name="check" size={14} /></span>
              <p><strong>Role-protected routes</strong><small>Admin screens require the Admin role.</small></p>
            </div>
            <div>
              <span className={styles.checkIcon}><Icon name="check" size={14} /></span>
              <p><strong>No client-side API keys</strong><small>Secrets remain on the backend.</small></p>
            </div>
            <div>
              <span className={styles.checkIcon}><Icon name="clock" size={14} /></span>
              <p><strong>Metadata sync</strong><small>Timing and jobs are controlled by the API.</small></p>
            </div>
          </div>
        </article>
      </div>

      <article className={styles.routesPanel}>
        <div>
          <span className={styles.kicker}>Admin contract</span>
          <h3>Connected endpoints</h3>
        </div>
        <div className={styles.routeGrid}>
          <div><span className={styles.methodGet}>GET</span><code>/admin/stats</code><small>Dashboard metrics</small></div>
          <div><span className={styles.methodGet}>GET</span><code>/admin/users</code><small>User directory</small></div>
          <div><span className={styles.methodPut}>PUT</span><code>/admin/users/:id/role</code><small>Role update</small></div>
          <div><span className={styles.methodDelete}>DELETE</span><code>/admin/users/:id</code><small>Deactivate user</small></div>
        </div>
      </article>
    </section>
  );
}

export default AdminApiConfigPage;
