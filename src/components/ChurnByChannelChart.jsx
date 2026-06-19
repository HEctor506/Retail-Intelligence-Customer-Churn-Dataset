import { BarChart } from '@mui/x-charts/BarChart'
import ChartCard from './ChartCard'

export default function ChurnByChannelChart({ data }) {
  const channels = data.map(d => d.channel)
  const activos = data.map(d => d.active)
  const bajas = data.map(d => d.churned)

  return (
    <ChartCard title="Churn por Canal" subtitle="Activos vs perdidos por preferred_channel">
      <BarChart
        height={260}
        xAxis={[{ scaleType: 'band', data: channels }]}
        series={[
          { data: activos, label: 'Activos', color: '#10b981' },
          { data: bajas, label: 'Perdidos', color: '#f43f5e' },
        ]}
        borderRadius={6}
      />
    </ChartCard>
  )
}
