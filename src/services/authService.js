export function fakeLogin({ email }) {
  return {
    id: 'u1',
    name: email.split('@')[0] || 'researcher',
    email,
  }
}

export function fakeRegister({ name, email }) {
  return {
    id: 'u2',
    name,
    email,
  }
}
