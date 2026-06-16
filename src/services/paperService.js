import api from './api'

function unwrapResponse(response, fallbackMessage) {
  if (!response.success || response.data == null) {
    throw new Error(response.message || response.errors?.[0] || fallbackMessage)
  }

  return response.data
}

function normalizePaperListItem(paper) {
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

function normalizePaperDetail(paper) {
  const journal = typeof paper.journal === 'string'
    ? { name: paper.journal }
    : paper.journal

  return {
    ...paper,
    year: paper.publicationYear ?? paper.year,
    journal: journal ?? null,
    journalName: journal?.name || 'Unknown journal',
    authors: (paper.authors ?? [])
      .map((author) => (
        typeof author === 'string'
          ? { id: null, name: author, affiliation: '' }
          : author
      ))
      .filter((author) => author.name),
    keywords: paper.keywords ?? [],
    topics: paper.topics ?? [],
    citationCount: paper.citationCount ?? 0,
    isBookmarked: Boolean(paper.isBookmarked),
  }
}

function normalizePaginatedPapers(result, fallbackPage, fallbackPageSize) {
  return {
    ...result,
    items: (result.items ?? []).map(normalizePaperListItem),
    totalCount: result.totalCount ?? 0,
    page: Number(result.page) > 0 ? result.page : fallbackPage,
    pageSize: Number(result.pageSize) > 0 ? result.pageSize : fallbackPageSize,
    totalPages: result.totalPages ?? 0,
  }
}

export async function searchPapers(params = {}) {
  let query = params.query ?? params.keyword ?? ''
  let searchType = params.searchType ?? 'All'

  if (!query && params.author) {
    query = params.author
    searchType = 'Author'
  } else if (!query && params.journal) {
    query = params.journal
    searchType = 'Journal'
  }

  const apiParams = {
    Query: query || undefined,
    SearchType: searchType && searchType !== 'All' ? searchType : undefined,
    JournalId: params.journalId,
    TopicId: params.topicId,
    YearFrom: params.yearFrom,
    YearTo: params.yearTo,
    MinCitations: params.minCitations,
    Page: params.page ?? 1,
    PageSize: params.pageSize ?? 10,
  }
  const { data: response } = await api.get('/papers/search', { params: apiParams })
  const result = unwrapResponse(response, 'Failed to search papers.')

  return normalizePaginatedPapers(result, apiParams.Page, apiParams.PageSize)
}

export async function getPapersByTopic(topicId, params = {}) {
  const normalizedTopicId = Number(topicId)
  if (!Number.isInteger(normalizedTopicId) || normalizedTopicId <= 0) {
    throw new Error('Invalid topic id.')
  }

  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10
  const { data: response } = await api.get(
    `/papers/by-topic/${normalizedTopicId}`,
    { params: { page, pageSize } },
  )
  const result = unwrapResponse(response, 'Failed to load papers for this topic.')

  return normalizePaginatedPapers(result, page, pageSize)
}

export async function getPapersByJournal(journalId, params = {}) {
  const normalizedJournalId = Number(journalId)
  if (!Number.isInteger(normalizedJournalId) || normalizedJournalId <= 0) {
    throw new Error('Invalid journal id.')
  }

  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 10
  const { data: response } = await api.get(
    `/papers/by-journal/${normalizedJournalId}`,
    { params: { page, pageSize } },
  )
  const result = unwrapResponse(response, 'Failed to load papers for this journal.')

  return normalizePaginatedPapers(result, page, pageSize)
}

export async function getSearchHistory(limit = 20) {
  const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100)
  const { data: response } = await api.get('/papers/search-history', {
    params: { limit: normalizedLimit },
  })

  return unwrapResponse(response, 'Failed to load search history.') ?? []
}

/**
 * Lấy chi tiết 1 paper
 * @param {number} id
 * @returns {Paper}
 */
export async function getPaperById(id) {
  const { data: response } = await api.get(`/papers/${id}`)
  return normalizePaperDetail(unwrapResponse(response, 'Failed to load paper details.'))
}

/**
 * Lấy papers mới nhất
 * @param {number} count
 * @returns {Paper[]}
 */
export async function getRecentPapers(count = 10) {
  const { data } = await api.get('/papers/recent', { params: { count } })
  return data
}

/**
 * Lấy papers theo tác giả
 */
export async function getPapersByAuthor(authorName, params = {}) {
  return searchPapers({
    ...params,
    query: authorName,
    searchType: 'Author',
  })
}

/**
 * Ghi nhận lượt xem paper
 */
export async function recordView(paperId) {
  const { data } = await api.post(`/papers/${paperId}/view`)
  return data
}
