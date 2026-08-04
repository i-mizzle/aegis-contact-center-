import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalDialog from '../../../components/layouts/ModalDialog'
import NewResource from '../../../components/elements/workflow/resources/NewResource'

const AGENCIES = [
  'Federal Road Safety Corps',
  'Nigeria Police Force',
  'Department of State Services',
  'National Emergency Management Agency',
  'Nigeria Security and Civil Defence Corps',
  'Lagos State Emergency Management Agency',
  'Fire Service Command',
  'State Traffic Management Authority',
]

const RESOURCE_TYPES = [
  'Office',
  'Command Post',
  'Outstation',
  'Checkpoint',
  'Response Hub',
]

const LOCATIONS = [
  { city: 'Ikeja', state: 'Lagos' },
  { city: 'Victoria Island', state: 'Lagos' },
  { city: 'Mushin', state: 'Lagos' },
  { city: 'Abuja Municipal', state: 'FCT' },
  { city: 'Wuse', state: 'FCT' },
  { city: 'Kubwa', state: 'FCT' },
  { city: 'Port Harcourt', state: 'Rivers' },
  { city: 'Obio-Akpor', state: 'Rivers' },
  { city: 'Kano Municipal', state: 'Kano' },
  { city: 'Nassarawa', state: 'Kano' },
  { city: 'Kaduna North', state: 'Kaduna' },
  { city: 'Zaria', state: 'Kaduna' },
  { city: 'Maiduguri', state: 'Borno' },
  { city: 'Damaturu', state: 'Yobe' },
  { city: 'Makurdi', state: 'Benue' },
  { city: 'Asaba', state: 'Delta' },
  { city: 'Enugu North', state: 'Enugu' },
  { city: 'Abeokuta', state: 'Ogun' },
]

const RESOURCE_STATUSES = ['Operational', 'Limited', 'Under Maintenance']

const ADMIN_FIRST_NAMES = [
  'Amina',
  'Tunde',
  'Chidinma',
  'Ibrahim',
  'Zainab',
  'Kelechi',
  'Ngozi',
  'Samuel',
  'Hadiza',
  'Emeka',
  'Yusuf',
  'Bolanle',
]

const ADMIN_LAST_NAMES = [
  'Okafor',
  'Bello',
  'Adewale',
  'Musa',
  'Eze',
  'Balogun',
  'Iheanacho',
  'Abubakar',
  'Udo',
  'Nwosu',
  'Lawal',
  'Onyema',
]

const ADMIN_RANKS = [
  'Commander',
  'Chief Superintendent',
  'Superintendent',
  'Inspector',
  'Senior Officer',
]

const ADMIN_POSITIONS = [
  'Station Administrator',
  'Operations Lead',
  'Asset Control Lead',
  'Field Coordination Lead',
  'Command Duty Officer',
]

const createInitialResourceForm = () => ({
  name: '',
  agency: AGENCIES[0],
  resourceType: RESOURCE_TYPES[0],
  address: '',
  city: '',
  state: '',
  status: RESOURCE_STATUSES[0],
  adminName: '',
  adminEmail: '',
  adminPhone: '',
  adminRank: ADMIN_RANKS[0],
  adminPosition: ADMIN_POSITIONS[0],
})

const createSeedResources = () => {
  return Array.from({ length: 72 }, (_, index) => {
    const agency = AGENCIES[index % AGENCIES.length]
    const location = LOCATIONS[index % LOCATIONS.length]
    const resourceType = RESOURCE_TYPES[index % RESOURCE_TYPES.length]
    const status = RESOURCE_STATUSES[index % RESOURCE_STATUSES.length]
    const adminName = `${ADMIN_FIRST_NAMES[index % ADMIN_FIRST_NAMES.length]} ${ADMIN_LAST_NAMES[(index * 3) % ADMIN_LAST_NAMES.length]}`
    const normalizedAdminName = adminName.toLowerCase().replace(/\s+/g, '.')
    const adminEmail = `${normalizedAdminName}.${index + 1}@isnas-demo.org`
    const adminPhone = `080${(31000000 + (index * 197)).toString().slice(0, 8)}`

    const personnelCount = 18 + ((index * 7) % 95)
    const vehicleAssets = (index % 6) + 1
    const commAssets = 4 + ((index * 3) % 18)
    const totalAssets = vehicleAssets + commAssets + (index % 5)

    return {
      id: `RSC-${(index + 1).toString().padStart(4, '0')}`,
      agency,
      resourceType,
      name: `${agency.split(' ').slice(0, 2).join(' ')} ${resourceType} ${index + 1}`,
      address: `${location.city} ${resourceType} Complex`,
      city: location.city,
      state: location.state,
      personnelCount,
      totalAssets,
      vehicleAssets,
      commAssets,
      status,
      administrator: {
        name: adminName,
        email: adminEmail,
        phone: adminPhone,
        rank: ADMIN_RANKS[index % ADMIN_RANKS.length],
        position: ADMIN_POSITIONS[index % ADMIN_POSITIONS.length],
      },
    }
  })
}

