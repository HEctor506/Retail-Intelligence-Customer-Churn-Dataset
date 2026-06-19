import { useState, useMemo } from 'react'
import { Menu } from 'lucide-react'
import { useCustomers } from './hooks/useCustomers'
import { useWindowWidth } from './hooks/useWindowWidth'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const width = useWindowWidth()
  const isMobile = width < 768
  const isTablet = width < 1024

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

  function handleNav(sec) {
    setSection(sec)
    if (isMobile) setSidebarOpen(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#060d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div className="w-10 h-10 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Conectando con Firebase…</p>
      </div>
    )
  }

  const meta = SECTION_META[section]
  const hPad = isMobile ? '16px' : isTablet ? '28px' : '56px'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#eef2f7' }}>

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
        />
      )}

      <Sidebar
        active={section}
        onNav={handleNav}
        source={source}
        totalRecords={customers.length}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Header ── */}
        <header style={{ position: 'relative', height: isMobile ? '130px' : '200px', flexShrink: 0, overflow: 'hidden' }}>
          <ShaderBackground />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(6,13,26,0.95) 0%, rgba(6,13,26,0.7) 55%, rgba(6,13,26,0.15) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,13,26,0.6) 0%, transparent 60%)' }} />

          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                position: 'absolute', top: '14px', left: '16px', zIndex: 20,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px', padding: '8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Menu size={18} color="#fff" />
            </button>
          )}

          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: `0 ${hPad} ${isMobile ? '18px' : '32px'}` }}>
            <p style={{ color: '#22d3ee', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: isMobile ? '6px' : '10px' }}>
              {meta.label}
            </p>
            <h1 style={{ fontSize: isMobile ? '20px' : '32px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {meta.title}
            </h1>
            {!isMobile && <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>{meta.sub}</p>}
          </div>
        </header>

        {/* ── Filter bar ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', padding: `12px ${hPad}`, overflowX: 'auto' }}>
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {/* ── Main content ── */}
        <main style={{ flex: 1, overflowY: 'auto', padding: `${isMobile ? '20px' : '48px'} ${hPad} ${isMobile ? '40px' : '80px'}` }}>

          {/* Status pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '24px' : '48px' }}>
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

          {section === 'overview'  && <OverviewSection  data={filtered} isMobile={isMobile} isTablet={isTablet} />}
          {section === 'risk'      && <RiskSection      data={filtered} isMobile={isMobile} />}
          {section === 'customers' && <CustomersSection data={filtered} isMobile={isMobile} />}
          {section === 'channels'  && <ChannelsSection  data={filtered} isMobile={isMobile} />}
        </main>
      </div>
    </div>
  )
}
