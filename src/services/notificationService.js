import api from './api'

const cache = new Map();
const CACHE_TTL = 15000; // 15 seconds

export function clearNotificationCache() {
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

function unwrapResponse(response, fallbackMessage) {
  if (!response.success || response.data == null) {
    throw new Error(response.message || response.errors?.[0] || fallbackMessage)
  }

  return response.data
}

function getNotificationPaperId(item) {
  const directPaperId =
    item.paperId ??
    item.paperID ??
    item.PaperId ??
    item.relatedPaperId ??
    item.newPaperId ??
    item.paper?.id ??
    item.paper?.paperId ??
    item.data?.paperId ??
    item.metadata?.paperId ??
    item.payload?.paperId

  if (directPaperId != null && String(directPaperId).trim()) {
    return String(directPaperId).trim()
  }

  const type = String(
    item.type ?? item.notificationType ?? item.entityType ?? item.targetType ?? '',
  ).toLowerCase()

  if (!type.includes('paper') && !type.includes('article') && !type.includes('research')) {
    return ''
  }

  const typedPaperId =
    item.entityId ??
    item.targetId ??
    item.relatedId ??
    item.resourceId ??
    item.data?.entityId ??
    item.metadata?.entityId

  return typedPaperId != null && String(typedPaperId).trim()
    ? String(typedPaperId).trim()
    : ''
}

function getNotificationTargetUrl(item) {
  const explicitUrl = item.targetUrl ?? item.url ?? item.link
  if (explicitUrl != null && String(explicitUrl).trim()) {
    let url = String(explicitUrl).trim()
    
    // Fallback: The backend might generate /admin/sync/pending/{id}
    // but the frontend handles this in the /admin/api-config page.
    if (url.startsWith('/admin/sync/pending')) {
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      if (id && !isNaN(Number(id))) {
        return `/admin/api-config?pendingId=${id}`;
      }
      return '/admin/api-config';
    }
    
    return url
  }

  const paperId = getNotificationPaperId(item)
  return paperId ? `/papers/${encodeURIComponent(paperId)}` : ''
}

function normalizeNotification(item) {
  return {
    ...item,
    title: item.title ?? 'Notification',
    message: item.message ?? '',
    targetUrl: getNotificationTargetUrl(item),
    paperId: getNotificationPaperId(item) || null,
    isRead: Boolean(item.isRead ?? item.read),
    read: Boolean(item.isRead ?? item.read),
    createdAt: item.createdAt ?? null,
    readAt: item.readAt ?? null,
  }
}

/** Lấy danh sách notifications */
export async function getNotifications({ isRead, limit = 20, type } = {}) {
  const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100)
  const params = {
    isRead: typeof isRead === 'boolean' ? isRead : undefined,
    limit: normalizedLimit,
    type: type || undefined,
  }
  const cacheKey = `notifications_${JSON.stringify(params)}`

  return withCache(cacheKey, async () => {
    const { data: response } = await api.get('/notifications', { params })
    const result = unwrapResponse(response, 'Failed to load notifications.')
    return (Array.isArray(result) ? result : []).map(normalizeNotification)
  })
}

/** Đánh dấu 1 notification đã đọc */
export async function getUnreadNotificationCount(type) {
  const cacheKey = `unreadCount_${type || 'all'}`
  return withCache(cacheKey, async () => {
    const { data: response } = await api.get('/notifications/unread-count', {
      params: { type: type || undefined }
    })
    const result = unwrapResponse(response, 'Failed to load unread notification count.')
    const rawCount = typeof result === 'object' && result !== null
      ? result.unreadCount ?? result.count ?? result.totalUnread ?? result.unreadNotifications ?? result.totalCount
      : result
    const count = Number(rawCount)

    return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0
  })
}

export async function getNotificationSettings() {
  const { data: response } = await api.get('/notifications/settings')
  const result = unwrapResponse(response, 'Failed to load notification settings.')

  return {
    emailEnabled: Boolean(result.emailEnabled),
    topicAlertEnabled: Boolean(result.topicAlertEnabled),
    frequency: result.frequency ?? 'Not set',
  }
}

export async function updateNotificationSettings(settings) {
  const frequency = String(settings.frequency ?? '').trim()
  if (!frequency) {
    throw new Error('Notification frequency is required.')
  }

  const { data: response } = await api.put('/notifications/settings', {
    emailEnabled: Boolean(settings.emailEnabled),
    topicAlertEnabled: Boolean(settings.topicAlertEnabled),
    frequency,
  })
  const result = unwrapResponse(response, 'Failed to update notification settings.')

  return {
    emailEnabled: Boolean(result.emailEnabled),
    topicAlertEnabled: Boolean(result.topicAlertEnabled),
    frequency: result.frequency ?? frequency,
  }
}

export async function markAsRead(notificationId) {
  const normalizedId = Number(notificationId)
  if (!Number.isInteger(normalizedId) || normalizedId <= 0) {
    throw new Error('Invalid notification id.')
  }

  const { data: response } = await api.patch(`/notifications/${normalizedId}/read`)
  const result = unwrapResponse(response, 'Failed to mark notification as read.')
  clearNotificationCache()
  return result
}

/** Đánh dấu tất cả đã đọc */
export async function markAllAsRead() {
  const { data: response } = await api.patch('/notifications/read-all')
  const result = unwrapResponse(response, 'Failed to mark all notifications as read.')
  clearNotificationCache()
  return result
}
