import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSeedIntegrators } from './integratorData'

const Integrators = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [stateFilter, setStateFilter] = useState('All states')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const integrators = useMemo(() => createSeedIntegrators(), [])
  const categoryOptions = useMemo(() => ['All categories', ...new Set(integrators.map((item) => item.category))], [integrators])
  const stateOptions = useMemo(() => ['All states', ...new Set(integrators.map((item) => item.state))], [integrators])
  const statusOptions = ['All statuses', 'Operational', 'Limited', 'Pilot']

  const filteredIntegrators = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return integrators.filter((integrator) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          integrator.id,
          integrator.name,
          integrator.category,
          integrator.sector,
          integrator.city,
          integrator.state,
          integrator.administrator.name,
          integrator.administrator.email,
          integrator.partnerAgency,
          integrator.primaryContactDesk,
        ].some((value) => `${value}`.toLowerCase().includes(normalizedSearch))

      const matchesCategory = categoryFilter === 'All categories' || integrator.category === categoryFilter
      const matchesState = stateFilter === 'All states' || integrator.state === stateFilter
      const matchesStatus = statusFilter === 'All statuses' || integrator.status === statusFilter

      return matchesSearch && matchesCategory && matchesState && matchesStatus
    })
  }, [categoryFilter, integrators, searchTerm, stateFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredIntegrators.length / pageSize))
  const page = Math.min(currentPage, totalPages)

  const paginatedIntegrators = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredIntegrators.slice(start, start + pageSize)
  }, [filteredIntegrators, page])

  const summary = useMemo(() => {
    const activeIntegrators = integrators.filter((integrator) => integrator.status === 'Operational').length
    const sitesCovered = integrators.reduce((sum, integrator) => sum + integrator.protectedSites, 0)
    const trackedAssets = integrators.reduce((sum, integrator) => sum + integrator.assetCount, 0)
    const escalatedCases = integrators.reduce((sum, integrator) => sum + integrator.escalatedIncidents, 0)

    return {
      totalIntegrators: integrators.length,
      activeIntegrators,
      sitesCovered,
      trackedAssets,
      escalatedCases,
    }
  }, [integrators])

  const statusTone = {
    Operational: 'bg-emerald/15 text-emerald',
    Limited: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Pilot: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  }

  const updateFilter = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setCategoryFilter('All categories')
    setStateFilter('All states')
    setStatusFilter('All statuses')
    setCurrentPage(1)
  }

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">Integrators</p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">Tenant organisations using AEGIS at smaller scale</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
          Dummy records for private security agencies, estates, universities, hospitals, and community operators connected to the platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total integrators</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.totalIntegrators}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Operational</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.activeIntegrators}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Protected sites</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.sitesCovered}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Tracked assets</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.trackedAssets}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Escalated incidents</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.escalatedCases}</h3>
        </article>
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <div className="mb-6 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => updateFilter(setSearchTerm, event.target.value)}
              placeholder="Search by name, admin, location, or partner agency..."
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Category</span>
            <select
              value={categoryFilter}
              onChange={(event) => updateFilter(setCategoryFilter, event.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            >
              {categoryOptions.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">State</span>
            <select
              value={stateFilter}
              onChange={(event) => updateFilter(setStateFilter, event.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            >
              {stateOptions.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => updateFilter(setStatusFilter, event.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            >
              {statusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <p>{filteredIntegrators.length} integrators found</p>
          <p>Page {page} of {totalPages}</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Integrator</th>
                <th className="px-2 py-2">Administrator</th>
                <th className="px-2 py-2">Coverage</th>
                <th className="px-2 py-2">Incidents</th>
                <th className="px-2 py-2">Assets</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedIntegrators.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-2 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                    No integrators match the current search and filters.
                  </td>
                </tr>
              )}

              {paginatedIntegrators.map((integrator) => (
                <tr
                  key={integrator.id}
                  onClick={() => navigate(`/admin/integrators/${integrator.id}`)}
                  className="cursor-pointer border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20"
                >
                  <td className="px-2 py-3">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{integrator.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{integrator.id} • {integrator.category} • {integrator.sector}</p>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{integrator.administrator.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{integrator.administrator.title}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{integrator.administrator.email}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{integrator.administrator.phone}</p>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{integrator.city}, {integrator.state}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{integrator.protectedSites} sites • {integrator.responseTeams} teams</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{integrator.primaryContactDesk}</p>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{integrator.incidents.length} total</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{integrator.ongoingIncidents} ongoing • {integrator.escalatedIncidents} escalated</p>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{integrator.assetCount}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{integrator.guardsOnRoster} guards • {integrator.connectedResidents.toLocaleString('en-NG')} end users</p>
                  </td>
                  <td className="px-2 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[integrator.status]}`}>
                      {integrator.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Showing {filteredIntegrators.length === 0 ? 0 : (page - 1) * pageSize + 1}
            {' '}
            to {Math.min(page * pageSize, filteredIntegrators.length)} of {filteredIntegrators.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.max(current - 1, 1))}
              disabled={page === 1}
              className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition enabled:hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-800 dark:text-stone-300 dark:enabled:hover:bg-stone-900/40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.min(current + 1, totalPages))}
              disabled={page >= totalPages}
              className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-600 transition enabled:hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-800 dark:text-stone-300 dark:enabled:hover:bg-stone-900/40"
            >
              Next
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}

export default Integrators