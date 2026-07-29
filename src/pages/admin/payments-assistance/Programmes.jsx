import React, { useMemo, useState } from 'react'
import SlideOutModal from '../../../components/layouts/SlideOutModal'

const Programmes = () => {
  const [selectedProgramme, setSelectedProgramme] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [locationFilter, setLocationFilter] = useState('All Locations')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  const states = ['Lagos', 'Kano', 'Kaduna', 'Borno', 'Benue', 'Rivers', 'FCT', 'Plateau', 'Kogi', 'Anambra', 'Ogun', 'Yobe']
  const channels = ['Bank Transfer', 'NQR', 'Voucher', 'USSD', 'Wallet']

  const programmes = useMemo(() => {
    const names = [
      'Flood Relief Programme',
      'Food Security Support',
      'Medical Emergency Grant',
      'Displacement Assistance Fund',
      'Household Stabilization Grant',
      'Community Recovery Support',
      'Livelihood Restoration Fund',
      'Emergency Cash Transfer',
      'Nutrition Response Support',
      'Coastal Recovery Initiative',
      'Emergency Shelter Grant',
      'Resilience and Recovery Fund',
    ]
    const types = ['Flood Relief', 'Food Security', 'Medical', 'Humanitarian', 'Livelihood', 'Disaster Relief']
    const statuses = ['Active', 'Planned', 'Paused', 'Closed']

    return names.map((name, index) => {
      const coverageCount = 2 + (index % 3)
      const coverageStates = Array.from({ length: coverageCount }, (_, step) => states[(index + step * 2) % states.length])
      const budgetAmount = (120 + ((index * 41) % 560)) * 1000000
      const disbursed = Math.round(budgetAmount * (0.48 + ((index % 5) * 0.08)))
      const verifiedBeneficiaries = 1800 + (index * 340)
      const paidBeneficiaries = Math.round(verifiedBeneficiaries * (0.72 + ((index % 4) * 0.05)))
      const status = statuses[index % statuses.length]
      const channel = channels[index % channels.length]
      const createdAt = new Date(2026, (index * 2) % 12, (index * 3) % 28 + 1)
      const expiryAt = new Date(2026, 7, 1 + ((index * 5) % 90))
      const attachedBudget = {
        id: `BGT-${(index + 1).toString().padStart(4, '0')}`,
        name: `Assistance Budget ${index + 1}`,
        amount: budgetAmount,
        disbursed,
        utilization: Math.round((disbursed / budgetAmount) * 1000) / 10,
        status: status === 'Closed' ? 'Closed' : status,
      }

      return {
        id: `PRG-${(index + 1).toString().padStart(3, '0')}`,
        name,
        type: types[index % types.length],
        status,
        location: coverageStates.join(', '),
        leadAgency: index % 2 === 0 ? 'Ministry of Humanitarian Affairs' : 'State Emergency Management Agency',
        coverageStates,
        channel,
        beneficiariesTarget: 2200 + (index * 180),
        verifiedBeneficiaries,
        paidBeneficiaries,
        budgetAmount,
        disbursed,
        mopUpAmount: Math.max(budgetAmount - disbursed, 0),
        createdAt,
        expiryAt,
        objective: `Support affected communities under ${name.toLowerCase()} with direct relief, verification, and disbursement controls.`,
        attachedBudget,
        notes: index % 2 === 0 ? 'Multi-state relief deployment with field verification' : 'Targeted assistance with reconciliation follow-up',
      }
    })
  }, [states])

  const topStats = useMemo(() => {
    const totalProgrammes = programmes.length
    const activeProgrammes = programmes.filter((programme) => programme.status === 'Active').length
    const totalBudget = programmes.reduce((sum, programme) => sum + programme.budgetAmount, 0)
    const totalDisbursed = programmes.reduce((sum, programme) => sum + programme.disbursed, 0)
    const totalCoverageStates = new Set(programmes.flatMap((programme) => programme.coverageStates)).size

    return {
      totalProgrammes,
      activeProgrammes,
      totalBudget,
      totalDisbursed,
      totalCoverageStates,
    }
  }, [programmes])

  const typeOptions = useMemo(() => ['All Types', ...new Set(programmes.map((programme) => programme.type))], [programmes])
  const statusOptions = useMemo(() => ['All Statuses', ...new Set(programmes.map((programme) => programme.status))], [programmes])
  const locationOptions = useMemo(() => ['All Locations', ...states], [states])

  const filteredProgrammes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return programmes.filter((programme) => {
      const matchesSearch = !normalizedSearch || [
        programme.name,
        programme.id,
        programme.type,
        programme.status,
        programme.location,
        programme.leadAgency,
      ].some((value) => value.toLowerCase().includes(normalizedSearch))

      const matchesType = typeFilter === 'All Types' || programme.type === typeFilter
      const matchesStatus = statusFilter === 'All Statuses' || programme.status === statusFilter
      const matchesLocation = locationFilter === 'All Locations' || programme.coverageStates.includes(locationFilter)

      return matchesSearch && matchesType && matchesStatus && matchesLocation
    })
  }, [locationFilter, programmes, searchTerm, statusFilter, typeFilter])

  const totalPages = Math.max(Math.ceil(filteredProgrammes.length / pageSize), 1)
  const visibleProgrammes = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const startIndex = (safePage - 1) * pageSize

    return filteredProgrammes.slice(startIndex, startIndex + pageSize)
  }, [currentPage, filteredProgrammes, pageSize, totalPages])

  const handleFilterChange = (setter) => (value) => {
    setter(value)
    setCurrentPage(1)
  }

  const formatCurrency = (value) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value)

  const formatDate = (value) => new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value)

  const statusTone = {
    Active: 'bg-emerald/15 text-emerald',
    Planned: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
    Paused: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Closed: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
  }

  const channelTone = {
    'Bank Transfer': 'bg-emerald/15 text-emerald',
    NQR: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
    Voucher: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    USSD: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
    Wallet: 'bg-orange-500/15 text-orange-600 dark:text-orange-300',
  }

  const budgetStatusTone = {
    Active: 'bg-emerald/15 text-emerald',
    Planned: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
    Paused: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Closed: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
  }

  return (
    <>
      <section className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">Total Programmes</p>
            <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{topStats.totalProgrammes}</h3>
          </article>
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">Active Programmes</p>
            <h3 className="mt-2 text-xl font-semibold text-emerald">{topStats.activeProgrammes}</h3>
          </article>
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">Total Budget</p>
            <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(topStats.totalBudget)}</h3>
          </article>
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">Total Disbursed</p>
            <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(topStats.totalDisbursed)}</h3>
          </article>
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">Coverage States</p>
            <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{topStats.totalCoverageStates}</h3>
          </article>
        </div>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Programmes</h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Click any programme to inspect its budget, coverage, recipients, and operational details.</p>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Search</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search programmes, IDs, agencies..."
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Type</span>
              <select
                value={typeFilter}
                onChange={(event) => handleFilterChange(setTypeFilter)(event.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              >
                {typeOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => handleFilterChange(setStatusFilter)(event.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Location</span>
              <select
                value={locationFilter}
                onChange={(event) => handleFilterChange(setLocationFilter)(event.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              >
                {locationOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setTypeFilter('All Types')
                  setStatusFilter('All Statuses')
                  setLocationFilter('All Locations')
                  setCurrentPage(1)
                }}
                className="w-full rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
            <p>{filteredProgrammes.length} programme{filteredProgrammes.length === 1 ? '' : 's'} found</p>
            <p>Page {Math.min(currentPage, totalPages)} of {totalPages}</p>
          </div>

          <div className="mt-4 overflow-x-auto my-8">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                  <th className="px-2 py-2">Programme</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Location</th>
                  <th className="px-2 py-2">Budget</th>
                  <th className="px-2 py-2">Disbursed</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleProgrammes.map((programme) => (
                  <tr
                    key={programme.id}
                    onClick={() => setSelectedProgramme(programme)}
                    className="cursor-pointer border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20"
                  >
                    <td className="px-2 py-3">
                      <p className="font-medium text-stone-900 dark:text-stone-100">{programme.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{programme.id} • {programme.leadAgency}</p>
                    </td>
                    <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{programme.type}</td>
                    <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{programme.location}</td>
                    <td className="px-2 py-3 font-medium text-stone-800 dark:text-stone-200">{formatCurrency(programme.budgetAmount)}</td>
                    <td className="px-2 py-3 font-medium text-stone-800 dark:text-stone-200">{formatCurrency(programme.disbursed)}</td>
                    <td className="px-2 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusTone[programme.status]}`}>{programme.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Showing {filteredProgrammes.length === 0 ? 0 : (Math.min(currentPage, totalPages) - 1) * pageSize + 1}
              {' '}
              to {Math.min(Math.min(currentPage, totalPages) * pageSize, filteredProgrammes.length)} of {filteredProgrammes.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition enabled:hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-800 dark:text-stone-300 dark:enabled:hover:bg-stone-900/40"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition enabled:hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-800 dark:text-stone-300 dark:enabled:hover:bg-stone-900/40"
              >
                Next
              </button>
            </div>
          </div>
        </article>
      </section>

      <SlideOutModal
        isOpen={Boolean(selectedProgramme)}
        closeFunction={() => setSelectedProgramme(null)}
        title={selectedProgramme?.name || 'Programme Details'}
        subTitle={selectedProgramme ? `${selectedProgramme.id} • ${selectedProgramme.leadAgency}` : ''}
      >
        {selectedProgramme && (
          <div className="space-y-4 pb-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Status</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[selectedProgramme.status]}`}>{selectedProgramme.status}</span>
              </div>
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Channel</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${channelTone[selectedProgramme.channel]}`}>{selectedProgramme.channel}</span>
              </div>
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Created</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{formatDate(selectedProgramme.createdAt)}</p>
              </div>
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Expiry</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{formatDate(selectedProgramme.expiryAt)}</p>
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
              <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Programme Overview</h4>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">{selectedProgramme.objective}</p>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">{selectedProgramme.notes}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Target Beneficiaries</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedProgramme.beneficiariesTarget.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Verified Beneficiaries</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedProgramme.verifiedBeneficiaries.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Paid Beneficiaries</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedProgramme.paidBeneficiaries.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Coverage Areas</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedProgramme.coverageStates.join(', ')}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Attached Budget</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedProgramme.attachedBudget.name}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">{selectedProgramme.attachedBudget.id}</p>
              </div>
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Attached Budget Amount</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(selectedProgramme.attachedBudget.amount)}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">{selectedProgramme.attachedBudget.utilization}% utilized</p>
              </div>
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Budget Disbursed</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(selectedProgramme.attachedBudget.disbursed)}</p>
              </div>
              <div className="rounded-lg bg-stone-100 px-3 py-3 dark:bg-stone-800/20">
                <p className="text-xs text-stone-500 dark:text-stone-400">Budget Status</p>
                <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${budgetStatusTone[selectedProgramme.attachedBudget.status]}`}>{selectedProgramme.attachedBudget.status}</span>
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
              <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Attached Budget Summary</h4>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Budget Name</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedProgramme.attachedBudget.name}</p>
                </div>
                <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Budget ID</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedProgramme.attachedBudget.id}</p>
                </div>
                <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Budget Amount</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(selectedProgramme.attachedBudget.amount)}</p>
                </div>
                <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Budget Utilization</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedProgramme.attachedBudget.utilization}%</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
              <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Operational Split</h4>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Amount to Mop Up</p>
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-300">{formatCurrency(selectedProgramme.mopUpAmount)}</p>
                </div>
                <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Coverage Count</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedProgramme.coverageStates.length} states</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlideOutModal>
    </>
  )
}

export default Programmes