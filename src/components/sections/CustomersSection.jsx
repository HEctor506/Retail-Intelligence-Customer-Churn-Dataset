import { useMemo } from 'react'
import { getSegmentMetrics } from '../../data/mockData'
import CustomerTable from '../CustomerTable'

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

const SEG_PALETTE = {
  Loyal:     { bg: '#eff6ff', color: '#1d4ed8', bar: '#3b82f6' },
  VIP:       { bg: '#f5f3ff', color: '#6d28d9', bar: '#8b5cf6' },
  New:       { bg: '#f0fdf4', color: '#15803d', bar: '#10b981' },
  Returning: { bg: '#fffbeb', color: '#b45309', bar: '#f59e0b' },
}

export default function CustomersSection({ data }) {
  const metrics = useMemo(() => getSegmentMetrics(data), [data])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>

      {/* Segment summary */}
      <section>
        <SectionHeader title="Segmentos de Clientes" description="Retención, loyalty y gasto promedio por tipo de cliente" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {metrics.map(m => {
            const p = SEG_PALETTE[m.segment] || { bg: '#f8fafc', color: '#475569', bar: '#94a3b8' }
            return (
              <div key={m.segment} style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #e8edf3',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
              }}>
                {/* Segment badge */}
                <span style={{
                  display: 'inline-block',
                  fontSize: '11px', fontWeight: 700,
                  padding: '4px 12px', borderRadius: '999px',
                  background: p.bg, color: p.color,
                  letterSpacing: '0.05em',
                }}>
                  {m.segment}
                </span>

                {/* Count */}
                <p className="kpi-value" style={{ fontSize: '32px', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em', marginTop: '16px', lineHeight: 1 }}>
                  {m.total.toLocaleString()}
                </p>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>clientes en este segmento</p>

                {/* Retention bar */}
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Retención</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>{m.retentionRate}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: '#e8edf3', borderRadius: '99px' }}>
                    <div style={{ height: '100%', width: `${m.retentionRate}%`, background: p.bar, borderRadius: '99px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <div style={{ flex: 1, background: '#f8fafc', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Loyalty avg</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{m.avgLoyalty}</p>
                  </div>
                  <div style={{ flex: 1, background: '#f8fafc', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                    <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Gasto avg</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>${m.avgSpend.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Customer table */}
      <section>
        <SectionHeader title="Tabla de Clientes" description="Listado detallado con filtros activos aplicados" />
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e8edf3',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          <CustomerTable data={data} />
        </div>
      </section>

    </div>
  )
}
