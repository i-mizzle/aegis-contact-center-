import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ModalDialog from '../../../../components/layouts/ModalDialog'
import OnboardPersonnel from '../../../../components/elements/workflow/resources/OnboardPersonnel'

const createInitialPersonnelForm = () => ({
  name: '',
  serviceNumber: '',
  email: '',
  phone: '',
  rank: '',
  position: '',
  shift: '',
  status: 'Active',
  yearsInService: '',
})

const ResourcePersonnel = () => {
  const { resourceId } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [rankFilter, setRankFilter] = useState('All ranks')
  const [currentPage, setCurrentPage] = useState(1)
  const [personnel, setPersonnel] = useState(() => createInitialPersonnelForm())
  const [onboardedPersonnel, setOnboardedPersonnel] = useState([])
  const [showOnboardModal, setShowOnboardModal] = useState(false)
  const [createError, setCreateError] = useState('')
  const [formRenderKey, setFormRenderKey] = useState(0)
  const pageSize = 10

  const personnelRecords = useMemo(() => {
    const resourceNumber = Number(`${resourceId || ''}`.replace(/\D/g, '')) || 1
    const firstNames = ['Aisha', 'Musa', 'Chidinma', 'Tunde', 'Fatima', 'Kelechi', 'Grace', 'Emeka', 'Umar', 'Bolanle', 'Hauwa', 'Ifeanyi']
    const lastNames = ['Okafor', 'Bello', 'Lawal', 'Adewale', 'Ibrahim', 'Nwosu', 'Yusuf', 'Adesina', 'Udo', 'Balogun', 'Musa', 'Onyema']
    const ranks = ['Commander', 'Chief Superintendent', 'Superintendent', 'Inspector', 'Sergeant', 'Corporal']
    const positions = ['Station Lead', 'Operations Officer', 'Field Responder', 'Logistics Officer', 'Control Room Analyst', 'Patrol Lead']
    const statuses = ['Active', 'Suspended', 'Off-duty']

    return Array.from({ length: 36 }, (_, index) => {
      const rank = ranks[index % ranks.length]
      const status = statuses[index % statuses.length]
      const position = positions[(index * 2) % positions.length]
      const fullName = `${firstNames[index % firstNames.length]} ${lastNames[(index + resourceNumber) % lastNames.length]}`

      return {
        id: `PER-${resourceNumber.toString().padStart(3, '0')}-${(index + 1).toString().padStart(3, '0')}`,
        name: fullName,
        rank,
        position,
        status,
        shift: index % 2 === 0 ? 'Day Shift' : 'Night Shift',
        yearsInService: 2 + ((index * 3) % 17),
      }
    })
  }, [resourceId])

  const allPersonnelRecords = useMemo(() => [...onboardedPersonnel, ...personnelRecords], [onboardedPersonnel, personnelRecords])
  const rankOptions = useMemo(() => ['All ranks', ...new Set(allPersonnelRecords.map((item) => item.rank))], [allPersonnelRecords])
  const statusOptions = ['All statuses', 'Active', 'Suspended', 'Off-duty']

  const filteredPersonnel = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return allPersonnelRecords.filter((person) => {
      const matchesQuery =
        query.length === 0 ||
        [person.id, person.name, person.rank, person.position, person.status, person.shift]
          .some((value) => value.toLowerCase().includes(query))

      const matchesStatus = statusFilter === 'All statuses' || person.status === statusFilter
      const matchesRank = rankFilter === 'All ranks' || person.rank === rankFilter

      return matchesQuery && matchesStatus && matchesRank
    })
  }, [allPersonnelRecords, rankFilter, searchTerm, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredPersonnel.length / pageSize))
  const page = Math.min(currentPage, totalPages)

  const paginatedPersonnel = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredPersonnel.slice(start, start + pageSize)
  }, [filteredPersonnel, page])

  const statusTone = {
    Active: 'bg-emerald/15 text-emerald',
    Suspended: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
    'Off-duty': 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  }

  const updateFilter = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('All statuses')
    setRankFilter('All ranks')
    setCurrentPage(1)
  }

  const closeOnboardModal = () => {
    setShowOnboardModal(false)
    setCreateError('')
    setPersonnel(createInitialPersonnelForm())
    setFormRenderKey((key) => key + 1)
  }

  const updatePersonnelField = (field, value) => {
    setPersonnel((current) => ({ ...current, [field]: value }))
    if (createError) {
      setCreateError('')
    }
  }

  const onboardPersonnel = () => {
    const requiredFields = ['name', 'serviceNumber', 'email', 'phone', 'rank', 'position', 'shift', 'status', 'yearsInService']
    const hasMissingField = requiredFields.some((field) => !`${personnel[field] || ''}`.trim())

    if (hasMissingField) {
      setCreateError('Complete all required personnel details before onboarding.')
      return
    }

    const resourceNumber = Number(`${resourceId || ''}`.replace(/\D/g, '')) || 1
    setOnboardedPersonnel((current) => [
      {
        ...personnel,
        id: `PER-${resourceNumber.toString().padStart(3, '0')}-${(personnelRecords.length + current.length + 1).toString().padStart(3, '0')}`,
        yearsInService: Number(personnel.yearsInService),
      },
      ...current,
    ])
    setCurrentPage(1)
    closeOnboardModal()
  }

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Resource Personnel</h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Personnel roster with rank, current position, and duty status for this resource location.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowOnboardModal(true)}
          className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-emerald/80 dark:bg-light-green dark:hover:bg-light-green/80"
        >
          Onboard personnel
        </button>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Search</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => updateFilter(setSearchTerm, event.target.value)}
            placeholder="Search personnel by name, rank, role..."
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Rank</span>
          <select
            value={rankFilter}
            onChange={(event) => updateFilter(setRankFilter, event.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
          >
            {rankOptions.map((rank) => (
              <option key={rank}>{rank}</option>
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
        <p>{filteredPersonnel.length} personnel found</p>
        <p>Page {page} of {totalPages}</p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
              <th className="px-2 py-2">Personnel</th>
              <th className="px-2 py-2">Rank</th>
              <th className="px-2 py-2">Position</th>
              <th className="px-2 py-2">Shift</th>
              <th className="px-2 py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedPersonnel.length === 0 && (
              <tr>
                <td colSpan={5} className="px-2 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                  No personnel match the current search and filters.
                </td>
              </tr>
            )}

            {paginatedPersonnel.map((person) => (
              <tr key={person.id} className="border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20">
                <td className="px-2 py-3">
                  <p className="font-medium text-stone-900 dark:text-stone-100">{person.name}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{person.id} • {person.yearsInService} years service</p>
                </td>
                <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{person.rank}</td>
                <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{person.position}</td>
                <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{person.shift}</td>
                <td className="px-2 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[person.status]}`}>
                    {person.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Showing {filteredPersonnel.length === 0 ? 0 : (page - 1) * pageSize + 1}
          {' '}
          to {Math.min(page * pageSize, filteredPersonnel.length)} of {filteredPersonnel.length}
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
      <ModalDialog
        shown={showOnboardModal}
        closeFunction={closeOnboardModal}
        dialogTitle="Onboard personnel"
        maxWidthClass="max-w-3xl"
      >
        <OnboardPersonnel
          key={formRenderKey}
          closeFunction={closeOnboardModal}
          createError={createError}
          onboardPersonnel={onboardPersonnel}
          personnel={personnel}
          updatePersonnelField={updatePersonnelField}
          rankSelectOptions={rankOptions.filter((rank) => rank !== 'All ranks').map((name) => ({ name }))}
          positionSelectOptions={['Station Lead', 'Operations Officer', 'Field Responder', 'Logistics Officer', 'Control Room Analyst', 'Patrol Lead'].map((name) => ({ name }))}
          shiftSelectOptions={['Day Shift', 'Night Shift'].map((name) => ({ name }))}
          statusSelectOptions={statusOptions.filter((status) => status !== 'All statuses').map((name) => ({ name }))}
        />
      </ModalDialog>
    </article>
  )
}

export default ResourcePersonnel
