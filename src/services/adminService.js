import api from './api'

function unwrapResponse(response, fallbackMessage) {
  if (!response.success || response.data == null) {
    throw new Error(response.message || response.errors?.[0] || fallbackMessage)
  }

  return response.data
}

export async function getAdminDashboard() {
  const { data: response } = await api.get('/admin/dashboard')
  const result = unwrapResponse(response, 'Failed to load admin dashboard.')

  return {
    ...result,
    totalUsers: result.totalUsers ?? 0,
    activeUsers: result.activeUsers ?? 0,
    totalPapers: result.totalPapers ?? 0,
    totalKeywords: result.totalKeywords ?? 0,
    totalTopics: result.totalTopics ?? 0,
    totalJournals: result.totalJournals ?? 0,
    totalBookmarks: result.totalBookmarks ?? 0,
    totalFollows: result.totalFollows ?? 0,
    usersByRole: result.usersByRole ?? {},
    lastSync: result.lastSync ?? null,
    recentSyncLogs: result.recentSyncLogs ?? [],
    dataSources: result.dataSources ?? [],
    publicationTrend: result.publicationTrend ?? [],
    topKeywords: result.topKeywords ?? [],
  }
}

export async function getUsers() {
  const { data } = await api.get('/admin/users')
  return data
}

export async function updateUserRole(userId, role) {
  const { data } = await api.put(`/admin/users/${userId}/role`, { role })
  return data
}

export async function deleteUser(userId) {
  await api.delete(`/admin/users/${userId}`)
}

export async function getAdminStats() {
  const { data } = await api.get('/admin/stats')
  return data
}

export async function getSyncLogs() {
  const { data } = await api.get('/admin/sync-logs')
  return data
}
