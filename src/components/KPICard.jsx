import styles from './KPICard.module.css'

export default function KPICard({ title, value, subtitle, color = '#4f46e5', icon }) {
  return (
    <div className={styles.card} style={{ borderTopColor: color }}>
      <div className={styles.header}>
        <span className={styles.icon} style={{ backgroundColor: color + '1a', color }}>
          {icon}
        </span>
        <p className={styles.title}>{title}</p>
      </div>
      <p className={styles.value} style={{ color }}>{value}</p>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  )
}
