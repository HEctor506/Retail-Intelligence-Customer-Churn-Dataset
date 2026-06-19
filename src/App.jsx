import { useState, useMemo } from 'react'
import { useCustomers } from './hooks/useCustomers'
import Sidebar from './components/Sidebar'
import FilterBar from './components/FilterBar'
import ShaderBackground from './components/ui/ShaderBackground'
import OverviewSection from './components/sections/OverviewSection'
import RiskSection from './components/sections/RiskSection'
import CustomersSection from './components/sections/CustomersSection'
import ChannelsSection from './components/sections/ChannelsSection'

const DEFAULT_FILTERS = { region: 'All', segment: 'All', channel: 'All', risk: 'All', status: 'All' }

const SECTION_META = {
  overview:  { label: 'Overview',       title: 'Customer Churn Overview',   sub: 'Visión general de retención y comportamiento de compra' },
  risk:      { label: 'Risk Analysis',  title: 'Risk Analysis',             sub: 'Clientes clasificados por probabilidad de abandono' },
  customers: { label: 'Customers',      title: 'Customer Explorer',         sub: 'Segmentos, perfiles y tabla detallada de clientes' },
  channels:  { label: 'Channels',       title: 'Channel Performance',       sub: 'Comparativa de canales: Online, Mobile App e In-Store' },
}

export default function App() {
  const { customers, loading, source } = useCustomers()
  const [section, setSection] = useState('overview')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const filtered = useMemo(() => customers.filter(c => {
    if (filters.region  !== 'All' && c.region            !== filters.region)  return false
    if (filters.segment !== 'All' && c.customer_segment  !== filters.segment) return false
    if (filters.channel !== 'All' && c.preferred_channel !== filters.channel) return false
    if (filters.risk    !== 'All' && c.churn_risk        !== filters.risk)    return false
    if (filters.status === 'Active'  && c.churn_flag === 1) return false
    if (filters.status === 'Churned' && c.churn_flag === 0) return false
    return true
  }), [customers, filters])

  const hasActiveFilters = Object.values(filters).some(v => v !== 'All')

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div className="w-10 h-10 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Conectando con Firebase…</p>
      </div>
    )
  }

  const meta = SECTION_META[section]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#eef2f7' }}>
      <Sidebar active={section} onNav={setSection} source={source} totalRecords={customers.length} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Header ── */}
        <header style={{ position: 'relative', height: '200px', flexShrink: 0, overflow: 'hidden' }}>
          <ShaderBackground />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(6,13,26,0.95) 0%, rgba(6,13,26,0.7) 55%, rgba(6,13,26,0.15) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,13,26,0.6) 0%, transparent 60%)' }} />
          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 56px 32px' }}>
            <p style={{ color: '#22d3ee', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '10px' }}>
              {meta.label}
            </p>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {meta.title}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>{meta.sub}</p>
          </div>
        </header>

        {/* ── Filter bar ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: '12px 56px' }}>
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {/* ── Main content ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '48px 56px 80px' }}>

          {/* Status pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '999px', padding: '6px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: source === 'firebase' ? '#10b981' : '#f59e0b', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                <strong style={{ color: '#0f172a' }}>{filtered.length.toLocaleString()}</strong>
                {' '}de{' '}
                <strong style={{ color: '#0f172a' }}>{customers.length.toLocaleString()}</strong>
                {' '}clientes
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                style={{ fontSize: '12px', color: '#e11d48', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕ Limpiar filtros
              </button>
            )}
          </div>

          {section === 'overview'  && <OverviewSection  data={filtered} />}
          {section === 'risk'      && <RiskSection      data={filtered} />}
          {section === 'customers' && <CustomersSection data={filtered} />}
          {section === 'channels'  && <ChannelsSection  data={filtered} />}
        </main>
      </div>
    </div>
  )
}
