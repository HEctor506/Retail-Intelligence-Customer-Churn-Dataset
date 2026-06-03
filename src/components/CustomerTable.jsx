import { useState } from 'react'
import styles from './CustomerTable.module.css'

const RISK_COLOR = { Bajo: '#10b981', Medio: '#f59e0b', Alto: '#f43f5e' }
const PAGE_SIZE = 10

export default function CustomerTable({ data }) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const filtered = data.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <h3 className={styles.title}>Clientes</h3>
        <input
          className={styles.search}
          placeholder="Buscar por nombre, ID o región…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <span className={styles.count}>{filtered.length} clientes</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {[
                ['id', 'ID'],
                ['name', 'Nombre'],
                ['age', 'Edad'],
                ['gender', 'Género'],
                ['region', 'Región'],
                ['category', 'Categoría'],
                ['monthlySpend', 'Gasto/mes'],
                ['loyaltyScore', 'Fidelidad'],
                ['churnRisk', 'Riesgo'],
                ['churned', 'Estado'],
              ].map(([key, label]) => (
                <th key={key} className={styles.th} onClick={() => toggleSort(key)}>
                  {label} <SortIcon col={key} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map(c => (
              <tr key={c.id} className={c.churned ? styles.rowChurned : styles.row}>
                <td className={styles.td}><code>{c.id}</code></td>
                <td className={styles.td}>{c.name}</td>
                <td className={styles.td}>{c.age}</td>
                <td className={styles.td}>{c.gender}</td>
                <td className={styles.td}>{c.region}</td>
                <td className={styles.td}>{c.category}</td>
                <td className={styles.td}>${c.monthlySpend.toFixed(0)}</td>
                <td className={styles.td}>
                  <div className={styles.barWrap}>
                    <div
                      className={styles.bar}
                      style={{ width: `${c.loyaltyScore}%`, backgroundColor: c.loyaltyScore > 60 ? '#10b981' : c.loyaltyScore > 35 ? '#f59e0b' : '#f43f5e' }}
                    />
                    <span>{c.loyaltyScore}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <span
                    className={styles.badge}
                    style={{ backgroundColor: RISK_COLOR[c.churnRisk] + '22', color: RISK_COLOR[c.churnRisk] }}
                  >
                    {c.churnRisk}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={c.churned ? styles.lost : styles.active}>
                    {c.churned ? 'Perdido' : 'Activo'}
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
