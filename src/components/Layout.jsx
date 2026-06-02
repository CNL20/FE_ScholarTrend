import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './Layout.module.css'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/search', label: 'Search' },
  { to: '/trends', label: 'Trends' },
  { to: '/bookmarks', label: 'Bookmarks' },
  { to: '/following', label: 'Following' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/admin', label: 'Admin' },
]

function Layout() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.brand}>ScholarTrend</div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? styles.active : styles.link)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.authActions}>
          {isAuthenticated ? (
            <>
              <span className={styles.userName}>{user?.name}</span>
              <button type="button" className={styles.button} onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={styles.link}>
                Login
              </NavLink>
              <NavLink to="/register" className={styles.link}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
