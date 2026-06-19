// Mock data aligned with the real Retail Intelligence Customer Churn Dataset
// Columns: customer_id, age_group, gender, region, customer_segment,
//          preferred_channel, purchase_frequency, avg_order_value, total_spent,
//          recency_days, website_visits, discount_usage_rate, email_open_rate,
//          cart_abandonment_rate, loyalty_score, engagement_score, churn_risk, churn_flag

const AGE_GROUPS = ['18-24', '25-34', '35-44', '45-54', '55+']
const GENDERS = ['Male', 'Female', 'Other']
const REGIONS = ['North', 'South', 'East', 'West', 'Central']
const SEGMENTS = ['Loyal', 'New', 'VIP', 'Returning']
const CHANNELS = ['Online', 'Mobile App', 'In-Store']
const FREQUENCIES = [1, 2, 3, 5, 8, 12, 20, 35, 60]

function seededRand(seed) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function pick(arr, r) { return arr[Math.floor(r * arr.length)] }
function round2(n) { return Math.round(n * 100) / 100 }

function generateCustomers(count = 300) {
  const rand = seededRand(42)
  const customers = []

  for (let i = 0; i < count; i++) {
    const purchaseFreq = pick(FREQUENCIES, rand())
    const avgOrderValue = round2(rand() * 380 + 20)
    const totalSpent = round2(avgOrderValue * purchaseFreq * (rand() * 2 + 0.5))
    const recencyDays = Math.floor(rand() * 365)
    const websiteVisits = Math.floor(rand() * 330) + 2
    const discountUsageRate = round2(rand())
    const emailOpenRate = round2(rand())
    const cartAbandonmentRate = round2(rand())
    const loyaltyScore = Math.floor(rand() * 100)
    const engagementScore = round2(rand() * 99 + 1)

    // churn_risk logic aligned with dataset patterns
    const riskScore =
      (recencyDays / 365) * 0.35 +
      cartAbandonmentRate * 0.25 +
      (1 - loyaltyScore / 100) * 0.25 +
      (1 - emailOpenRate) * 0.15

    const churnRisk = riskScore > 0.62 ? 'High' : riskScore > 0.4 ? 'Medium' : 'Low'
    const churnFlag = riskScore > 0.58 ? 1 : 0

    customers.push({
      customer_id: `C${String(i + 1).padStart(6, '0')}`,
      age_group: pick(AGE_GROUPS, rand()),
      gender: pick(GENDERS, rand()),
      region: pick(REGIONS, rand()),
      customer_segment: pick(SEGMENTS, rand()),
      preferred_channel: pick(CHANNELS, rand()),
      purchase_frequency: purchaseFreq,
      avg_order_value: avgOrderValue,
      total_spent: totalSpent,
      recency_days: recencyDays,
      website_visits: websiteVisits,
      discount_usage_rate: discountUsageRate,
      email_open_rate: emailOpenRate,
      cart_abandonment_rate: cartAbandonmentRate,
      loyalty_score: loyaltyScore,
      engagement_score: engagementScore,
      churn_risk: churnRisk,
      churn_flag: churnFlag,
    })
  }

  return customers
}

export const customers = generateCustomers(300)

// ── Aggregates ────────────────────────────────────────────────────────────────

export function getKPIs(data) {
  const total = data.length
  const churned = data.filter(c => c.churn_flag === 1).length
  const active = total - churned
  const churnRate = total > 0 ? ((churned / total) * 100).toFixed(1) : '0.0'
  const totalRevenue = data.reduce((s, c) => s + c.total_spent, 0)
  const avgOrderValue = data.length > 0
    ? data.reduce((s, c) => s + c.avg_order_value, 0) / data.length
    : 0
  const revenueAtRisk = data
    .filter(c => c.churn_flag === 1 || c.churn_risk === 'High')
    .reduce((s, c) => s + c.avg_order_value * c.purchase_frequency, 0)

  return { total, churned, active, churnRate, totalRevenue, avgOrderValue, revenueAtRisk }
}

export function getChurnByRegion(data) {
  return REGIONS.map(region => {
    const group = data.filter(c => c.region === region)
    const churned = group.filter(c => c.churn_flag === 1).length
    return { region, total: group.length, churned, active: group.length - churned }
  })
}

export function getChurnBySegment(data) {
  return SEGMENTS.map((seg, i) => {
    const group = data.filter(c => c.customer_segment === seg)
    const churned = group.filter(c => c.churn_flag === 1).length
    return { id: i, value: churned, label: seg }
  }).filter(d => d.value > 0)
}

export function getChurnByChannel(data) {
  return CHANNELS.map(ch => {
    const group = data.filter(c => c.preferred_channel === ch)
    const churned = group.filter(c => c.churn_flag === 1).length
    return { channel: ch, total: group.length, churned, active: group.length - churned }
  })
}

export function getAgeDistribution(data) {
  return AGE_GROUPS.map(ag => {
    const group = data.filter(c => c.age_group === ag)
    const churned = group.filter(c => c.churn_flag === 1).length
    return { label: ag, total: group.length, churned, active: group.length - churned }
  })
}

export function getMonthlyTrend() {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const rand = seededRand(7)
  let active = 980
  return months.map(month => {
    const nuevos = Math.floor(rand() * 40) + 20
    const bajas = Math.floor(rand() * 25) + 10
    active = active + nuevos - bajas
    return { month, activos: active, nuevos, bajas }
  })
}

export function getRiskDistribution(data) {
  return ['Low', 'Medium', 'High'].map(risk => ({
    risk,
    count: data.filter(c => c.churn_risk === risk).length,
  }))
}
