import React from 'react'

const PaymentsAssistance = () => {
  const kpiCards = [
    { label: 'Active Assistance Programmes', value: '13', detail: 'Programmes currently running', tone: 'text-emerald' },
    { label: 'Total Programme Budget', value: '\u20A62.84bn', detail: 'Allocated across active programmes', tone: 'text-stone-500' },
    { label: 'Total Assistance Approved', value: '\u20A62.31bn', detail: 'Approved for eligible beneficiaries', tone: 'text-stone-500' },
    { label: 'Total Disbursed', value: '\u20A61.87bn', detail: 'Successfully paid out', tone: 'text-emerald' },
    { label: 'Total Beneficiaries', value: '48,726', detail: 'Verified beneficiaries supported', tone: 'text-stone-500' },
    { label: 'Successful Payments', value: '42,381', detail: 'Completed transactions', tone: 'text-emerald' },
    { label: 'Pending Payments', value: '2,184', detail: 'Awaiting processing', tone: 'text-amber-500' },
    { label: 'Failed Payments', value: '1,037', detail: 'Could not be completed', tone: 'text-red-500' },
    { label: 'Unclaimed Assistance', value: '\u20A674.6m', detail: 'Approved but not redeemed', tone: 'text-amber-500' },
    { label: 'Payment Success Rate', value: '93.1%', detail: 'Initiated payments completed', tone: 'text-emerald' },
  ]

  const programmes = [
    { programme: '2026 Benue Flood Relief', type: 'Flood Relief', location: 'Benue', beneficiaries: '8,420', budget: '\u20A6420m', disbursed: '\u20A6356.8m', status: 'Active' },
    { programme: 'Maiduguri Displacement Support', type: 'Humanitarian', location: 'Borno', beneficiaries: '12,750', budget: '\u20A6680m', disbursed: '\u20A6512.4m', status: 'Active' },
    { programme: 'Lagos Flood Emergency', type: 'Flood Relief', location: 'Lagos', beneficiaries: '6,180', budget: '\u20A6310m', disbursed: '\u20A6276.2m', status: 'Active' },
    { programme: 'Northern Food Assistance', type: 'Food Security', location: 'Kano, Katsina, Kaduna', beneficiaries: '9,600', budget: '\u20A6540m', disbursed: '\u20A6398.7m', status: 'Active' },
    { programme: 'Plateau Emergency Relief', type: 'Disaster Relief', location: 'Plateau', beneficiaries: '3,420', budget: '\u20A6180m', disbursed: '\u20A6145.8m', status: 'Active' },
    { programme: 'Rivers Flood Recovery', type: 'Flood Relief', location: 'Rivers', beneficiaries: '4,860', budget: '\u20A6260m', disbursed: '\u20A6182.3m', status: 'Active' },
    { programme: 'Abuja Medical Emergency Support', type: 'Medical', location: 'FCT', beneficiaries: '2,196', budget: '\u20A6120m', disbursed: '\u20A698.4m', status: 'Active' },
    { programme: 'Kogi Displacement Assistance', type: 'Humanitarian', location: 'Kogi', beneficiaries: '1,300', budget: '\u20A695m', disbursed: '\u20A672.6m', status: 'Active' },
    { programme: 'Kaduna Nutrition Recovery', type: 'Food Security', location: 'Kaduna', beneficiaries: '3,980', budget: '\u20A6170m', disbursed: '\u20A6128.6m', status: 'Active' },
    { programme: 'Anambra Flood Protection Support', type: 'Flood Relief', location: 'Anambra', beneficiaries: '2,740', budget: '\u20A6145m', disbursed: '\u20A6109.2m', status: 'Active' },
    { programme: 'Yobe IDP Cash Assistance', type: 'Humanitarian', location: 'Yobe', beneficiaries: '4,120', budget: '\u20A6225m', disbursed: '\u20A6176.4m', status: 'Active' },
    { programme: 'Bayelsa Coastal Recovery', type: 'Disaster Relief', location: 'Bayelsa', beneficiaries: '2,210', budget: '\u20A6115m', disbursed: '\u20A686.7m', status: 'Active' },
    { programme: 'Ogun Household Stabilization Grant', type: 'Livelihood', location: 'Ogun', beneficiaries: '3,360', budget: '\u20A6190m', disbursed: '\u20A6142.1m', status: 'Active' },
  ]

  const disbursementSummary = [
    { status: 'Successful', count: 42381, amount: '\u20A61.87bn', amountValue: 1870, color: '#6DBC85' },
    { status: 'Pending', count: 2184, amount: '\u20A696.2m', amountValue: 96.2, color: '#f59e0b' },
    { status: 'Failed', count: 1037, amount: '\u20A648.7m', amountValue: 48.7, color: '#ef4444' },
    { status: 'Reversed', count: 324, amount: '\u20A614.3m', amountValue: 14.3, color: '#0ea5e9' },
    { status: 'Unclaimed', count: 1642, amount: '\u20A674.6m', amountValue: 74.6, color: '#f97316' },
  ]

  const assistanceByMethod = [
    { method: 'Bank Transfer', beneficiaries: '24,680', amount: '\u20A61.12bn', successRate: 96.4 },
    { method: 'Mobile Wallet', beneficiaries: '7,840', amount: '\u20A6318.5m', successRate: 94.2 },
    { method: 'USSD', beneficiaries: '5,920', amount: '\u20A6186.7m', successRate: 91.8 },
    { method: 'NQR', beneficiaries: '2,840', amount: '\u20A696.4m', successRate: 89.6 },
    { method: 'Voucher', beneficiaries: '1,101', amount: '\u20A652.8m', successRate: 87.3 },
  ]

  const assistanceByState = [
    { state: 'Borno', programmes: 3, beneficiaries: 12750, disbursed: '\u20A6512.4m', success: 91.8 },
    { state: 'Benue', programmes: 2, beneficiaries: 8420, disbursed: '\u20A6356.8m', success: 94.7 },
    { state: 'Kano', programmes: 2, beneficiaries: 5180, disbursed: '\u20A6218.6m', success: 95.1 },
    { state: 'Lagos', programmes: 1, beneficiaries: 6180, disbursed: '\u20A6276.2m', success: 97.2 },
    { state: 'Kaduna', programmes: 2, beneficiaries: 4420, disbursed: '\u20A6180.4m', success: 92.6 },
    { state: 'Rivers', programmes: 1, beneficiaries: 4860, disbursed: '\u20A6182.3m', success: 90.4 },
    { state: 'Plateau', programmes: 1, beneficiaries: 3420, disbursed: '\u20A6145.8m', success: 93.8 },
    { state: 'FCT', programmes: 1, beneficiaries: 2196, disbursed: '\u20A698.4m', success: 97.8 },
    { state: 'Kogi', programmes: 1, beneficiaries: 1300, disbursed: '\u20A672.6m', success: 89.7 },
  ]

  const verificationStatus = [
    { label: 'Fully Verified', beneficiaries: 48726, percentage: 89.4, tone: 'bg-emerald' },
    { label: 'Pending Verification', beneficiaries: 3842, percentage: 7.0, tone: 'bg-amber-500' },
    { label: 'Verification Failed', beneficiaries: 1284, percentage: 2.4, tone: 'bg-red-500' },
    { label: 'Flagged for Review', beneficiaries: 654, percentage: 1.2, tone: 'bg-orange-500' },
  ]

  const verificationMethods = [
    { method: 'National ID / Government ID', verified: 21840 },
    { method: 'Bank Account Verification', verified: 13260 },
    { method: 'Phone Number Verification', verified: 8420 },
    { method: 'Community Verification', verified: 3740 },
    { method: 'Field Officer Verification', verified: 1466 },
  ]

  const paymentProcessing = [
    { label: 'Payments Initiated Today', value: '3,842' },
    { label: 'Successful Today', value: '3,518' },
    { label: 'Pending Today', value: '186' },
    { label: 'Failed Today', value: '98' },
    { label: 'Reversed Today', value: '40' },
    { label: 'Total Value Processed Today', value: '\u20A6142.6m' },
    { label: 'Average Processing Time', value: '2m 18s' },
    { label: 'Average Payment Amount', value: '\u20A641,250' },
  ]

  const failedPaymentReasons = [
    { reason: 'Invalid Bank Account', count: 284 },
    { reason: 'Beneficiary Account Name Mismatch', count: 218 },
    { reason: 'Insufficient Provider Balance', count: 146 },
    { reason: 'Bank Timeout', count: 132 },
    { reason: 'Network Error', count: 118 },
    { reason: 'Beneficiary Account Restricted', count: 84 },
    { reason: 'Other', count: 55 },
  ]

  const riskMetrics = [
    { label: 'Beneficiaries Flagged', value: '654' },
    { label: 'Duplicate Beneficiary Records', value: '218' },
    { label: 'Duplicate Bank Accounts', value: '84' },
    { label: 'Multiple Beneficiaries per Device', value: '127' },
    { label: 'Suspicious Registration Clusters', value: '18' },
    { label: 'Payments Blocked for Review', value: '46' },
    { label: 'Estimated At-Risk Funds', value: '\u20A612.8m' },
  ]

  const riskAlerts = [
    { alert: 'Duplicate beneficiaries detected', location: 'Makurdi, Benue', severity: 'High', status: 'Under Review' },
    { alert: '37 accounts linked to same device', location: 'Maiduguri, Borno', severity: 'High', status: 'Blocked' },
    { alert: 'Unusual registration spike', location: 'Kano Municipal', severity: 'Medium', status: 'Investigating' },
    { alert: 'Multiple payments to same account', location: 'Lagos Island', severity: 'Medium', status: 'Resolved' },
    { alert: 'Beneficiary outside affected zone', location: 'Jos North', severity: 'Low', status: 'Under Review' },
  ]

  const programmePerformance = [
    { programme: 'Benue Flood Relief', target: 10000, verified: 8420, paid: 7980, coverage: 79.8 },
    { programme: 'Maiduguri Displacement Support', target: 15000, verified: 12750, paid: 10840, coverage: 72.3 },
    { programme: 'Lagos Flood Emergency', target: 7000, verified: 6180, paid: 5940, coverage: 84.9 },
    { programme: 'Northern Food Assistance', target: 12000, verified: 9600, paid: 8420, coverage: 70.2 },
    { programme: 'Plateau Emergency Relief', target: 4000, verified: 3420, paid: 2980, coverage: 74.5 },
    { programme: 'Kaduna Nutrition Recovery', target: 5200, verified: 3980, paid: 3610, coverage: 69.4 },
    { programme: 'Anambra Flood Protection Support', target: 3300, verified: 2740, paid: 2520, coverage: 76.4 },
    { programme: 'Yobe IDP Cash Assistance', target: 6000, verified: 4120, paid: 3840, coverage: 64.0 },
    { programme: 'Bayelsa Coastal Recovery', target: 3100, verified: 2210, paid: 1980, coverage: 63.9 },
    { programme: 'Ogun Household Stabilization Grant', target: 4800, verified: 3360, paid: 3050, coverage: 63.5 },
  ]

  const reconciliation = [
    { label: 'Total Funds Allocated', value: '\u20A62.84bn' },
    { label: 'Total Funds Approved', value: '\u20A62.31bn' },
    { label: 'Total Payment Instructions', value: '\u20A61.98bn' },
    { label: 'Successfully Settled', value: '\u20A61.87bn' },
    { label: 'Failed Transactions', value: '\u20A648.7m' },
    { label: 'Reversed Transactions', value: '\u20A614.3m' },
    { label: 'Pending Settlement', value: '\u20A696.2m' },
    { label: 'Unreconciled Amount', value: '\u20A68.4m' },
  ]

  const recentDisbursements = [
    { beneficiary: 'Aisha Mohammed', programme: 'Maiduguri Displacement Support', location: 'Borno', amount: '\u20A650,000', method: 'Bank Transfer', status: 'Successful' },
    { beneficiary: 'John Terna', programme: 'Benue Flood Relief', location: 'Benue', amount: '\u20A650,000', method: 'USSD', status: 'Successful' },
    { beneficiary: 'Chinedu Okafor', programme: 'Lagos Flood Emergency', location: 'Lagos', amount: '\u20A675,000', method: 'Bank Transfer', status: 'Successful' },
    { beneficiary: 'Hauwa Bello', programme: 'Northern Food Assistance', location: 'Kano', amount: '\u20A630,000', method: 'Wallet', status: 'Pending' },
    { beneficiary: 'Daniel James', programme: 'Plateau Emergency Relief', location: 'Plateau', amount: '\u20A650,000', method: 'NQR', status: 'Failed' },
  ]

  const severityTone = {
    High: 'bg-red-500/80 text-red-100',
    Medium: 'bg-amber-500/80 text-amber-100',
    Low: 'bg-emerald/80 text-emerald-100',
  }

  const statusTone = {
    Successful: 'bg-emerald/15 text-emerald',
    Pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    Failed: 'bg-red-500/15 text-red-600 dark:text-red-400',
  }

  const totalDisbursementCount = disbursementSummary.reduce((sum, item) => sum + item.count, 0)
  const maxFailedReasons = Math.max(...failedPaymentReasons.map((item) => item.count))
  const maxStateBeneficiaries = Math.max(...assistanceByState.map((item) => item.beneficiaries))
  const maxCoverage = Math.max(...programmePerformance.map((item) => item.coverage))
  const maxMethodSuccess = Math.max(...assistanceByMethod.map((item) => item.successRate))

  const donutStops = (() => {
    let current = 0
    return disbursementSummary
      .map((item) => {
        const start = current
        const percentage = (item.count / totalDisbursementCount) * 100
        current += percentage
        return `${item.color} ${start.toFixed(2)}% ${current.toFixed(2)}%`
      })
      .join(', ')
  })()

  const chartWidth = 620
  const chartHeight = 180
  const chartPaddingX = 24
  const chartPaddingY = 18
  const coveragePoints = programmePerformance
    .map((item, index) => {
      const x = chartPaddingX + (index * (chartWidth - chartPaddingX * 2)) / (programmePerformance.length - 1)
      const y = chartHeight - chartPaddingY - (item.coverage / maxCoverage) * (chartHeight - chartPaddingY * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <section className="space-y-5">
      <header className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <p className="text-xs uppercase tracking-wide text-emerald">Payments and Assistance Dashboard</p>
        <h2 className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">National Assistance Operations Overview</h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">Verified beneficiary disbursements, programme coverage, payment performance, and risk controls across active humanitarian interventions.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpiCards.map((metric) => (
          <article key={metric.label} className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm shadow-black/5 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">{metric.label}</p>
            <h3 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">{metric.value}</h3>
            <p className={`mt-1 text-xs font-medium ${metric.tone}`}>{metric.detail}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Disbursement Summary</h3>
          <div className="my-4 w-full items-center gap-4">
            <div className="relative mx-auto mb-6 h-52 w-52 shrink-0 rounded-full" style={{ background: `conic-gradient(${donutStops})` }}>
              <div className="absolute inset-4 rounded-full bg-white dark:bg-stone-900" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xs text-stone-500 dark:text-stone-400">Total Events</p>
                <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">{totalDisbursementCount.toLocaleString()}</p>
              </div>
            </div>
            <div className="gap-4 grid grid-cols-2 ">
              {disbursementSummary.map((item) => (
                <div key={item.status} className="flex items-start gap-2 text-xs">
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="font-semibold text-stone-800 dark:text-stone-100">{item.status}</p>
                    <p className="text-stone-500 dark:text-stone-300">{item.count.toLocaleString()} payments • {item.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Payment Processing</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {paymentProcessing.map((item) => (
              <div key={item.label} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-700/50 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{item.value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Reconciliation</h3>
          <div className="mt-3 space-y-2">
            {reconciliation.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
                <span className="text-xs text-stone-600 dark:text-stone-300">{item.label}</span>
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg bg-emerald/15 px-3 py-2 text-sm font-semibold text-emerald">98.7% Reconciled</div>
        </article>
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Assistance Programmes</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Programme</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Location</th>
                <th className="px-2 py-2">Beneficiaries</th>
                <th className="px-2 py-2">Budget</th>
                <th className="px-2 py-2">Disbursed</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((item) => (
                <tr key={item.programme} className="border-b border-stone-100 text-stone-700 dark:border-stone-800 dark:text-stone-200">
                  <td className="px-2 py-2 font-medium">{item.programme}</td>
                  <td className="px-2 py-2">{item.type}</td>
                  <td className="px-2 py-2">{item.location}</td>
                  <td className="px-2 py-2">{item.beneficiaries}</td>
                  <td className="px-2 py-2">{item.budget}</td>
                  <td className="px-2 py-2">{item.disbursed}</td>
                  <td className="px-2 py-2"><span className="rounded-full bg-emerald/15 px-2 py-1 text-xs font-semibold text-emerald">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Assistance by Payment Method</h3>
          <div className="mt-4 space-y-4">
            {assistanceByMethod.map((item) => (
              <div key={item.method}>
                <div className="mb-1 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                  <span>{item.method} • {item.beneficiaries} beneficiaries</span>
                  <span>{item.successRate}%</span>
                </div>
                <div className="h-1 rounded-full mb-2 bg-stone-200 dark:bg-stone-700">
                  <div className="h-1 rounded-full bg-emerald" style={{ width: `${(item.successRate / maxMethodSuccess) * 100}%` }} />
                </div>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Amount disbursed: {item.amount}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Assistance by State</h3>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl bg-linear-to-br from-stone-100 to-stone-200 p-3 dark:from-stone-800/10 dark:to-stone-700/20">
              <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">State Coverage Map</p>
              <div className="mt-2 grid h-44 grid-cols-3 gap-1.5">
                {assistanceByState.map((item) => {
                  const tileAlpha = 0.2 + (item.beneficiaries / maxStateBeneficiaries) * 0.65

                  return (
                    <div
                      key={item.state}
                      className="group relative rounded-md border border-emerald/25 px-2 py-1 text-stone-800 transition-shadow duration-150 hover:shadow-sm dark:text-stone-100"
                      style={{ backgroundColor: `rgb(109 188 133 / ${tileAlpha})` }}
                    >
                      <p className="text-[10px] font-semibold leading-tight">{item.state}</p>
                      <p className="text-[10px] leading-tight">{Math.round(item.beneficiaries / 1000)}k</p>

                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-40 -translate-x-1/2 rounded-md border border-stone-200 bg-white px-2 py-1 text-[11px] text-stone-700 shadow-sm group-hover:block dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">
                        <p className="font-semibold">{item.state}</p>
                        <p>Programmes: {item.programmes}</p>
                        <p>Beneficiaries: {item.beneficiaries.toLocaleString()}</p>
                        <p>Success: {item.success}%</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="space-y-2">
              {assistanceByState.map((item) => (
                <div key={`${item.state}-rank`} className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">{item.state}</p>
                    <p className="text-xs text-emerald">{item.success}% success</p>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-300">{item.beneficiaries.toLocaleString()} beneficiaries • {item.disbursed}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10 xl:col-span-2">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Beneficiary Verification Status</h3>
          <div className="mt-3 space-y-3">
            {verificationStatus.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                  <span>{item.label} • {item.beneficiaries.toLocaleString()}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="h-1 mt-2 rounded-full bg-stone-200 dark:bg-stone-700">
                  <div className={`h-1 rounded-full ${item.tone}`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">Verification Methods</h4>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {verificationMethods.map((item) => (
              <div key={item.method} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-700/50 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">{item.method}</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{item.verified.toLocaleString()} beneficiaries</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Failed Payment Reasons</h3>
          <div className="mt-3 space-y-3">
            {failedPaymentReasons.map((item) => (
              <div key={item.reason}>
                <div className="mb-2 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
                  <span>{item.reason}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-1 rounded-full bg-stone-200 dark:bg-stone-700">
                  <div className="h-1 rounded-full bg-red-500" style={{ width: `${(item.count / maxFailedReasons) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10 xl:col-span-2">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Assistance Programme Performance</h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Coverage trend across ten programmes</p>
          <div className="mt-3 rounded-xl bg-stone-100 p-3 dark:bg-stone-800/20">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-64 w-full" role="img" aria-label="Programme coverage line chart">
              <polyline fill="none" stroke="#6DBC85" strokeWidth="1.75" points={coveragePoints} />
              {programmePerformance.map((item, index) => {
                const x = chartPaddingX + (index * (chartWidth - chartPaddingX * 2)) / (programmePerformance.length - 1)
                const y = chartHeight - chartPaddingY - (item.coverage / maxCoverage) * (chartHeight - chartPaddingY * 2)
                return (
                  <g key={item.programme} className="cursor-pointer">
                    <title>{`${item.programme} | Coverage: ${item.coverage}% | Verified: ${item.verified.toLocaleString()} | Paid: ${item.paid.toLocaleString()}`}</title>
                    <circle cx={x} cy={y} r="6" fill="transparent" />
                    <circle cx={x} cy={y} r="2.7" fill="#91F5AD" />
                    <text x={x} y={chartHeight - 4} textAnchor="middle" fontSize="10" fill="#57534e">P{index + 1}</text>
                  </g>
                )
              })}
            </svg>
            <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">P1 to P10 align with the programme rows shown in the table below.</p>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                  <th className="px-2 py-2">Programme</th>
                  <th className="px-2 py-2">Target</th>
                  <th className="px-2 py-2">Verified</th>
                  <th className="px-2 py-2">Paid</th>
                  <th className="px-2 py-2">Coverage</th>
                </tr>
              </thead>
              <tbody>
                {programmePerformance.map((item) => (
                  <tr key={item.programme} className="border-b border-stone-100 dark:border-stone-800">
                    <td className="px-2 py-2 font-medium text-stone-800 dark:text-stone-100">{item.programme}</td>
                    <td className="px-2 py-2 text-stone-600 dark:text-stone-300">{item.target.toLocaleString()}</td>
                    <td className="px-2 py-2 text-stone-600 dark:text-stone-300">{item.verified.toLocaleString()}</td>
                    <td className="px-2 py-2 text-stone-600 dark:text-stone-300">{item.paid.toLocaleString()}</td>
                    <td className="px-2 py-2 text-emerald font-semibold">{item.coverage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Fraud and Risk Monitoring</h3>
          <div className="mt-3 space-y-2">
            {riskMetrics.map((item) => (
              <div key={item.label} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-700/50 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">{item.label}</p>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{item.value}</p>
              </div>
            ))}
          </div>

          <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">Recent Risk Alerts</h4>
          <div className="mt-2 space-y-2">
            {riskAlerts.map((item) => (
              <div key={item.alert} className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-stone-800 dark:text-stone-100">{item.alert}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${severityTone[item.severity]}`}>{item.severity}</span>
                </div>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-300">{item.location} • {item.status}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Recent Disbursements</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Beneficiary</th>
                <th className="px-2 py-2">Programme</th>
                <th className="px-2 py-2">Location</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Method</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDisbursements.map((item) => (
                <tr key={`${item.beneficiary}-${item.programme}`} className="border-b border-stone-100 dark:border-stone-800">
                  <td className="px-2 py-2 font-medium text-stone-800 dark:text-stone-100">{item.beneficiary}</td>
                  <td className="px-2 py-2 text-stone-600 dark:text-stone-300">{item.programme}</td>
                  <td className="px-2 py-2 text-stone-600 dark:text-stone-300">{item.location}</td>
                  <td className="px-2 py-2 text-stone-700 dark:text-stone-200">{item.amount}</td>
                  <td className="px-2 py-2 text-stone-600 dark:text-stone-300">{item.method}</td>
                  <td className="px-2 py-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusTone[item.status]}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default PaymentsAssistance