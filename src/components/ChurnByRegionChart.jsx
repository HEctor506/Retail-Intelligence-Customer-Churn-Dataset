import { BarChart } from '@mui/x-charts/BarChart'
import ChartCard from './ChartCard'

export default function ChurnByRegionChart({ data }) {
  const regions = data.map(d => d.region)
  const activos = data.map(d => d.active)
  const bajas = data.map(d => d.churned)

  return (
    <ChartCard title="Churn por Región" subtitle="Clientes activos vs perdidos">
      <BarChart
        height={260}
        xAxis={[{ scaleType: 'band', data: regions }]}
        series={[
          { data: activos, label: 'Activos', color: '#4f46e5' },
          { data: bajas, label: 'Perdidos', color: '#f43f5e' },
        ]}
        borderRadius={6}
        slotProps={{ legend: { hidden: false } }}
      />
    </ChartCard>
  )
}
