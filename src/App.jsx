import { useState, useMemo } from 'react'
import {
  customers,
  getKPIs,
  getChurnByRegion,
  getChurnBySegment,
  getChurnByChannel,
  getAgeDistribution,
  getMonthlyTrend,
} from './data/mockData'
import KPICard from './components/KPICard'
import FilterBar from './components/FilterBar'
import ChurnByRegionChart from './components/ChurnByRegionChart'
import ChurnByCategoryChart from './components/ChurnByCategoryChart'
import ChurnByChannelChart from './components/ChurnByChannelChart'
import ChurnTrendChart from './components/ChurnTrendChart'
import AgeDistributionChart from './components/AgeDistributionChart'
import CustomerTable from './components/CustomerTable'
import styles from './App.module.css'

const monthlyTrend = getMonthlyTrend()

const DEFAULT_FILTERS = { region: 'All', segment: 'All', channel: 'All', risk: 'All', status: 'All' }

export default function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const filtered = useMemo(() => {
    return customers.filter(c => {
      if (filters.region !== 'All' && c.region !== filters.region) return false
      if (filters.segment !== 'All' && c.customer_segment !== filters.segment) return false
      if (filters.channel !== 'All' && c.preferred_channel !== filters.channel) return false
      if (filters.risk !== 'All' && c.churn_risk !== filters.risk) return false
      if (filters.status === 'Active' && c.churn_flag === 1) return false
      if (filters.status === 'Churned' && c.churn_flag === 0) return false
      return true
    })
  }, [filters])

  const kpis = useMemo(() => getKPIs(filtered), [filtered])
  const byRegion = useMemo(() => getChurnByRegion(filtered), [filtered])
  const bySegment = useMemo(() => getChurnBySegment(filtered), [filtered])
  const byChannel = useMemo(() => getChurnByChannel(filtered), [filtered])
  const byAge = useMemo(() => getAgeDistribution(filtered), [filtered])

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.headerTitle}>📊 Retail Intelligence — Customer Churn</h1>
            <p className={styles.headerSub}>Datos mock alineados con el dataset real · {customers.length} registros</p>
          </div>
          <span className={styles.badge}>Junio 2025</span>
        </div>
      </header>

      <main className={styles.main}>
        <FilterBar filters={filters} onChange={setFilters} />

        {/* KPIs */}
        <section className={styles.kpiGrid}>
          <KPICard title="Total Clientes" value={kpis.total.toLocaleString()}
            subtitle="Registros en el segmento" color="#4f46e5" icon="👥" />
          <KPICard title="Clientes Activos" value={kpis.active.toLocaleString()}
            subtitle={`${(100 - kpis.churnRate).toFixed(1)}% de retención`} color="#10b981" icon="✅" />
          <KPICard title="Tasa de Churn" value={`${kpis.churnRate}%`}
            subtitle={`${kpis.churned} clientes perdidos`} color="#f43f5e" icon="📉" />
          <KPICard title="Ticket Promedio" value={`$${kpis.avgOrderValue.toFixed(0)}`}
            subtitle="avg_order_value medio" color="#f59e0b" icon="🛒" />
          <KPICard title="Ingresos en Riesgo" value={`$${(kpis.revenueAtRisk / 1000).toFixed(1)}K`}
            subtitle="Churn flag=1 + riesgo alto" color="#8b5cf6" icon="⚠️" />
        </section>

        {/* Fila 1: región + segmento */}
        <section className={styles.chartRow}>
          <ChurnByRegionChart data={byRegion} />
          <ChurnByCategoryChart data={bySegment} />
        </section>

        {/* Fila 2: canal + edad */}
        <section className={styles.chartRow}>
          <ChurnByChannelChart data={byChannel} />
          <AgeDistributionChart data={byAge} />
        </section>

        {/* Tendencia temporal */}
        <ChurnTrendChart data={monthlyTrend} />

        {/* Tabla */}
        <CustomerTable data={filtered} />
      </main>
    </div>
  )
}
