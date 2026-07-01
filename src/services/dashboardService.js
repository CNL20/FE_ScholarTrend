import api from './api'

export async function getPersonalDashboard() {
  const { data: response } = await api.get('/dashboard/personal')

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to load dashboard data.')
  }

  return response.data
}
export async function getDashboardOverview() {
  const { data: response } = await api.get('/dashboard/overview')

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to load dashboard overview data.')
  }

  return response.data
}
