import styles from './FilterBar.module.css'

const REGIONS = ['Todos', 'Norte', 'Sur', 'Este', 'Oeste']
const CATEGORIES = ['Todas', 'Electrónica', 'Ropa', 'Alimentos', 'Belleza', 'Deportes']
const RISKS = ['Todos', 'Bajo', 'Medio', 'Alto']

export default function FilterBar({ filters, onChange }) {
  function handle(key, value) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className={styles.bar}>
      <span className={styles.label}>🔍 Filtros:</span>

      <div className={styles.group}>
        <label className={styles.fieldLabel}>Región</label>
        <select
          className={styles.select}
          value={filters.region}
          onChange={e => handle('region', e.target.value)}
        >
          {REGIONS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.fieldLabel}>Categoría</label>
        <select
          className={styles.select}
          value={filters.category}
          onChange={e => handle('category', e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.fieldLabel}>Riesgo</label>
        <select
          className={styles.select}
          value={filters.risk}
          onChange={e => handle('risk', e.target.value)}
        >
          {RISKS.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.fieldLabel}>Estado</label>
        <select
          className={styles.select}
          value={filters.status}
          onChange={e => handle('status', e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Activo">Activos</option>
          <option value="Perdido">Perdidos</option>
        </select>
      </div>

      <button
        className={styles.reset}
        onClick={() => onChange({ region: 'Todos', category: 'Todas', risk: 'Todos', status: 'Todos' })}
      >
        Limpiar
      </button>
    </div>
  )
}
