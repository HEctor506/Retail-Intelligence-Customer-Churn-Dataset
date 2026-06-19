import { useState } from 'react'
import styles from './CustomerTable.module.css'

const RISK_COLOR = { Low: '#10b981', Medium: '#f59e0b', High: '#f43f5e' }
const PAGE_SIZE = 10

export default function CustomerTable({ data }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('customer_id')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const filtered = data.filter(c =>
    c.customer_id.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase()) ||
    c.customer_segment.toLowerCase().includes(search.toLowerCase()) ||
    c.preferred_channel.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey]
    if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function SortIcon({ col }) {
    if (sortKey !== col) return <span className={styles.sortNone}>↕</span>
    return <span className={styles.sortActive}>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const COLS = [
    ['customer_id', 'ID'],
    ['age_group', 'Edad'],
    ['gender', 'Género'],
    ['region', 'Región'],
    ['customer_segment', 'Segmento'],
    ['preferred_channel', 'Canal'],
    ['avg_order_value', 'Ticket Avg'],
    ['recency_days', 'Recency'],
    ['loyalty_score', 'Fidelidad'],
    ['engagement_score', 'Engagement'],
    ['churn_risk', 'Riesgo'],
    ['churn_flag', 'Estado'],
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <h3 className={styles.title}>Clientes</h3>
        <input
          className={styles.search}
          placeholder="Buscar por ID, región, segmento o canal…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <span className={styles.count}>{filtered.length} registros</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {COLS.map(([key, label]) => (
                <th key={key} className={styles.th} onClick={() => toggleSort(key)}>
                  {label} <SortIcon col={key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map(c => (
              <tr key={c.customer_id} className={c.churn_flag === 1 ? styles.rowChurned : styles.row}>
                <td className={styles.td}><code>{c.customer_id}</code></td>
                <td className={styles.td}>{c.age_group}</td>
                <td className={styles.td}>{c.gender}</td>
                <td className={styles.td}>{c.region}</td>
                <td className={styles.td}>
                  <span className={styles.segBadge} data-seg={c.customer_segment}>
                    {c.customer_segment}
                  </span>
                </td>
                <td className={styles.td}>{c.preferred_channel}</td>
                <td className={styles.td}>${c.avg_order_value.toFixed(0)}</td>
                <td className={styles.td}>{c.recency_days}d</td>
                <td className={styles.td}>
                  <div className={styles.barWrap}>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${c.loyalty_score}%`,
                        backgroundColor: c.loyalty_score > 60 ? '#10b981' : c.loyalty_score > 35 ? '#f59e0b' : '#f43f5e'
                      }}
                    />
                    <span>{c.loyalty_score}</span>
                  </div>
                </td>
                <td className={styles.td}>{c.engagement_score.toFixed(1)}</td>
                <td className={styles.td}>
                  <span
                    className={styles.badge}
                    style={{ backgroundColor: RISK_COLOR[c.churn_risk] + '22', color: RISK_COLOR[c.churn_risk] }}
                  >
                    {c.churn_risk}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={c.churn_flag === 1 ? styles.lost : styles.active}>
                    {c.churn_flag === 1 ? 'Perdido' : 'Activo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
        <span>Página {page} de {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
      </div>
    </div>
  )
}
