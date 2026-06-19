import { PieChart } from '@mui/x-charts/PieChart'
import ChartCard from './ChartCard'

const COLORS = ['#4f46e5', '#f43f5e', '#10b981', '#f59e0b']

export default function ChurnBySegmentChart({ data }) {
  const series = data.map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }))

  return (
    <ChartCard title="Bajas por Segmento" subtitle="Clientes perdidos por customer_segment">
      <PieChart
        height={260}
        series={[{
          data: series,
          innerRadius: 55,
          outerRadius: 100,
          paddingAngle: 3,
          cornerRadius: 5,
          highlightScope: { faded: 'global', highlighted: 'item' },
        }]}
        slotProps={{ legend: { direction: 'column', position: { vertical: 'middle', horizontal: 'right' } } }}
      />
    </ChartCard>
  )
}
