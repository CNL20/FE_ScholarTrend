import api from './api'

/**
 * Đăng nhập → trả { token, user }
 * Lưu token + user info vào localStorage
 */
export async function login({ email, password }) {
  const { data: response } = await api.post('/auth/login', {
    email: email.trim(),
    password,
  })

  if (!response.success || !response.data?.token) {
    throw new Error(response.message || 'Login failed.')
  }

  const auth = response.data
  localStorage.setItem('token', auth.token)
  localStorage.setItem('refreshToken', auth.refreshToken || '')
  localStorage.setItem('userName', auth.fullName || '')
  localStorage.setItem('userRole', auth.roles?.[0] || '')
  localStorage.setItem('userId', auth.userId || '')
  return auth
}

/**
 * Đăng ký tài khoản và tự động lưu phiên nếu API trả token + user.
 */
export async function register({
  fullName,
  email,
  password,
  confirmPassword,
  institution,
  researchField,
}) {
  const { data: response } = await api.post('/auth/register', {
    fullName: fullName.trim(),
    email: email.trim(),
    password,
    confirmPassword,
    institution: institution.trim(),
    researchField: researchField.trim(),
  })

  const auth = response.data
  if (response.success && auth?.token) {
    localStorage.setItem('token', auth.token)
    localStorage.setItem('refreshToken', auth.refreshToken || '')
    localStorage.setItem('userName', auth.fullName || '')
    localStorage.setItem('userRole', auth.roles?.[0] || '')
    localStorage.setItem('userId', auth.userId || '')
  }

  return auth
}

/**
 * Lấy thông tin user hiện tại (dùng JWT token)
 */
export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

/**
 * Cập nhật thông tin profile
 */
export async function updateProfile(data) {
  const res = await api.put('/auth/profile', data)
  if (res.data.fullName) localStorage.setItem('userName', res.data.fullName)
  return res.data
}

/**
 * Đổi mật khẩu
 */
export async function changePassword(data) {
  const res = await api.put('/auth/change-password', data)
  return res.data
}

/**
 * Logout → xóa localStorage
 */
export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userName')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
  window.location.href = '/'
}
