import { LineChart } from '@mui/x-charts/LineChart'
import ChartCard from './ChartCard'

export default function ChurnTrendChart({ data }) {
  const months = data.map(d => d.month)
  const activos = data.map(d => d.activos)
  const bajas = data.map(d => d.bajas)
  const nuevos = data.map(d => d.nuevos)

  return (
    <ChartCard title="Evolución Temporal" subtitle="Clientes activos, nuevos y bajas — últimos 12 meses">
      <LineChart
        height={260}
        xAxis={[{ scaleType: 'point', data: months }]}
        series={[
          { data: activos, label: 'Activos', color: '#4f46e5', curve: 'monotoneX' },
          { data: nuevos, label: 'Nuevos', color: '#10b981', curve: 'monotoneX' },
          { data: bajas, label: 'Bajas', color: '#f43f5e', curve: 'monotoneX' },
        ]}
      />
    </ChartCard>
  )
}
