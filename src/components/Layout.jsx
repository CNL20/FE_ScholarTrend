import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { getUnreadNotificationCount } from "../services/notificationService";
import { getNavItems, ROLES } from "../utils/roles";
import styles from "./layout.module.css";

function Layout() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const avatarStorageKey = userId ? `profileAvatar:${userId}` : "";
  const [userAvatar, setUserAvatar] = useState(
    avatarStorageKey ? localStorage.getItem(avatarStorageKey) || "" : "",
  );
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const navItems = getNavItems(token ? userRole : null);

  useEffect(() => {
    const handleAvatarUpdated = (event) => {
      if (event.detail?.userId === userId) {
        setUserAvatar(event.detail.image || "");
      }
    };

    window.addEventListener("profile-avatar-updated", handleAvatarUpdated);
    return () => window.removeEventListener("profile-avatar-updated", handleAvatarUpdated);
  }, [userId]);

  useEffect(() => {
    const canViewNotifications =
      token && [ROLES.RESEARCHER, ROLES.ADMIN].includes(userRole);

    if (!canViewNotifications) {
      return undefined;
    }

    let active = true;
    const refreshUnreadCount = async () => {
      try {
        const count = await getUnreadNotificationCount();
        if (active) setUnreadNotifications(count);
      } catch {
        if (active) setUnreadNotifications(0);
      }
    };

    refreshUnreadCount();
    window.addEventListener("focus", refreshUnreadCount);
    window.addEventListener("notifications-updated", refreshUnreadCount);

    return () => {
      active = false;
      window.removeEventListener("focus", refreshUnreadCount);
      window.removeEventListener("notifications-updated", refreshUnreadCount);
    };
  }, [token, userRole]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
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
                {item.to === "/notifications" && unreadNotifications > 0 && (
                  <span
                    className={styles.notificationBadge}
                    aria-label={`${unreadNotifications} unread notifications`}
                  >
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className={styles.authActions}>
            <button
              type="button"
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              title={dark ? "Light mode" : "Dark mode"}
            >
              {dark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
            {token ? (
              <>
                <div className={styles.userGreeting}>
                  <span className={styles.userAvatar}>
                    {userAvatar ? (
                      <img src={userAvatar} alt="" />
                    ) : (
                      userName ? userName.charAt(0).toUpperCase() : "U"
                    )}
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
