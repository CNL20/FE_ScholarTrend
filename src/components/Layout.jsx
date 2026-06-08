import { NavLink, Outlet } from "react-router-dom";
import { getNavItems, ROLES } from "../utils/roles";
import styles from "./layout.module.css";

function Layout() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  const navItems = getNavItems(token ? userRole : null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return "Admin";
      case ROLES.RESEARCHER:
        return "Researcher";
      case ROLES.LECTURER_STUDENT:
        return "Lecturer / Student";
      default:
        return "";
    }
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
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{userName}</span>
                    {userRole && (
                      <span className={styles.userRole}>
                        {getRoleLabel(userRole)}
                      </span>
                    )}
                  </div>
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
