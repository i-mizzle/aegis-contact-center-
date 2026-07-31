import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ModalDialog from '../../../../components/layouts/ModalDialog'
import OnboardAsset from '../../../../components/elements/workflow/resources/OnboardAsset'
import AudioIcon from '../../../../components/elements/icons/AudioIcon'
import CameraIcon from '../../../../components/elements/icons/CameraIcon'
import PhotoIcon from '../../../../components/elements/icons/PhotoIcon'

const createInitialAssetForm = () => ({
  name: '',
  serialNumber: '',
  assetType: '',
  assignedUnit: '',
  commissionedDate: '',
  status: 'Active',
  cameraEnabled: false,
  audioEnabled: false,
  stillPhotosEnabled: false,
})

const ResourceAssets = () => {
  const { resourceId } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [typeFilter, setTypeFilter] = useState('All asset types')
  const [currentPage, setCurrentPage] = useState(1)
  const [asset, setAsset] = useState(() => createInitialAssetForm())
  const [onboardedAssets, setOnboardedAssets] = useState([])
  const [showOnboardModal, setShowOnboardModal] = useState(false)
  const [createError, setCreateError] = useState('')
  const [formRenderKey, setFormRenderKey] = useState(0)
  const pageSize = 10

  const assetRecords = useMemo(() => {
    const resourceNumber = Number(`${resourceId || ''}`.replace(/\D/g, '')) || 1
    const assetTypes = ['Vehicle', 'Equipment', 'Drone', 'Communication Kit', 'Power Unit']
    const vehicleModels = ['Toyota Hilux Patrol', 'Ford Ranger Response', 'Mitsubishi L200 Unit', 'Armored Utility Van']
    const equipmentNames = ['Portable Medical Kit', 'Thermal Camera', 'Rescue Extraction Set', 'Riot Control Kit']
    const droneNames = ['Recon Drone A1', 'Aerial Monitor X4', 'Rapid Survey Drone Q2']
    const commNames = ['Base Radio Console', 'Field Radio Kit', 'Satellite Phone Bundle']
    const powerNames = ['Backup Generator', 'Solar Power Rack', 'Mobile Inverter Bank']
    const statuses = ['Active', 'Decommissioned', 'Under Maintenance']

    const resolveAssetName = (assetType, index) => {
      if (assetType === 'Vehicle') return vehicleModels[index % vehicleModels.length]
      if (assetType === 'Equipment') return equipmentNames[index % equipmentNames.length]
      if (assetType === 'Drone') return droneNames[index % droneNames.length]
      if (assetType === 'Communication Kit') return commNames[index % commNames.length]
      return powerNames[index % powerNames.length]
    }

    return Array.from({ length: 34 }, (_, index) => {
      const assetType = assetTypes[index % assetTypes.length]
      const status = statuses[index % statuses.length]
      const commissionedDate = new Date(2022 + (index % 3), (index * 2) % 12, ((index * 5) % 27) + 1)

      return {
        id: `AST-${resourceNumber.toString().padStart(3, '0')}-${(index + 1).toString().padStart(3, '0')}`,
        assetType,
        name: resolveAssetName(assetType, index),
        status,
        assignedUnit: `Unit ${((index % 9) + 1).toString().padStart(2, '0')}`,
        serialNumber: `SN-${resourceNumber}-${(16000 + index * 29)}`,
        commissionedDate,
        audioEnabled: index % 3 !== 0,
        videoEnabled: assetType === 'Drone' || index % 4 === 0,
        stillPhotosEnabled: assetType === 'Drone' || index % 5 < 2,
      }
    })
  }, [resourceId])

  const allAssetRecords = useMemo(() => [...onboardedAssets, ...assetRecords], [assetRecords, onboardedAssets])
  const typeOptions = useMemo(() => ['All asset types', ...new Set(allAssetRecords.map((item) => item.assetType))], [allAssetRecords])
  const statusOptions = ['All statuses', 'Active', 'Decommissioned', 'Under Maintenance']

  const filteredAssets = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return allAssetRecords.filter((asset) => {
      const matchesQuery =
        query.length === 0 ||
        [asset.id, asset.name, asset.assetType, asset.status, asset.serialNumber, asset.assignedUnit]
          .some((value) => value.toLowerCase().includes(query))

      const matchesStatus = statusFilter === 'All statuses' || asset.status === statusFilter
      const matchesType = typeFilter === 'All asset types' || asset.assetType === typeFilter

      return matchesQuery && matchesStatus && matchesType
    })
  }, [allAssetRecords, searchTerm, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize))
  const page = Math.min(currentPage, totalPages)

  const paginatedAssets = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredAssets.slice(start, start + pageSize)
  }, [filteredAssets, page])

  const statusTone = {
    Active: 'bg-emerald/15 text-emerald',
    Decommissioned: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
    'Under Maintenance': 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  }

  const updateFilter = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('All statuses')
    setTypeFilter('All asset types')
    setCurrentPage(1)
  }

  const closeOnboardModal = () => {
    setShowOnboardModal(false)
    setCreateError('')
    setAsset(createInitialAssetForm())
    setFormRenderKey((key) => key + 1)
  }

  const updateAssetField = (field, value) => {
    setAsset((current) => ({ ...current, [field]: value }))
    if (createError) {
      setCreateError('')
    }
  }

  const onboardAsset = () => {
    const requiredFields = ['name', 'serialNumber', 'assetType', 'assignedUnit', 'commissionedDate', 'status']
    const hasMissingField = requiredFields.some((field) => !`${asset[field] || ''}`.trim())

    if (hasMissingField) {
      setCreateError('Complete all required asset details before onboarding.')
      return
    }

    const resourceNumber = Number(`${resourceId || ''}`.replace(/\D/g, '')) || 1
    setOnboardedAssets((current) => [
      {
        ...asset,
        id: `AST-${resourceNumber.toString().padStart(3, '0')}-${(assetRecords.length + current.length + 1).toString().padStart(3, '0')}`,
        commissionedDate: new Date(`${asset.commissionedDate}T00:00:00`),
      },
      ...current,
    ])
    setCurrentPage(1)
    closeOnboardModal()
  }

  const formatDate = (value) => new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value)

  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Resource Assets</h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Asset registry including vehicles, equipment, drones, and support systems tied to this resource location.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowOnboardModal(true)}
          className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-emerald/80 dark:bg-light-green dark:hover:bg-light-green/80"
        >
          Onboard asset
        </button>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Search</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => updateFilter(setSearchTerm, event.target.value)}
            placeholder="Search assets by id, name, type..."
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Asset type</span>
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
        <p>{filteredAssets.length} assets found</p>
        <p>Page {page} of {totalPages}</p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
              <th className="px-2 py-2">Asset</th>
              <th className="px-2 py-2">Type</th>
              <th className="px-2 py-2">Assigned unit</th>
              <th className="px-2 py-2">Commissioned</th>
              <th className="px-2 py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAssets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-2 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                  No assets match the current search and filters.
                </td>
              </tr>
            )}

            {paginatedAssets.map((asset) => (
              <tr key={asset.id} className="border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20">
                <td className="px-2 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{asset.name}</p>
                    {asset.audioEnabled && (
                      <span title="Audio enabled" className="inline-flex rounded-full bg-sky-500/15 p-1 text-sky-700 dark:text-sky-300">
                        <AudioIcon className="h-3.5 w-3.5" />
                        <span className="sr-only">Audio enabled</span>
                      </span>
                    )}
                    {(asset.videoEnabled || asset.cameraEnabled) && (
                      <span title="Video enabled" className="inline-flex rounded-full bg-violet-500/15 p-1 text-violet-700 dark:text-violet-300">
                        <CameraIcon className="h-3.5 w-3.5" />
                        <span className="sr-only">Video enabled</span>
                      </span>
                    )}
                    {asset.stillPhotosEnabled && (
                      <span title="Still photos enabled" className="inline-flex rounded-full bg-emerald/15 p-1 text-emerald dark:text-light-green">
                        <PhotoIcon className="h-3.5 w-3.5" />
                        <span className="sr-only">Still photos enabled</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{asset.id} • {asset.serialNumber}</p>
                </td>
                <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{asset.assetType}</td>
                <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{asset.assignedUnit}</td>
                <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{formatDate(asset.commissionedDate)}</td>
                <td className="px-2 py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[asset.status]}`}>
                    {asset.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Showing {filteredAssets.length === 0 ? 0 : (page - 1) * pageSize + 1}
          {' '}
          to {Math.min(page * pageSize, filteredAssets.length)} of {filteredAssets.length}
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
        dialogTitle="Onboard asset"
        maxWidthClass="max-w-3xl"
      >
        <OnboardAsset
          key={formRenderKey}
          closeFunction={closeOnboardModal}
          createError={createError}
          onboardAsset={onboardAsset}
          asset={asset}
          updateAssetField={updateAssetField}
          assetTypeSelectOptions={typeOptions.filter((type) => type !== 'All asset types').map((name) => ({ name }))}
          statusSelectOptions={statusOptions.filter((status) => status !== 'All statuses').map((name) => ({ name }))}
        />
      </ModalDialog>
    </article>
  )
}

export default ResourceAssets
