import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/validation";
import { register } from "../../services/authService";
import styles from "./auth.module.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    institution: "",
    researchField: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};
    if (!form.fullName.trim()) {
      errors.fullName = "Full name is required.";
    }
    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!validateEmail(form.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      errors.password = "Password is required.";
    } else if (!validatePassword(form.password)) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!form.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setError("");

    try {
      const result = await register(form);
      navigate(result?.token ? "/dashboard" : "/login", {
        replace: true,
        state: result?.token
          ? undefined
          : { message: "Account created successfully. Please sign in." },
      });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const firstError = Object.values(data.errors).flat()[0];
        setError(firstError || "Registration failed.");
      } else {
        setError(data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.container}>
        <div className={styles.logo}>ScholarTrend</div>
        <p className={styles.subtitle}>Academic Research Intelligence</p>
        <h1 className={styles.heading}>Create Account</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-name" className={styles.label}>Full Name</label>
            <input
              id="reg-name"
              className={`${styles.input}${fieldErrors.fullName ? ` ${styles.inputError}` : ''}`}
              type="text"
              placeholder="Nguyen Van A"
              required
              maxLength={100}
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            />
            {fieldErrors.fullName && <span className={styles.fieldError}>{fieldErrors.fullName}</span>}
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-email" className={styles.label}>Email Address</label>
            <input
              id="reg-email"
              className={`${styles.input}${fieldErrors.email ? ` ${styles.inputError}` : ''}`}
              type="email"
              placeholder="you@university.edu"
              required
              maxLength={254}
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-password" className={styles.label}>Password</label>
            <input
              id="reg-password"
              className={`${styles.input}${fieldErrors.password ? ` ${styles.inputError}` : ''}`}
              type="password"
              placeholder="••••••••"
              required
              maxLength={128}
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
            {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-confirm-password" className={styles.label}>Confirm Password</label>
            <input
              id="reg-confirm-password"
              className={`${styles.input}${fieldErrors.confirmPassword ? ` ${styles.inputError}` : ''}`}
              type="password"
              placeholder="••••••••"
              required
              maxLength={128}
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            />
            {fieldErrors.confirmPassword && <span className={styles.fieldError}>{fieldErrors.confirmPassword}</span>}
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-institution" className={styles.label}>Institution (optional)</label>
            <input
              id="reg-institution"
              className={styles.input}
              type="text"
              placeholder="FPT University"
              maxLength={200}
              value={form.institution}
              onChange={(e) => setForm((prev) => ({ ...prev, institution: e.target.value }))}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-field" className={styles.label}>Research Field (optional)</label>
            <input
              id="reg-field"
              className={styles.input}
              type="text"
              placeholder="Artificial Intelligence"
              maxLength={200}
              value={form.researchField}
              onChange={(e) => setForm((prev) => ({ ...prev, researchField: e.target.value }))}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
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
