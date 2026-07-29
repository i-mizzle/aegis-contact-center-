import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const Budgets = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [stateFilter, setStateFilter] = useState('All')
  const [utilizationFilter, setUtilizationFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 25

  const states = [
    'Lagos',
    'Kano',
    'Kaduna',
    'Borno',
    'Benue',
    'Rivers',
    'FCT',
    'Plateau',
    'Kogi',
    'Anambra',
    'Ogun',
    'Yobe',
  ]

  const statuses = ['Active', 'Planned', 'Paused', 'Closed']

  const budgets = useMemo(() => {
    const demoBaseDate = new Date(2026, 6, 29)
    const programmeNames = [
      'Flood Relief Programme',
      'Food Security Support',
      'Medical Emergency Grant',
      'Displacement Assistance Fund',
      'Household Stabilization Grant',
      'Community Recovery Support',
      'Livelihood Restoration Fund',
      'Emergency Cash Transfer',
    ]

    return Array.from({ length: 50 }, (_, index) => {
      const amountInMillions = 85 + ((index * 23) % 620)
      const utilization = 18 + ((index * 11) % 80)
      const status = statuses[index % statuses.length]
      const programme = programmeNames[index % programmeNames.length]
      const coverageCount = (index % 3) + 1
      const coverageStates = Array.from({ length: coverageCount }, (_, step) => {
        return states[(index + step * 2) % states.length]
      })

      const createdDate = new Date(2026, (index * 7) % 12, (index * 3) % 28 + 1)
      const expiryDate = new Date(demoBaseDate)

      if (index % 10 === 0) {
        expiryDate.setDate(expiryDate.getDate() + 2)
      } else if (index % 10 === 1) {
        expiryDate.setDate(expiryDate.getDate() + 14)
      } else if (index % 10 === 2) {
        expiryDate.setDate(expiryDate.getDate() + 27)
      } else {
        expiryDate.setDate(expiryDate.getDate() + 35 + ((index * 13) % 140))
      }

      return {
        id: `BGT-${(index + 1).toString().padStart(4, '0')}`,
        name: `Assistance Budget ${index + 1}`,
        programme,
        status,
        amount: amountInMillions * 1000000,
        utilization,
        coverageStates,
        createdAt: createdDate,
        expiryAt: expiryDate,
      }
    })
  }, [])

  const utilizationMatch = (utilization) => {
    if (utilizationFilter === 'Low') return utilization < 40
    if (utilizationFilter === 'Medium') return utilization >= 40 && utilization <= 75
    if (utilizationFilter === 'High') return utilization > 75
    return true
  }

  const filteredBudgets = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return budgets.filter((budget) => {
      const matchesQuery =
        query.length === 0 ||
        budget.name.toLowerCase().includes(query) ||
        budget.programme.toLowerCase().includes(query) ||
        budget.id.toLowerCase().includes(query) ||
        budget.status.toLowerCase().includes(query) ||
        budget.coverageStates.some((state) => state.toLowerCase().includes(query))

      const matchesStatus = statusFilter === 'All' || budget.status === statusFilter
      const matchesState = stateFilter === 'All' || budget.coverageStates.includes(stateFilter)
      const matchesUtilization = utilizationMatch(budget.utilization)

      return matchesQuery && matchesStatus && matchesState && matchesUtilization
    })
  }, [budgets, searchTerm, statusFilter, stateFilter, utilizationFilter])

  const totalPages = Math.max(1, Math.ceil(filteredBudgets.length / itemsPerPage))
  const page = Math.min(currentPage, totalPages)

  const paginatedBudgets = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return filteredBudgets.slice(start, start + itemsPerPage)
  }, [filteredBudgets, page])

  const totals = useMemo(() => {
    const totalAmount = filteredBudgets.reduce((sum, item) => sum + item.amount, 0)
    const totalBudgets = filteredBudgets.length
    const averageAmount = totalBudgets > 0 ? totalAmount / totalBudgets : 0
    const weightedUtilization =
      totalAmount > 0
        ? (filteredBudgets.reduce((sum, item) => sum + item.amount * (item.utilization / 100), 0) / totalAmount) * 100
        : 0
    const utilizedAmount = filteredBudgets.reduce((sum, item) => sum + item.amount * (item.utilization / 100), 0)

    return {
      totalAmount,
      totalBudgets,
      averageAmount,
      weightedUtilization,
      utilizedAmount,
    }
  }, [filteredBudgets])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  const getDaysUntilExpiry = (expiryDate) => {
    const msPerDay = 1000 * 60 * 60 * 24
    return Math.ceil((expiryDate.getTime() - Date.now()) / msPerDay)
  }

  const statusTone = {
    Active: 'bg-emerald/15 text-emerald',
    Planned: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
    Paused: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Closed: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
  }

  const expiryTone = {
    soon: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    due: 'bg-red-500/15 text-red-600 dark:text-red-400',
    normal: 'bg-emerald/15 text-emerald',
  }

  const fromRow = filteredBudgets.length === 0 ? 0 : (page - 1) * itemsPerPage + 1
  const toRow = Math.min(page * itemsPerPage, filteredBudgets.length)

  const updateFilters = (updater) => {
    updater()
    setCurrentPage(1)
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total Budget Amount</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(totals.totalAmount)}</h3>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Average Budget Amount</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(totals.averageAmount)}</h3>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total Budgets</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{totals.totalBudgets}</h3>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Utilized Amount</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(totals.utilizedAmount)}</h3>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Average Utilization</p>
          <h3 className="mt-2 text-xl font-semibold text-emerald">{totals.weightedUtilization.toFixed(1)}%</h3>
        </article>
      </div>

      <article className="rounded-lg mt-8 border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label htmlFor="budget-search" className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Search Budgets</label>
            <input
              id="budget-search"
              type="text"
              value={searchTerm}
              onChange={(event) => updateFilters(() => setSearchTerm(event.target.value))}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
              placeholder="Search by name, id, status, or state"
            />
          </div>

          <div>
            <label htmlFor="budget-status-filter" className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Status</label>
            <select
              id="budget-status-filter"
              value={statusFilter}
              onChange={(event) => updateFilters(() => setStatusFilter(event.target.value))}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
            >
              <option value="All">All</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget-state-filter" className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Coverage State</label>
            <select
              id="budget-state-filter"
              value={stateFilter}
              onChange={(event) => updateFilters(() => setStateFilter(event.target.value))}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
            >
              <option value="All">All</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget-utilization-filter" className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Utilization Level</label>
            <select
              id="budget-utilization-filter"
              value={utilizationFilter}
              onChange={(event) => updateFilters(() => setUtilizationFilter(event.target.value))}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
            >
              <option value="All">All</option>
              <option value="Low">Low (Under 40%)</option>
              <option value="Medium">Medium (40% - 75%)</option>
              <option value="High">High (Above 75%)</option>
            </select>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Budget Name</th>
                <th className="px-2 py-2">Programme and Coverage Areas</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Utilization</th>
                <th className="px-2 py-2">Date Created</th>
                <th className="px-2 py-2">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBudgets.map((budget) => (
                <tr key={budget.id} className="border-b border-stone-100 dark:border-stone-800">
                  <td className="px-2 py-3">
                    <Link to={`/admin/payments-assistance/budgets/${budget.id}`} className="font-medium text-emerald hover:underline dark:text-light-green">
                      {budget.name}
                    </Link>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{budget.id}</p>
                  </td>
                  <td className="px-2 py-3">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{budget.programme}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{budget.coverageStates.join(', ')}</p>
                  </td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusTone[budget.status]}`}>{budget.status}</span>
                  </td>
                  <td className="px-2 py-3 font-medium text-stone-800 dark:text-stone-200">{formatCurrency(budget.amount)}</td>
                  <td className="px-2 py-3">
                    <div className="w-40 max-w-full">
                      <div className="mb-1 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                        <span>{budget.utilization}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-stone-200 dark:bg-stone-700">
                        <div
                          className="h-1 rounded-full bg-emerald"
                          style={{ width: `${budget.utilization}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{formatDate(budget.createdAt)}</td>
                  <td className="px-2 py-3">
                    {(() => {
                      const daysUntilExpiry = getDaysUntilExpiry(budget.expiryAt)
                      const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry < 5
                      const isWarningSoon = daysUntilExpiry >= 5 && daysUntilExpiry < 30
                      const isDue = daysUntilExpiry <= 0

                      return (
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-stone-600 dark:text-stone-300">{formatDate(budget.expiryAt)}</span>
                            {isDue ? (
                              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${expiryTone.due}`}>Expired</span>
                            ) : isExpiringSoon ? (
                              <span className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] font-semibold text-red-600 dark:text-red-400">Expiring soon</span>
                            ) : isWarningSoon ? (
                              <span className="rounded-full bg-amber-500/15 px-2 py-1 text-[10px] font-semibold text-amber-600 dark:text-amber-300">Expiring soon</span>
                            ) : (
                              <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${expiryTone.normal}`}>Active window</span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 dark:text-stone-400">{daysUntilExpiry > 0 ? `${daysUntilExpiry} days left` : 'Past expiry'}</p>
                        </div>
                      )
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedBudgets.length === 0 && (
            <div className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">No budgets match the selected filters.</div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 text-sm dark:border-stone-700 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone-600 dark:text-stone-300">Showing {fromRow} to {toRow} of {filteredBudgets.length} budgets</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              Previous
            </button>
            <span className="text-xs text-stone-600 dark:text-stone-300">Page {page} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              Next
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}

export default Budgets