import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/validation";
import styles from "./auth.module.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(form.password)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // TODO: Replace with real API call
    localStorage.setItem("token", "fake-jwt-token");
    localStorage.setItem("userName", form.name);
    localStorage.setItem("userRole", form.role);
    setError("");
    navigate("/dashboard");
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.container}>
        <div className={styles.logo}>ScholarTrend</div>
        <p className={styles.subtitle}>Academic Research Intelligence</p>
        <h1 className={styles.heading}>Create Account</h1>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-name" className={styles.label}>Full Name</label>
            <input
              id="reg-name"
              className={styles.input}
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-email" className={styles.label}>Email Address</label>
            <input
              id="reg-email"
              className={styles.input}
              type="email"
              placeholder="you@university.edu"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-password" className={styles.label}>Password</label>
            <input
              id="reg-password"
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-role" className={styles.label}>Role</label>
            <select
              id="reg-role"
              className={styles.input}
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            >
              <option value="student">Student / Lecturer</option>
              <option value="researcher">Researcher</option>
            </select>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button}>
            Create Account
          </button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  );
}

export default RegisterPage;
