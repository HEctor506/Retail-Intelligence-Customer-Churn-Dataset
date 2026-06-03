import { useState, useMemo } from 'react'
import {
  customers,
  getKPIs,
  getChurnByRegion,
  getChurnByCategory,
  getAgeDistribution,
  getMonthlyTrend,
} from './data/mockData'
import KPICard from './components/KPICard'
import FilterBar from './components/FilterBar'
import ChurnByRegionChart from './components/ChurnByRegionChart'
import ChurnByCategoryChart from './components/ChurnByCategoryChart'
import ChurnTrendChart from './components/ChurnTrendChart'
import AgeDistributionChart from './components/AgeDistributionChart'
import CustomerTable from './components/CustomerTable'
import styles from './App.module.css'

const monthlyTrend = getMonthlyTrend()

export default function App() {
  const [filters, setFilters] = useState({
    region: 'Todos',
    category: 'Todas',
    risk: 'Todos',
    status: 'Todos',
  })

  const filtered = useMemo(() => {
    return customers.filter(c => {
      if (filters.region !== 'Todos' && c.region !== filters.region) return false
      if (filters.category !== 'Todas' && c.category !== filters.category) return false
      if (filters.risk !== 'Todos' && c.churnRisk !== filters.risk) return false
      if (filters.status === 'Activo' && c.churned) return false
      if (filters.status === 'Perdido' && !c.churned) return false
      return true
    })
  }, [filters])

  const kpis = useMemo(() => getKPIs(filtered), [filtered])
  const byRegion = useMemo(() => getChurnByRegion(filtered), [filtered])
  const byCategory = useMemo(() => getChurnByCategory(filtered), [filtered])
  const byAge = useMemo(() => getAgeDistribution(filtered), [filtered])

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.headerTitle}>
              📊 Customer Churn Dashboard
            </h1>
            <p className={styles.headerSub}>Retail Intelligence — Datos de ejemplo</p>
          </div>
          <span className={styles.badge}>
            Última actualización: junio 2025
          </span>
        </div>
      </header>

      <main className={styles.main}>
        {/* Filtros */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* KPIs */}
        <section className={styles.kpiGrid}>
          <KPICard
            title="Total Clientes"
            value={kpis.total.toLocaleString()}
            subtitle="En el segmento seleccionado"
            color="#4f46e5"
            icon="👥"
          />
          <KPICard
            title="Clientes Activos"
            value={kpis.active.toLocaleString()}
            subtitle={`${(100 - kpis.churnRate)}% del total`}
            color="#10b981"
            icon="✅"
          />
          <KPICard
            title="Tasa de Churn"
            value={`${kpis.churnRate}%`}
            subtitle={`${kpis.churned} clientes perdidos`}
            color="#f43f5e"
            icon="📉"
          />
          <KPICard
            title="Ingresos Totales"
            value={`$${(kpis.totalRevenue / 1000).toFixed(0)}K`}
            subtitle="Gasto acumulado"
            color="#f59e0b"
            icon="💰"
          />
          <KPICard
            title="Ingresos en Riesgo"
            value={`$${kpis.revenueAtRisk.toFixed(0)}/mes`}
            subtitle="Clientes perdidos + riesgo alto"
            color="#8b5cf6"
            icon="⚠️"
          />
        </section>

        {/* Gráficos fila 1 */}
        <section className={styles.chartRow}>
          <ChurnByRegionChart data={byRegion} />
          <ChurnByCategoryChart data={byCategory} />
        </section>

        {/* Tendencia temporal */}
        <ChurnTrendChart data={monthlyTrend} />

        {/* Gráficos fila 2 */}
        <AgeDistributionChart data={byAge} />

        {/* Tabla */}
        <CustomerTable data={filtered} />
      </main>
    </div>
  )
}
