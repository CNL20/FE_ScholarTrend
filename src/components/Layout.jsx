import { NavLink, Outlet } from "react-router-dom";
import styles from "./layout.module.css";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/search", label: "Search" },
  { to: "/trends", label: "Trends" },
  { to: "/bookmarks", label: "Bookmarks" },
  { to: "/following", label: "Following" },
  { to: "/notifications", label: "Notifications" },
];

function Layout() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" className={styles.brand}>
            <span className={styles.brandText}>ScholarTrend</span>
          </NavLink>

          <nav className={styles.nav}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                  <span className={styles.navLabel}>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className={styles.authActions}>
            {token ? (
              <>
                <div className={styles.userGreeting}>
                  <span className={styles.userAvatar}>
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                  </span>
                  <span className={styles.userName}>{userName}</span>
                </div>
                <button
                  type="button"
                  className={styles.logoutBtn}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={styles.loginBtn}>
                  Login
                </NavLink>
                <NavLink to="/register" className={styles.registerBtn}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerBrand}>ScholarTrend</span>
          <span className={styles.footerCopy}>
            © {new Date().getFullYear()} ScholarTrend. Built for researchers.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
