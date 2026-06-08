import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getTrendByYear } from '../../services/trendService'
import styles from './trendChartPage.module.css'

function TrendChartPage() {
  const [chartType, setChartType] = useState('line')
  const [trendData, setTrendData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchTrend() {
      try {
        const result = await getTrendByYear()
        setTrendData(result ?? [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load trend data')
        setTrendData([])
      } finally {
        setLoading(false)
      }
    }
    fetchTrend()
  }, [])

  if (loading) {
    return (
      <section className={styles.panel}>
        <p>Loading...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.panel}>
        <p>{error}</p>
      </section>
    )
  }

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Publication Trend Chart</h1>
        <button
          type="button"
          className={styles.button}
          onClick={() => setChartType((prev) => (prev === 'line' ? 'bar' : 'line'))}
        >
          ⇄ Switch to {chartType === 'line' ? 'Bar' : 'Line'} Chart
        </button>
      </div>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#cbd5e1" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis stroke="#cbd5e1" tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
                }}
                labelStyle={{ color: '#475569' }}
              />
              <Line
                type="monotone"
                dataKey="publications"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: '#1e40af', r: 4, strokeWidth: 0 }}
                activeDot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: '#fff' }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </LineChart>
          ) : (
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#cbd5e1" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis stroke="#cbd5e1" tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#0f172a',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
                }}
                labelStyle={{ color: '#475569' }}
              />
              <Bar dataKey="publications" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1e40af" />
                </linearGradient>
              </defs>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default TrendChartPage
