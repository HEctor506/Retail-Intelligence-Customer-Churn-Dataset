import { LayoutDashboard, ShieldAlert, Users, Radio, TrendingDown } from 'lucide-react'

const NAV = [
  { id: 'overview',  label: 'Overview',       sub: 'Visión general',     icon: LayoutDashboard },
  { id: 'risk',      label: 'Risk Analysis',  sub: 'Clientes en riesgo', icon: ShieldAlert },
  { id: 'customers', label: 'Customers',      sub: 'Segmentos y tabla',  icon: Users },
  { id: 'channels',  label: 'Channels',       sub: 'Canales de venta',   icon: Radio },
]

const S = {
  aside: {
    width: '240px',
    flexShrink: 0,
    background: '#060d1a',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  brand: { padding: '28px 20px 24px' },
  logoBox: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: {
    width: '40px', height: '40px',
    background: 'linear-gradient(135deg, #0891b2, #0e7490)',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(8,145,178,0.35)',
  },
  logoTitle: { fontSize: '14px', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 },
  logoSub:   { fontSize: '11px', color: '#22d3ee', fontWeight: 500, marginTop: '1px' },
  divider:   { margin: '0 16px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  navLabel: {
    padding: '16px 20px 8px',
    fontSize: '10px', fontWeight: 700,
    color: '#334155',
    textTransform: 'uppercase', letterSpacing: '0.14em',
  },
  nav: { padding: '0 10px', flex: 1 },
  footerLabel: {
    fontSize: '10px', fontWeight: 700,
    color: '#334155',
    textTransform: 'uppercase', letterSpacing: '0.14em',
    marginBottom: '10px',
  },
  footer: { padding: '0 20px 28px' },
  footerText: { fontSize: '11px', color: '#475569', lineHeight: 1.6 },
  statusRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' },
  statusDot: (live) => ({
    width: '7px', height: '7px', borderRadius: '50%',
    background: live ? '#10b981' : '#f59e0b',
    animation: live ? 'pulse 2s infinite' : 'none',
    flexShrink: 0,
  }),
  statusText: { fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' },
  countText: { fontSize: '11px', color: '#334155', fontFamily: 'monospace' },
}

function NavBtn({ item, active, onClick }) {
  const on = active === item.id
  return (
    <button
      onClick={() => onClick(item.id)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '11px 12px',
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        marginBottom: '2px',
        background: on ? 'linear-gradient(135deg, #0891b2, #0e7490)' : 'transparent',
        boxShadow: on ? '0 4px 12px rgba(8,145,178,0.3)' : 'none',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
      onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent' }}
    >
      <item.icon size={15} style={{ color: on ? '#fff' : '#475569', flexShrink: 0 }} />
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: on ? '#fff' : '#94a3b8', lineHeight: 1.3 }}>
          {item.label}
        </p>
        <p style={{ fontSize: '11px', color: on ? 'rgba(255,255,255,0.65)' : '#334155', lineHeight: 1.3 }}>
          {item.sub}
        </p>
      </div>
    </button>
  )
}

export default function Sidebar({ active, onNav, source, totalRecords }) {
  const isLive = source === 'firebase'
  return (
    <aside style={S.aside}>
      <div style={S.brand}>
        <div style={S.logoBox}>
          <div style={S.logoIcon}>
            <TrendingDown size={17} color="#fff" />
          </div>
          <div>
            <p style={S.logoTitle}>Retail Intelligence</p>
            <p style={S.logoSub}>Customer Churn</p>
          </div>
        </div>
      </div>

      <div style={S.divider} />

      <p style={S.navLabel}>Dashboard</p>

      <nav style={S.nav}>
        {NAV.map(item => (
          <NavBtn key={item.id} item={item} active={active} onClick={onNav} />
        ))}
      </nav>

      <div style={S.divider} />

      <div style={S.footer}>
        <p style={{ ...S.footerLabel, marginTop: '20px' }}>Fuente de Datos</p>
        <p style={S.footerText}>Retail Intelligence Customer<br />Churn Dataset — Kaggle</p>
        <div style={S.statusRow}>
          <div style={S.statusText}>
            <span style={S.statusDot(isLive)} />
            {isLive ? 'Firebase Live' : 'Mock data'}
          </div>
          <span style={S.countText}>{totalRecords?.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  )
}
