import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SearchResultsList from '../../components/SearchResultsList'
import Skeleton from '../../components/Skeleton'
import { getAuthorById, getAuthorByName } from '../../services/authorService'
import {
  followAuthor,
  getFollowedAuthors,
  unfollowAuthor,
} from '../../services/followService'
import styles from './authorDetailPage.module.css'

function formatNumber(value) {
  return new Intl.NumberFormat('en').format(value ?? 0)
}

function AuthorDetailPage() {
  const { authorId, authorName } = useParams()
  const [author, setAuthor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [followError, setFollowError] = useState('')

  useEffect(() => {
    let active = true

    async function fetchAuthor() {
      setLoading(true)
      setError('')
      setFollowError('')
      setIsFollowing(false)
      try {
        const hasToken = Boolean(localStorage.getItem('token'))
        const result = authorId
          ? await getAuthorById(authorId)
          : await getAuthorByName(authorName)
        if (!active) return

        setAuthor(result)

        if (hasToken && result?.id) {
          try {
            const followedAuthors = await getFollowedAuthors()
            if (active) {
              setIsFollowing(
                followedAuthors.some((item) => Number(item.id) === Number(result.id)),
              )
            }
          } catch {
            // Ignore follow-status lookup errors so author details still render.
          }
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || err.message || 'Failed to load author details.')
          setAuthor(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchAuthor()
    return () => {
      active = false
    }
  }, [authorId, authorName])

  const handleFollowToggle = async () => {
    if (!author?.id || followLoading) return

    setFollowLoading(true)
    setFollowError('')
    try {
      if (isFollowing) {
        await unfollowAuthor(author.id)
        setIsFollowing(false)
      } else {
        await followAuthor(author.id)
        setIsFollowing(true)
      }
    } catch (err) {
      setFollowError(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${isFollowing ? 'unfollow' : 'follow'} author.`,
      )
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <Skeleton variant="title" width="40%" />
        <Skeleton variant="card" count={3} />
      </section>
    )
  }

  if (error || !author) {
    return (
      <section className={styles.page}>
        <div className={styles.errorState}>
          <strong>Author could not be loaded</strong>
          <p>{error}</p>
          <Link to="/authors">Back to authors</Link>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>Research author</span>
          <h1>{author.name}</h1>
          <p>{author.affiliation || 'Affiliation not specified'}</p>
          <div className={styles.metaLine}>
            {author.country && <span>{author.country}</span>}
            {author.externalId && <span>External ID {author.externalId}</span>}
          </div>
        </div>
        <div className={styles.heroActions}>
          {localStorage.getItem('token') ? (
            <button
              type="button"
              className={`${styles.followButton} ${isFollowing ? styles.followingButton : ''}`}
              onClick={handleFollowToggle}
              disabled={followLoading}
            >
              {followLoading
                ? isFollowing ? 'Unfollowing...' : 'Following...'
                : isFollowing ? 'Unfollow author' : 'Follow author'}
            </button>
          ) : (
            <Link className={styles.followButton} to="/login">Sign in to follow</Link>
          )}
          <Link
            className={styles.primaryLink}
            to={`/search/results?query=${encodeURIComponent(author.name)}&searchType=Author&page=1&pageSize=10`}
          >
            View all papers
          </Link>
        </div>
      </header>

      {followError && <p className={styles.followError}>{followError}</p>}

      <div className={styles.statsGrid}>
        <article>
          <span>Papers</span>
          <strong>{formatNumber(author.paperCount)}</strong>
        </article>
        <article>
          <span>Total citations</span>
          <strong>{formatNumber(author.totalCitations)}</strong>
        </article>
        <article>
          <span>H-index</span>
          <strong>{formatNumber(author.hIndex)}</strong>
        </article>
        <article>
          <span>Recent papers</span>
          <strong>{formatNumber(author.recentPapers.length)}</strong>
        </article>
      </div>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.eyebrow}>Latest research</span>
            <h2>Recent papers</h2>
          </div>
          <span>{author.recentPapers.length} shown</span>
        </div>
        <SearchResultsList papers={author.recentPapers} />
      </section>
    </section>
  )
}

export default AuthorDetailPage
