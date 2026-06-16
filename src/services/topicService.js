import api from './api'

function unwrapResponse(response, fallbackMessage) {
  if (!response.success || response.data == null) {
    throw new Error(response.message || response.errors?.[0] || fallbackMessage)
  }

  return response.data
}

export async function getTopics() {
  const { data: response } = await api.get('/topics')
  const result = unwrapResponse(response, 'Failed to load topics.')

  return (Array.isArray(result) ? result : []).map((topic) => ({
    ...topic,
    name: topic.topicName ?? topic.name ?? `Topic ${topic.id}`,
    paperCount: topic.paperCount ?? 0,
  }))
}

function normalizeRecentPaper(paper) {
  const journal = typeof paper.journal === 'string'
    ? { name: paper.journal }
    : paper.journal

  return {
    ...paper,
    year: paper.publicationYear ?? paper.year,
    journal: journal?.name || 'Unknown journal',
    journalId: journal?.id ?? null,
    authors: (paper.authors ?? [])
      .map((author) => (typeof author === 'string' ? author : author.name))
      .filter(Boolean),
    keywords: paper.keywords ?? [],
    citationCount: paper.citationCount ?? 0,
  }
}

export async function getTopicById(id) {
  const topicId = Number(id)
  if (!Number.isInteger(topicId) || topicId <= 0) {
    throw new Error('Invalid topic id.')
  }

  const { data: response } = await api.get(`/topics/${topicId}`)
  const result = unwrapResponse(response, 'Failed to load topic details.')

  return {
    ...result,
    name: result.topicName ?? result.name ?? `Topic ${topicId}`,
    description: result.description ?? '',
    paperCount: result.paperCount ?? 0,
    recentPapers: (result.recentPapers ?? []).map(normalizeRecentPaper),
    trendChart: result.trendChart ?? [],
  }
}
