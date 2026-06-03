import { BarChart } from '@mui/x-charts/BarChart'
import ChartCard from './ChartCard'

export default function AgeDistributionChart({ data }) {
  const labels = data.map(d => d.label)
  const activos = data.map(d => d.active)
  const bajas = data.map(d => d.churned)

  return (
    <ChartCard title="Distribución por Edad" subtitle="Segmento de clientes activos vs perdidos">
      <BarChart
        height={260}
        xAxis={[{ scaleType: 'band', data: labels }]}
        series={[
          { data: activos, label: 'Activos', color: '#6366f1', stack: 'total' },
          { data: bajas, label: 'Perdidos', color: '#fb7185', stack: 'total' },
        ]}
        borderRadius={6}
      />
    </ChartCard>
  )
}
