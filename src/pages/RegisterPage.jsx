import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validatePassword, validateRequired } from '../utils/validation'
import styles from './Auth.module.css'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateRequired(form.name)) {
      setError('Name is required.')
      return
    }

    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!validatePassword(form.password)) {
      setError('Password must be at least 6 characters.')
      return
    }

    register(form)
    setError('')
    navigate('/dashboard')
  }

  return (
    <section className={styles.container}>
      <h1>Register</h1>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label htmlFor="register-name">Name</label>
        <input
          id="register-name"
          className={styles.input}
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          className={styles.input}
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          className={styles.input}
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Create Account
        </button>
      </form>
    </section>
  )
}

export default RegisterPage
