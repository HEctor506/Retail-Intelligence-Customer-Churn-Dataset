import { SlidersHorizontal, X } from 'lucide-react'
import styles from './FilterBar.module.css'

const FILTERS = [
  { key: 'region',  label: 'Región',   opts: ['All', 'North', 'South', 'East', 'West', 'Central'] },
  { key: 'segment', label: 'Segmento', opts: ['All', 'Loyal', 'New', 'VIP', 'Returning'] },
  { key: 'channel', label: 'Canal',    opts: ['All', 'Online', 'Mobile App', 'In-Store'] },
  { key: 'risk',    label: 'Riesgo',   opts: ['All', 'Low', 'Medium', 'High'] },
  { key: 'status',  label: 'Estado',   opts: ['All', 'Active', 'Churned'],
    labels: { All: 'Todos', Active: 'Activos', Churned: 'Perdidos' } },
]

export default function FilterBar({ filters, onChange }) {
  const hasActive = Object.values(filters).some(v => v !== 'All')

  return (
    <div className={styles.bar}>
      <div className="flex items-center gap-1.5 text-slate-400">
        <SlidersHorizontal size={13} />
        <span className={styles.label}>Filtros</span>
      </div>

      {FILTERS.map(({ key, label, opts, labels }) => (
        <div key={key} className={styles.group}>
          <label className={styles.fieldLabel}>{label}</label>
          <select
            className={styles.select}
            value={filters[key]}
            onChange={e => onChange({ ...filters, [key]: e.target.value })}
          >
            {opts.map(o => (
              <option key={o} value={o}>{labels ? labels[o] : o}</option>
            ))}
          </select>
        </div>
      ))}

      {hasActive && (
        <button
          className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500 transition-colors font-medium"
          onClick={() => onChange({ region: 'All', segment: 'All', channel: 'All', risk: 'All', status: 'All' })}
        >
          <X size={12} />
          Limpiar
        </button>
      )}
    </div>
  )
}
