import { useMemo } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { getChannelMetrics, getChurnByChannel } from '../../data/mockData'
import ChartCard from '../ChartCard'
import ChurnByChannelChart from '../ChurnByChannelChart'

function SectionHeader({ title, description }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '24px' }}>
      <div style={{ width: '3px', minHeight: '38px', background: 'linear-gradient(180deg, #0891b2, #0e7490)', borderRadius: '99px', flexShrink: 0 }} />
      <div>
        <h2 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
          {title}
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>{description}</p>
      </div>
    </div>
  )
}

const CH_PALETTE = {
  'Online':     { border: '#3b82f6', bg: '#eff6ff', color: '#1d4ed8', icon: '🌐' },
  'Mobile App': { border: '#8b5cf6', bg: '#f5f3ff', color: '#6d28d9', icon: '📱' },
  'In-Store':   { border: '#f59e0b', bg: '#fffbeb', color: '#b45309', icon: '🏪' },
}

export default function ChannelsSection({ data }) {
  const metrics   = useMemo(() => getChannelMetrics(data), [data])
  const churnByCh = useMemo(() => getChurnByChannel(data), [data])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>

      {/* Channel cards */}
      <section>
        <SectionHeader title="Resumen por Canal" description="Rendimiento, engagement y churn por canal de venta" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {metrics.map(m => {
            const p = CH_PALETTE[m.channel] || { border: '#94a3b8', bg: '#f8fafc', color: '#475569', icon: '🔗' }
            const churnRate = m.total > 0 ? ((m.churned / m.total) * 100).toFixed(1) : 0
            return (
              <div key={m.channel} style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #e8edf3',
                borderLeft: `4px solid ${p.border}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
              }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '22px' }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>{m.channel}</p>
                    <p style={{ fontSize: '11px', color: '#94a3b8' }}>{m.total.toLocaleString()} clientes</p>
                  </div>
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { label: 'Ticket avg', value: `$${m.avgOrder}`, color: '#1e293b' },
                    { label: 'Engagement', value: m.avgEngagement, color: '#0891b2' },
                    { label: 'Loyalty',    value: m.avgLoyalty,    color: '#059669' },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                      <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '5px' }}>{label}</p>
                      <p style={{ fontSize: '17px', fontWeight: 800, color }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Churn rate bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Churn rate</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#e11d48' }}>{churnRate}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: '#e8edf3', borderRadius: '99px' }}>
                    <div style={{ height: '100%', width: `${churnRate}%`, background: '#f43f5e', borderRadius: '99px' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Charts */}
      <section>
        <SectionHeader title="Análisis Gráfico" description="Churn, ticket, engagement y loyalty comparados por canal" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <ChurnByChannelChart data={churnByCh} />
          <ChartCard title="Ticket Promedio por Canal" subtitle="avg_order_value comparativo">
            <BarChart
              height={280}
              xAxis={[{ scaleType: 'band', data: metrics.map(m => m.channel) }]}
              series={[{ data: metrics.map(m => m.avgOrder), label: 'Ticket Avg ($)', color: '#0891b2' }]}
              borderRadius={8}
            />
          </ChartCard>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <ChartCard title="Engagement Score por Canal" subtitle="Promedio de engagement_score">
            <BarChart
              height={280}
              xAxis={[{ scaleType: 'band', data: metrics.map(m => m.channel) }]}
              series={[{ data: metrics.map(m => m.avgEngagement), label: 'Engagement', color: '#8b5cf6' }]}
              borderRadius={8}
            />
          </ChartCard>
          <ChartCard title="Loyalty Score por Canal" subtitle="Promedio de loyalty_score">
            <BarChart
              height={280}
              xAxis={[{ scaleType: 'band', data: metrics.map(m => m.channel) }]}
              series={[{ data: metrics.map(m => m.avgLoyalty), label: 'Loyalty', color: '#10b981' }]}
              borderRadius={8}
            />
          </ChartCard>
        </div>
      </section>

    </div>
  )
}
