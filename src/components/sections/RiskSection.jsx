import { useMemo } from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { getRiskDistribution, getRiskByRegion, getHighRiskCustomers } from '../../data/mockData'
import ChartCard from '../ChartCard'

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

function RiskSummaryCard({ risk, count, pct }) {
  const palette = {
    High:   { border: '#f43f5e', bg: '#fff5f7', dot: '#f43f5e', text: '#e11d48', label: '#fda4af' },
    Medium: { border: '#f59e0b', bg: '#fffbeb', dot: '#f59e0b', text: '#d97706', label: '#fcd34d' },
    Low:    { border: '#10b981', bg: '#f0fdf4', dot: '#10b981', text: '#059669', label: '#6ee7b7' },
  }
  const p = palette[risk]
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e8edf3',
      borderTop: `4px solid ${p.border}`,
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.dot }} />
        <span style={{ fontSize: '12px', fontWeight: 700, color: p.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {risk}
        </span>
      </div>
      <p className="kpi-value" style={{ fontSize: '36px', fontWeight: 900, color: p.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {count.toLocaleString()}
      </p>
      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>{pct}% del total</p>
    </div>
  )
}

function RiskBadge({ risk }) {
  const palette = {
    High:   { bg: '#fef2f2', color: '#e11d48', dot: '#f43f5e' },
    Medium: { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
    Low:    { bg: '#f0fdf4', color: '#059669', dot: '#10b981' },
  }
  const p = palette[risk] || {}
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '999px',
      background: p.bg, color: p.color,
      fontSize: '11px', fontWeight: 700,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.dot }} />
      {risk}
    </span>
  )
}

export default function RiskSection({ data }) {
  const riskDist   = useMemo(() => getRiskDistribution(data), [data])
  const riskRegion = useMemo(() => getRiskByRegion(data), [data])
  const highRisk   = useMemo(() => getHighRiskCustomers(data, 15), [data])

  const totalHigh = riskDist.find(r => r.risk === 'High')?.count ?? 0
  const totalMed  = riskDist.find(r => r.risk === 'Medium')?.count ?? 0
  const totalLow  = riskDist.find(r => r.risk === 'Low')?.count ?? 0
  const total     = data.length || 1

  const COLS = ['ID', 'Edad', 'Región', 'Segmento', 'Canal', 'Recency', 'Loyalty', 'Ticket Avg', 'Revenue Riesgo', 'Riesgo']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>

      {/* Summary cards */}
      <section>
        <SectionHeader title="Resumen de Riesgo" description="Clientes clasificados por probabilidad de abandono" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          <RiskSummaryCard risk="High"   count={totalHigh} pct={((totalHigh/total)*100).toFixed(1)} />
          <RiskSummaryCard risk="Medium" count={totalMed}  pct={((totalMed/total)*100).toFixed(1)} />
          <RiskSummaryCard risk="Low"    count={totalLow}  pct={((totalLow/total)*100).toFixed(1)} />
        </div>
      </section>

      {/* Charts */}
      <section>
        <SectionHeader title="Distribución Visual" description="Comparativa de riesgo por nivel y por región geográfica" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <ChartCard title="Distribución de Riesgo" subtitle="Clientes por nivel de riesgo de churn">
            <BarChart
              height={280}
              xAxis={[{ scaleType: 'band', data: riskDist.map(r => r.risk) }]}
              series={[{ data: riskDist.map(r => r.count), label: 'Clientes', color: '#f43f5e' }]}
              borderRadius={8}
            />
          </ChartCard>

          <ChartCard title="Riesgo por Región" subtitle="Distribución High / Medium / Low por zona">
            <BarChart
              height={280}
              xAxis={[{ scaleType: 'band', data: riskRegion.map(r => r.region) }]}
              series={[
                { data: riskRegion.map(r => r.High),   label: 'High',   color: '#f43f5e', stack: 'risk' },
                { data: riskRegion.map(r => r.Medium), label: 'Medium', color: '#f59e0b', stack: 'risk' },
                { data: riskRegion.map(r => r.Low),    label: 'Low',    color: '#10b981', stack: 'risk' },
              ]}
              borderRadius={6}
            />
          </ChartCard>
        </div>
      </section>

      {/* High-risk table */}
      <section>
        <SectionHeader title="Clientes de Alto Riesgo" description="Ordenados por revenue potencial (avg_order × frecuencia)" />
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e8edf3',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          {/* Table header bar */}
          <div style={{
            padding: '20px 28px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Mostrando top 15 por revenue en riesgo
            </p>
            <span style={{
              fontSize: '12px', fontWeight: 700,
              padding: '4px 12px', borderRadius: '999px',
              background: '#fef2f2', color: '#e11d48',
            }}>
              {totalHigh.toLocaleString()} clientes High Risk
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {COLS.map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: '10px', fontWeight: 700,
                      color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em',
                      whiteSpace: 'nowrap', borderBottom: '1px solid #e8edf3',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {highRisk.map((c, i) => (
                  <tr key={c.customer_id} style={{
                    background: i % 2 === 0 ? '#fff' : '#fafbfc',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fff5f7'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafbfc'}
                  >
                    <td style={{ padding: '13px 16px', fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8' }}>{c.customer_id}</td>
                    <td style={{ padding: '13px 16px', color: '#475569' }}>{c.age_group}</td>
                    <td style={{ padding: '13px 16px', color: '#475569' }}>{c.region}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                        {c.customer_segment}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', color: '#64748b' }}>{c.preferred_channel}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: c.recency_days > 200 ? '#e11d48' : c.recency_days > 100 ? '#d97706' : '#64748b' }}>
                        {c.recency_days}d
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '48px', height: '5px', background: '#e8edf3', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${c.loyalty_score}%`, background: '#0891b2', borderRadius: '99px' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{c.loyalty_score}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', fontWeight: 700, color: '#1e293b' }}>${c.avg_order_value.toFixed(0)}</td>
                    <td style={{ padding: '13px 16px', fontWeight: 800, color: '#e11d48' }}>
                      ${(c.avg_order_value * c.purchase_frequency).toFixed(0)}
                    </td>
                    <td style={{ padding: '13px 16px' }}><RiskBadge risk={c.churn_risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  )
}
