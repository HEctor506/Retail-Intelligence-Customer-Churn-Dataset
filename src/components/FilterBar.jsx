import styles from './FilterBar.module.css'

const REGIONS = ['All', 'North', 'South', 'East', 'West', 'Central']
const SEGMENTS = ['All', 'Loyal', 'New', 'VIP', 'Returning']
const CHANNELS = ['All', 'Online', 'Mobile App', 'In-Store']
const RISKS = ['All', 'Low', 'Medium', 'High']

export default function FilterBar({ filters, onChange }) {
  function handle(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className={styles.bar}>
      <span className={styles.label}>🔍 Filtros</span>

      {[
        { key: 'region', label: 'Región', opts: REGIONS },
        { key: 'segment', label: 'Segmento', opts: SEGMENTS },
        { key: 'channel', label: 'Canal', opts: CHANNELS },
        { key: 'risk', label: 'Riesgo', opts: RISKS },
      ].map(({ key, label, opts }) => (
        <div key={key} className={styles.group}>
          <label className={styles.fieldLabel}>{label}</label>
          <select
            className={styles.select}
            value={filters[key]}
            onChange={e => handle(key, e.target.value)}
          >
            {opts.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}

      <div className={styles.group}>
        <label className={styles.fieldLabel}>Estado</label>
        <select
          className={styles.select}
          value={filters.status}
          onChange={e => handle('status', e.target.value)}
        >
          <option value="All">Todos</option>
          <option value="Active">Activos</option>
          <option value="Churned">Perdidos</option>
        </select>
      </div>

      <button
        className={styles.reset}
        onClick={() => onChange({ region: 'All', segment: 'All', channel: 'All', risk: 'All', status: 'All' })}
      >
        Limpiar
      </button>
    </div>
  )
}
