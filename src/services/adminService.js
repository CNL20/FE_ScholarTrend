import api from './api'
import { clearNotificationCache } from './notificationService'

function unwrapResponse(response, fallbackMessage) {
  if (!response || response.success === false || response.data == null) {
    throw new Error(response?.message || response?.errors?.[0] || fallbackMessage)
  }

  return response.data
}

// Simple in-memory cache to make navigation feel instantaneous
const cache = new Map();
const CACHE_TTL = 15000; // 15 seconds

export function clearAdminCache() {
  cache.clear();
}

async function withCache(key, fetcher, ttl = CACHE_TTL) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  if (cached && cached.promise) {
    return cached.promise;
  }

  const promise = fetcher().then(data => {
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  }).catch(err => {
    cache.delete(key);
    throw err;
  });

  cache.set(key, { promise, timestamp: 0 });
  return promise;
}

function buildUserParams(filters = {}) {
  const params = {
    page: filters.page || 1,
    pageSize: filters.pageSize || 20,
  }
  const search = filters.search?.trim()

  if (search) params.Search = search
  if (filters.role && filters.role !== 'All') params.Role = filters.role
  if (filters.isActive && filters.isActive !== 'All') {
    params.IsActive = filters.isActive === 'true'
  }

  return params
}

export async function getAdminDashboard() {
  return withCache('dashboard', async () => {
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
  });
}

export async function getUsers(filters = {}) {
  const { data: response } = await api.get('/admin/users', {
    params: buildUserParams(filters),
  })

  if (response && typeof response === 'object' && 'success' in response) {
    return unwrapResponse(response, 'Failed to load admin users.')
  }

  return response
}

export async function getUserById(userId) {
  const { data: response } = await api.get(`/admin/users/${userId}`)

  if (response && typeof response === 'object' && 'success' in response) {
    return unwrapResponse(response, 'Failed to load admin user detail.')
  }

  return response
}

export async function updateUserRole(userId, role) {
  const { data: response } = await api.patch(`/admin/users/${userId}/role`, { role })

  if (response && typeof response === 'object' && 'success' in response) {
    clearAdminCache();
    return unwrapResponse(response, 'Failed to update admin user role.')
  }

  clearAdminCache();
  return response
}

export async function updateUserStatus(userId, isActive) {
  const { data: response } = await api.patch(`/admin/users/${userId}/status`, { isActive })

  if (response && typeof response === 'object' && 'success' in response) {
    clearAdminCache();
    return unwrapResponse(response, 'Failed to update admin user status.')
  }

  clearAdminCache();
  return response
}


export async function getSyncLogs(page = 1, pageSize = 20) {
  return withCache(`syncLogs_${page}_${pageSize}`, async () => {
    const { data: response } = await api.get('/admin/sync/logs', {
      params: { page, pageSize },
    })

    if (response && typeof response === 'object' && 'success' in response) {
      return unwrapResponse(response, 'Failed to load sync logs.')
    }

    return response
  });
}

export async function getSyncDataSources() {
  return withCache('syncDataSources', async () => {
    const { data: response } = await api.get('/admin/sync/data-sources')

    if (response && typeof response === 'object' && 'success' in response) {
      return unwrapResponse(response, 'Failed to load sync data sources.')
    }

    return response
  });
}

export async function getSyncSchedule() {
  return withCache('syncSchedule', async () => {
    const { data: response } = await api.get('/admin/sync/schedule')

    if (response && typeof response === 'object' && 'success' in response) {
      return unwrapResponse(response, 'Failed to load sync schedule.')
    }

    return response
  });
}

export async function updateSyncSchedule(payload) {
  const { data: response } = await api.put('/admin/sync/schedule', payload)

  if (response && typeof response === 'object' && 'success' in response) {
    clearAdminCache();
    return unwrapResponse(response, 'Failed to update sync schedule.')
  }

  clearAdminCache();
  return response
}

export async function getSyncScheduleHistory(page = 1, pageSize = 20) {
  return withCache(`syncScheduleHistory_${page}_${pageSize}`, async () => {
    const { data: response } = await api.get('/admin/sync/schedule/history', {
      params: { page, pageSize },
    })

    if (response && typeof response === 'object' && 'success' in response) {
      return unwrapResponse(response, 'Failed to load sync schedule history.')
    }

    return response
  });
}

export async function triggerAdminSync(payload) {
  const { data: response } = await api.post('/admin/sync/trigger', payload)

  if (response && typeof response === 'object' && 'success' in response) {
    clearAdminCache();
    return unwrapResponse(response, 'Failed to trigger sync.')
  }

  clearAdminCache();
  return response
}

export async function getSyncStatus() {
  return withCache('syncStatus', async () => {
    const { data: response } = await api.get('/admin/sync/status')

    if (response && typeof response === 'object' && 'success' in response) {
      return unwrapResponse(response, 'Failed to load sync status.')
    }

    return response
  });
}

export async function getSyncStatusBySource(sourceName) {
  const encodedSourceName = encodeURIComponent(sourceName)
  const { data: response } = await api.get(`/admin/sync/status/${encodedSourceName}`)

  if (response && typeof response === 'object' && 'success' in response) {
    return unwrapResponse(response, 'Failed to load source sync status.')
  }

  return response
}

export async function updateSyncDataSourceStatus(sourceId, isActive) {
  const { data: response } = await api.patch(`/admin/sync/data-sources/${sourceId}`, {
    isActive,
  })

  if (response && typeof response === 'object' && 'success' in response) {
    clearAdminCache();
    return unwrapResponse(response, 'Failed to update sync data source.')
  }

  clearAdminCache();
  return response
}

export async function getPendingSyncJobs(page = 1, pageSize = 20) {
  return withCache(`pendingSyncJobs_${page}_${pageSize}`, async () => {
    const { data: response } = await api.get('/admin/sync/pending', {
      params: { page, pageSize },
    })

    if (response && typeof response === 'object' && 'success' in response) {
      return unwrapResponse(response, 'Failed to load pending sync jobs.')
    }

    return response
  });
}

export async function getPendingSyncJobById(syncId) {
  const { data: response } = await api.get(`/admin/sync/pending/${syncId}`)

  if (response && typeof response === 'object' && 'success' in response) {
    return unwrapResponse(response, 'Failed to load pending sync detail.')
  }

  return response
}

export async function approvePendingSyncPapers(syncId, pendingPaperIds) {
  const { data: response } = await api.post(`/admin/sync/pending/${syncId}/approve`, {
    pendingPaperIds,
  })

  if (response && typeof response === 'object' && 'success' in response) {
    clearAdminCache();
    clearNotificationCache();
    return unwrapResponse(response, 'Failed to approve pending sync papers.')
  }

  clearAdminCache();
  clearNotificationCache();
  return response
}

export async function rejectPendingSyncJob(syncId) {
  const { data: response } = await api.post(`/admin/sync/pending/${syncId}/reject`)

  if (response && typeof response === 'object' && 'success' in response) {
    clearAdminCache();
    clearNotificationCache();
    return unwrapResponse(response, 'Failed to reject pending sync.')
  }

  clearAdminCache();
  clearNotificationCache();
  return response
}
