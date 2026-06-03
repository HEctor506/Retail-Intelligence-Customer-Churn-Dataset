// Mock data based on Retail Intelligence Customer Churn Dataset structure
// Fields: id, name, age, gender, region, category, tenureMonths,
//         monthlySpend, totalSpend, numPurchases, daysSinceLastPurchase,
//         supportTickets, loyaltyScore, churnRisk, churned, joinDate

const REGIONS = ['Norte', 'Sur', 'Este', 'Oeste']
const CATEGORIES = ['Electrónica', 'Ropa', 'Alimentos', 'Belleza', 'Deportes']
const GENDERS = ['Masculino', 'Femenino']
const RISK_LEVELS = ['Bajo', 'Medio', 'Alto']

const NAMES = [
  'Ana García', 'Carlos López', 'María Martínez', 'José Rodríguez', 'Laura Sánchez',
  'Miguel Torres', 'Isabel Flores', 'Pedro Ramírez', 'Sofía Herrera', 'Juan Morales',
  'Carmen Jiménez', 'Luis Vargas', 'Elena Castro', 'Roberto Romero', 'Patricia Díaz',
  'Fernando Ruiz', 'Claudia Mendoza', 'Ricardo Álvarez', 'Mónica Reyes', 'Alejandro Cruz',
  'Valeria Ortega', 'Sergio Gutiérrez', 'Adriana Muñoz', 'Daniel Navarro', 'Gabriela Ramos',
  'Eduardo Medina', 'Natalia Suárez', 'Andrés Peña', 'Lucía Mora', 'Oscar Vega',
  'Diana Rojas', 'Héctor Guerrero', 'Beatriz Soto', 'Marco Castillo', 'Alicia Ríos',
  'Pablo Sandoval', 'Verónica Aguilar', 'Jaime Espinoza', 'Silvia Cabrera', 'Raúl Molina',
]

function seededRand(seed) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function generateCustomers(count = 250) {
  const rand = seededRand(42)
  const customers = []

  for (let i = 0; i < count; i++) {
    const age = Math.floor(rand() * 52) + 18
    const tenureMonths = Math.floor(rand() * 60) + 1
    const monthlySpend = Math.round((rand() * 450 + 50) * 100) / 100
    const numPurchases = Math.floor(rand() * 80) + 1
    const daysSinceLast = Math.floor(rand() * 180)
    const supportTickets = Math.floor(rand() * 8)
    const loyaltyScore = Math.round(rand() * 100)

    // Churn logic: high spend + low days since purchase + high loyalty → less likely to churn
    const churnScore =
      (daysSinceLast / 180) * 0.4 +
      (supportTickets / 8) * 0.3 +
      (1 - loyaltyScore / 100) * 0.3

    const churned = churnScore > 0.55
    const churnRisk =
      churnScore > 0.65 ? 'Alto' : churnScore > 0.4 ? 'Medio' : 'Bajo'

    const year = 2022 + Math.floor(rand() * 2)
    const month = String(Math.floor(rand() * 12) + 1).padStart(2, '0')
    const day = String(Math.floor(rand() * 28) + 1).padStart(2, '0')

    customers.push({
      id: `C${String(i + 1).padStart(4, '0')}`,
      name: NAMES[i % NAMES.length],
      age,
      gender: GENDERS[Math.floor(rand() * 2)],
      region: REGIONS[Math.floor(rand() * 4)],
      category: CATEGORIES[Math.floor(rand() * 5)],
      tenureMonths,
      monthlySpend,
      totalSpend: Math.round(monthlySpend * tenureMonths * 100) / 100,
      numPurchases,
      daysSinceLastPurchase: daysSinceLast,
      supportTickets,
      loyaltyScore,
      churnRisk,
      churned,
      joinDate: `${year}-${month}-${day}`,
    })
  }

  return customers
}

export const customers = generateCustomers(250)

// Derived aggregates for charts
export function getKPIs(data) {
  const total = data.length
  const churned = data.filter(c => c.churned).length
  const active = total - churned
  const churnRate = ((churned / total) * 100).toFixed(1)
  const totalRevenue = data.reduce((s, c) => s + c.totalSpend, 0)
  const revenueAtRisk = data
    .filter(c => c.churned || c.churnRisk === 'Alto')
    .reduce((s, c) => s + c.monthlySpend, 0)

  return { total, churned, active, churnRate, totalRevenue, revenueAtRisk }
}

export function getChurnByRegion(data) {
  return REGIONS.map(region => {
    const group = data.filter(c => c.region === region)
    const churned = group.filter(c => c.churned).length
    return { region, total: group.length, churned, active: group.length - churned }
  })
}

export function getChurnByCategory(data) {
  return CATEGORIES.map((cat, i) => {
    const group = data.filter(c => c.category === cat)
    const churned = group.filter(c => c.churned).length
    return { id: i, value: churned, label: cat }
  }).filter(d => d.value > 0)
}

export function getAgeDistribution(data) {
  const brackets = [
    { label: '18–24', min: 18, max: 24 },
    { label: '25–34', min: 25, max: 34 },
    { label: '35–44', min: 35, max: 44 },
    { label: '45–54', min: 45, max: 54 },
    { label: '55–69', min: 55, max: 69 },
  ]
  return brackets.map(b => {
    const group = data.filter(c => c.age >= b.min && c.age <= b.max)
    const churned = group.filter(c => c.churned).length
    return { label: b.label, total: group.length, churned, active: group.length - churned }
  })
}

export function getMonthlyTrend() {
  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ]
  const rand = seededRand(7)
  let active = 980
  return months.map(month => {
    const newCustomers = Math.floor(rand() * 40) + 20
    const churned = Math.floor(rand() * 25) + 10
    active = active + newCustomers - churned
    return { month, activos: active, nuevos: newCustomers, bajas: churned }
  })
}

export function getRiskDistribution(data) {
  return RISK_LEVELS.map(risk => ({
    risk,
    count: data.filter(c => c.churnRisk === risk).length,
  }))
}