const Resources = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [agencyFilter, setAgencyFilter] = useState('All agencies')
  const [typeFilter, setTypeFilter] = useState('All resource types')
  const [stateFilter, setStateFilter] = useState('All states')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createFormRenderKey, setCreateFormRenderKey] = useState(0)
  const [newResource, setNewResource] = useState(() => createInitialResourceForm())
  const [resources, setResources] = useState(() => createSeedResources())
  const pageSize = 12

  const agencyOptions = useMemo(() => ['All agencies', ...new Set(resources.map((item) => item.agency))], [resources])
  const typeOptions = useMemo(() => ['All resource types', ...new Set(resources.map((item) => item.resourceType))], [resources])
  const stateOptions = useMemo(() => ['All states', ...new Set(resources.map((item) => item.state))], [resources])
  const statusOptions = ['All statuses', 'Operational', 'Limited', 'Under Maintenance']
  const agencySelectOptions = useMemo(() => AGENCIES.map((item) => ({ name: item })), [])
  const resourceTypeSelectOptions = useMemo(() => RESOURCE_TYPES.map((item) => ({ name: item })), [])
  const resourceStatusSelectOptions = useMemo(() => RESOURCE_STATUSES.map((item) => ({ name: item })), [])
  const adminRankSelectOptions = useMemo(() => ADMIN_RANKS.map((item) => ({ name: item })), [])
  const adminPositionSelectOptions = useMemo(() => ADMIN_POSITIONS.map((item) => ({ name: item })), [])

  const filteredResources = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return resources.filter((resource) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          resource.id,
          resource.agency,
          resource.name,
          resource.resourceType,
          resource.address,
          resource.city,
          resource.state,
          resource.status,
          resource.administrator.name,
          resource.administrator.email,
          resource.administrator.phone,
          resource.administrator.rank,
          resource.administrator.position,
        ].some((value) => value.toLowerCase().includes(normalizedSearch))

      const matchesAgency = agencyFilter === 'All agencies' || resource.agency === agencyFilter
      const matchesType = typeFilter === 'All resource types' || resource.resourceType === typeFilter
      const matchesState = stateFilter === 'All states' || resource.state === stateFilter
      const matchesStatus = statusFilter === 'All statuses' || resource.status === statusFilter

      return matchesSearch && matchesAgency && matchesType && matchesState && matchesStatus
    })
  }, [agencyFilter, resources, searchTerm, stateFilter, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / pageSize))
  const page = Math.min(currentPage, totalPages)

  const paginatedResources = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredResources.slice(start, start + pageSize)
  }, [filteredResources, page])

  const summary = useMemo(() => {
    const activeResources = resources.filter((resource) => resource.status === 'Operational').length
    const personnel = resources.reduce((sum, resource) => sum + resource.personnelCount, 0)
    const assets = resources.reduce((sum, resource) => sum + resource.totalAssets, 0)
    const agencies = new Set(resources.map((resource) => resource.agency)).size

    return {
      totalResources: resources.length,
      activeResources,
      personnel,
      assets,
      agencies,
    }
  }, [resources])

  const statusTone = {
    Operational: 'bg-emerald/15 text-emerald',
    Limited: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    'Under Maintenance': 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
  }

  const updateFilter = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  const updateNewResourceField = (field, value) => {
    setNewResource((current) => ({ ...current, [field]: value }))
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    setCreateError('')
    setNewResource(createInitialResourceForm())
    setCreateFormRenderKey((current) => current + 1)
  }

  const openCreateModal = () => {
    setCreateError('')
    setShowCreateModal(true)
    setCreateFormRenderKey((current) => current + 1)
  }

  const createResource = () => {
    const requiredFields = [
      newResource.name,
      newResource.address,
      newResource.city,
      newResource.state,
      newResource.status,
      newResource.adminName,
      newResource.adminEmail,
      newResource.adminPhone,
      newResource.adminRank,
      newResource.adminPosition,
    ]

    if (requiredFields.some((field) => `${field}`.trim() === '')) {
      setCreateError('Please complete all required fields.')
      return
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newResource.adminEmail)
    if (!emailIsValid) {
      setCreateError('Please enter a valid administrator email address.')
      return
    }

    const maxExistingId = resources.reduce((maxId, item) => {
      const numericValue = Number(item.id.replace(/\D/g, '')) || 0
      return Math.max(maxId, numericValue)
    }, 0)

    const nextId = maxExistingId + 1
    const resourceIndex = nextId - 1
    const normalizedPersonnel = 18 + ((resourceIndex * 7) % 95)
    const vehicleAssets = (resourceIndex % 6) + 1
    const commAssets = 4 + ((resourceIndex * 3) % 18)
    const normalizedAssets = vehicleAssets + commAssets + (resourceIndex % 5)

    const createdResource = {
      id: `RSC-${nextId.toString().padStart(4, '0')}`,
      agency: newResource.agency,
      resourceType: newResource.resourceType,
      name: newResource.name.trim(),
      address: newResource.address.trim(),
      city: newResource.city.trim(),
      state: newResource.state.trim(),
      personnelCount: normalizedPersonnel,
      totalAssets: normalizedAssets,
      vehicleAssets,
      commAssets,
      status: newResource.status,
      administrator: {
        name: newResource.adminName.trim(),
        email: newResource.adminEmail.trim(),
        phone: newResource.adminPhone.trim(),
        rank: newResource.adminRank,
        position: newResource.adminPosition,
      },
    }

    setResources((current) => [createdResource, ...current])
    setCurrentPage(1)
    closeCreateModal()
  }

  const resetFilters = () => {
    setSearchTerm('')
    setAgencyFilter('All agencies')
    setTypeFilter('All resource types')
    setStateFilter('All states')
    setStatusFilter('All statuses')
    setCurrentPage(1)
  }

  return (
    <section className="space-y-5">
      <div className="">
        <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">Resources & Assets</p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">ISNAS Resource Management Suite</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            Centralized platform for managing resources and assets.
        </p>
    </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total resources</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.totalResources}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Operational resources</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.activeResources}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Agencies represented</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.agencies}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Assigned personnel</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.personnel.toLocaleString('en-NG')}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Tracked assets</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.assets.toLocaleString('en-NG')}</h3>
        </article>
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Resources</h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Resource points across agencies. One agency can appear multiple times for different office, outstation, or command locations.</p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white dark:text-stone-800 transition hover:bg-emerald/90"
          >
            Create new resource
          </button>
        </div>

        <div className="mb-8 mt-4 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto]">
          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => updateFilter(setSearchTerm, event.target.value)}
              placeholder="Search by agency, location, type, id..."
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Agency</span>
            <select
              value={agencyFilter}
              onChange={(event) => updateFilter(setAgencyFilter, event.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            >
              {agencyOptions.map((agency) => (
                <option key={agency}>{agency}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Resource type</span>
            <select
              value={typeFilter}
              onChange={(event) => updateFilter(setTypeFilter, event.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            >
              {typeOptions.map((type) => (
                <option key={type}>{type}</option>
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
          <p>{filteredResources.length} resource{filteredResources.length === 1 ? '' : 's'} found</p>
          <p>Page {page} of {totalPages}</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Resource</th>
                <th className="px-2 py-2">Administrator</th>
                <th className="px-2 py-2">Location</th>
                <th className="px-2 py-2">Personnel</th>
                <th className="px-2 py-2">Assets</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginatedResources.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-2 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                    No resources match the current search and filters.
                  </td>
                </tr>
              )}

              {paginatedResources.map((resource) => (
                <tr
                  key={resource.id}
                  onClick={() => navigate(`/admin/resources-assets/resources/${resource.id}`)}
                  className="cursor-pointer border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20"
                >
                  <td className="px-2 py-3">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{resource.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{resource.id} • {resource.resourceType} • {resource.agency}</p>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{resource.administrator.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{resource.administrator.email}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{resource.administrator.phone}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{resource.administrator.rank} • {resource.administrator.position}</p>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{resource.city}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{resource.state}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{resource.address}</p>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{resource.personnelCount.toLocaleString('en-NG')}</td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{resource.totalAssets.toLocaleString('en-NG')}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {resource.vehicleAssets} vehicles • {resource.commAssets} comms
                    </p>
                  </td>
                  <td className="px-2 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[resource.status]}`}>
                      {resource.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Showing {filteredResources.length === 0 ? 0 : (page - 1) * pageSize + 1}
            {' '}
            to {Math.min(page * pageSize, filteredResources.length)} of {filteredResources.length}
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

      <ModalDialog
        shown={showCreateModal}
        closeFunction={closeCreateModal}
        dialogTitle="Create new resource"
        maxWidthClass="max-w-5xl"
      >
        <NewResource
          key={createFormRenderKey}
          closeFunction={closeCreateModal}
          createError={createError}
          createResource={createResource}
          newResource={newResource}
          updateNewResourceField={updateNewResourceField}
          agencySelectOptions={agencySelectOptions}
          resourceTypeSelectOptions={resourceTypeSelectOptions}
          resourceStatusSelectOptions={resourceStatusSelectOptions}
          adminRankSelectOptions={adminRankSelectOptions}
          adminPositionSelectOptions={adminPositionSelectOptions}
        />
      </ModalDialog>
    </section>
  )
}

export default Resources