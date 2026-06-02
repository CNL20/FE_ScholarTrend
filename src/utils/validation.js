export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateRequired(value) {
  return value.trim().length > 0
}

export function validatePassword(password) {
  return password.length >= 6
}
