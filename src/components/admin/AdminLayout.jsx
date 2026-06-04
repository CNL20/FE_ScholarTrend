import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./adminLayout.module.css";

const sidebarLinks = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/users", label: "User Management" },
  { to: "/admin/api-config", label: "API Configuration" },
];

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandName}>ScholarTrend</div>
          <div className={styles.brandSub}>Admin Panel</div>
        </div>
        <nav className={styles.nav}>
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </aside>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
