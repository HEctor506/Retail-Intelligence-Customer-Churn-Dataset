import { useMemo } from 'react'
import { Users, UserCheck, TrendingDown, ShoppingCart, AlertTriangle } from 'lucide-react'
import { getKPIs, getChurnByRegion, getChurnBySegment, getAgeDistribution, getMonthlyTrend } from '../../data/mockData'
import ChurnByRegionChart from '../ChurnByRegionChart'
import ChurnByCategoryChart from '../ChurnByCategoryChart'
import ChurnTrendChart from '../ChurnTrendChart'
import AgeDistributionChart from '../AgeDistributionChart'

const TREND = getMonthlyTrend()

function KPICard({ title, value, subtitle, icon: Icon, accentColor, valueColor, trend, trendUp }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '28px 28px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
      border: '1px solid #e8edf3',
      borderTop: `4px solid ${accentColor}`,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '160px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px',
          background: `${accentColor}14`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} style={{ color: accentColor }} />
        </div>
        {trend != null && (
          <span style={{
            fontSize: '11px', fontWeight: 700,
            padding: '4px 10px', borderRadius: '999px',
            background: trendUp ? '#fef2f2' : '#f0fdf4',
            color: trendUp ? '#e11d48' : '#059669',
          }}>
            {trendUp ? '▲' : '▼'} {trend}%
          </span>
        )}
      </div>
      <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
        {title}
      </p>
      <p className="kpi-value" style={{ fontSize: '32px', fontWeight: 900, color: valueColor, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </p>
      {subtitle && (
        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>{subtitle}</p>
      )}
    </div>
  )
}

function SectionHeader({ title, description }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '24px' }}>
      <div style={{ width: '3px', minHeight: '38px', background: 'linear-gradient(180deg, #0891b2, #0e7490)', borderRadius: '99px', flexShrink: 0 }} />
      <div>
        <h2 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
          {title}
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', fontWeight: 400 }}>{description}</p>
      </div>
    </div>
  )
}

export default function OverviewSection({ data }) {
  const kpis      = useMemo(() => getKPIs(data), [data])
  const byRegion  = useMemo(() => getChurnByRegion(data), [data])
  const bySegment = useMemo(() => getChurnBySegment(data), [data])
  const byAge     = useMemo(() => getAgeDistribution(data), [data])

  const KPIS = [
    { title: 'Total Clientes',    value: kpis.total.toLocaleString(),                    subtitle: 'Registros en la selección activa',         icon: Users,         accentColor: '#0891b2', valueColor: '#0891b2' },
    { title: 'Clientes Activos',  value: kpis.active.toLocaleString(),                   subtitle: `${(100 - kpis.churnRate).toFixed(1)}% tasa de retención`, icon: UserCheck, accentColor: '#10b981', valueColor: '#059669' },
    { title: 'Tasa de Churn',     value: `${kpis.churnRate}%`,                           subtitle: `${kpis.churned.toLocaleString()} perdidos`, icon: TrendingDown,  accentColor: '#f43f5e', valueColor: '#e11d48', trend: 2.1, trendUp: true },
    { title: 'Ticket Promedio',   value: `$${kpis.avgOrderValue.toFixed(0)}`,            subtitle: 'avg_order_value del segmento',              icon: ShoppingCart,  accentColor: '#f59e0b', valueColor: '#d97706' },
    { title: 'Revenue en Riesgo', value: `$${(kpis.revenueAtRisk / 1000).toFixed(0)}K`, subtitle: 'Clientes High + churn_flag = 1',            icon: AlertTriangle, accentColor: '#8b5cf6', valueColor: '#7c3aed' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>

      {/* KPIs */}
      <section>
        <SectionHeader title="Indicadores Clave" description="Métricas principales del segmento seleccionado" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
          {KPIS.map(kpi => <KPICard key={kpi.title} {...kpi} />)}
        </div>
      </section>

      {/* Region + Segment */}
      <section>
        <SectionHeader title="Distribución Geográfica y por Segmento" description="Activos vs. perdidos por región y tipo de cliente" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <ChurnByRegionChart data={byRegion} />
          <ChurnByCategoryChart data={bySegment} />
        </div>
      </section>

      {/* Trend */}
      <section>
        <SectionHeader title="Evolución Temporal" description="Altas, bajas y base activa — últimos 12 meses" />
        <ChurnTrendChart data={TREND} />
      </section>

      {/* Age */}
      <section>
        <SectionHeader title="Churn por Grupo Etario" description="Segmentos demográficos con mayor tasa de abandono" />
        <AgeDistributionChart data={byAge} />
      </section>

    </div>
  )
}
