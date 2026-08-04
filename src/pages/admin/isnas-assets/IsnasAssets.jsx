import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ModalDialog from '../../../components/layouts/ModalDialog'
import CameraIcon from '../../../components/elements/icons/CameraIcon'
import AudioIcon from '../../../components/elements/icons/AudioIcon'
import VideoIcon from '../../../components/elements/icons/VideoIcon'
import {
  ASSET_TYPES,
  BRANDS,
  LOCATIONS,
  STATUSES,
  TYPE_PROFILES,
  createInitialAssetForm,
  createSeedAssets,
  readStoredAssets,
  writeStoredAssets,
} from './isnasAssetData'

const IsnasAssets = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All types')
  const [brandFilter, setBrandFilter] = useState('All brands')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createError, setCreateError] = useState('')
  const [createFormRenderKey, setCreateFormRenderKey] = useState(0)
  const [newAsset, setNewAsset] = useState(() => createInitialAssetForm())
  const [createdAssets, setCreatedAssets] = useState(() => readStoredAssets())
  const pageSize = 12

  useEffect(() => {
    writeStoredAssets(createdAssets)
  }, [createdAssets])

  const seedAssets = useMemo(() => createSeedAssets(), [])
  const allAssets = useMemo(() => {
    const createdIds = new Set(createdAssets.map((asset) => asset.id))

    return [...createdAssets, ...seedAssets.filter((asset) => !createdIds.has(asset.id))]
  }, [createdAssets, seedAssets])
  const typeOptions = useMemo(() => ['All types', ...new Set(allAssets.map((asset) => asset.type))], [allAssets])
  const brandOptions = useMemo(() => ['All brands', ...new Set(allAssets.map((asset) => asset.brand))], [allAssets])
  const statusOptions = ['All statuses', ...STATUSES]

  const statusTone = {
    Active: 'bg-emerald/15 text-emerald',
    Standby: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
    'Under Maintenance': 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Decommissioned: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
    Deployed: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  }

  const filteredAssets = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return allAssets.filter((asset) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          asset.id,
          asset.name,
          asset.type,
          asset.brand,
          asset.model,
          asset.serialNumber,
          asset.location,
          asset.currentLocation,
          asset.zone,
          asset.status,
          asset.firmwareVersion,
          asset.ipAddress,
        ].some((value) => `${value}`.toLowerCase().includes(normalizedSearch))

      const matchesType = typeFilter === 'All types' || asset.type === typeFilter
      const matchesBrand = brandFilter === 'All brands' || asset.brand === brandFilter
      const matchesStatus = statusFilter === 'All statuses' || asset.status === statusFilter

      return matchesSearch && matchesType && matchesBrand && matchesStatus
    })
  }, [allAssets, brandFilter, searchTerm, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / pageSize))
  const page = Math.min(currentPage, totalPages)

  const paginatedAssets = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredAssets.slice(start, start + pageSize)
  }, [filteredAssets, page])

  const summary = useMemo(() => {
    const activeAssets = allAssets.filter((asset) => asset.status === 'Active').length
    const deployedAssets = allAssets.filter((asset) => asset.status === 'Deployed').length
    const decommissionedAssets = allAssets.filter((asset) => asset.status === 'Decommissioned').length
    const cameraEnabledAssets = allAssets.filter((asset) => asset.cameraEnabled).length
    const soundEnabledAssets = allAssets.filter((asset) => asset.soundEnabled).length
    const videoEnabledAssets = allAssets.filter((asset) => asset.videoEnabled).length

    return {
      totalAssets: allAssets.length,
      activeAssets,
      deployedAssets,
      decommissionedAssets,
      cameraEnabledAssets,
      soundEnabledAssets,
      videoEnabledAssets,
    }
  }, [allAssets])

  const updateFilter = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  const updateNewAssetField = (field, value) => {
    setNewAsset((current) => ({ ...current, [field]: value }))
    if (createError) {
      setCreateError('')
    }
  }

  const openCreateModal = () => {
    setCreateError('')
    setShowCreateModal(true)
    setCreateFormRenderKey((current) => current + 1)
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    setCreateError('')
    setNewAsset(createInitialAssetForm())
    setCreateFormRenderKey((current) => current + 1)
  }

  const createAsset = () => {
    const requiredFields = ['name', 'type', 'brand', 'model', 'serialNumber', 'location', 'status']
    const hasMissingField = requiredFields.some((field) => !`${newAsset[field] || ''}`.trim())

    if (hasMissingField) {
      setCreateError('Complete the required asset details before creating the record.')
      return
    }

    const highestId = allAssets.reduce((maxId, asset) => {
      const numericValue = Number(`${asset.id || ''}`.replace(/\D/g, '')) || 0
      return Math.max(maxId, numericValue)
    }, 0)

    const createdAsset = {
      id: `AST-${(highestId + 1).toString().padStart(4, '0')}`,
      name: newAsset.name.trim(),
      type: newAsset.type,
      brand: newAsset.brand,
      model: newAsset.model.trim(),
      serialNumber: newAsset.serialNumber.trim(),
      location: newAsset.location,
      currentLocation: newAsset.location,
      status: newAsset.status,
      cameraEnabled: newAsset.cameraEnabled,
      soundEnabled: newAsset.soundEnabled,
      videoEnabled: newAsset.videoEnabled,
      installedDate: new Date(),
      lastServiceDate: new Date(),
      zone: 'Custom deployment zone',
      firmwareVersion: 'v1.0.0',
      ipAddress: `10.24.99.${(highestId % 253) + 1}`,
    }

    setCreatedAssets((current) => [createdAsset, ...current])
    setCurrentPage(1)
    closeCreateModal()
  }

  const resetFilters = () => {
    setSearchTerm('')
    setTypeFilter('All types')
    setBrandFilter('All brands')
    setStatusFilter('All statuses')
    setCurrentPage(1)
  }

  const formatDate = (value) => {
    if (!value) {
      return 'N/A'
    }

    return new Intl.DateTimeFormat('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  }

  const renderBooleanBadge = (value) => (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${value
        ? 'bg-emerald/15 text-emerald dark:text-light-green'
        : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300'}`}
    >
      {value ? 'Yes' : 'No'}
    </span>
  )

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">ISNAS Assets</p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">Security surveillance and IoT asset registry</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
          Records for cameras, sensors, alarms, gateways, and other security devices with capability flags and service history.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total assets</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.totalAssets}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Active assets</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.activeAssets}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Deployed assets</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.deployedAssets}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Camera-enabled</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.cameraEnabledAssets}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Video-enabled</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.videoEnabledAssets}</h3>
        </article>
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Security assets</h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              Surveillance hardware and IoT devices used for visibility, detection, deterrence, and perimeter security.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald/90 dark:bg-light-green dark:text-stone-900 dark:hover:bg-light-green/80"
          >
            Create asset
          </button>
        </div>

        <div className="mb-8 mt-4 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => updateFilter(setSearchTerm, event.target.value)}
              placeholder="Search by name, brand, serial, site, or IP..."
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Type</span>
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
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Brand</span>
            <select
              value={brandFilter}
              onChange={(event) => updateFilter(setBrandFilter, event.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            >
              {brandOptions.map((brand) => (
                <option key={brand}>{brand}</option>
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
          <p>{filteredAssets.length} asset{filteredAssets.length === 1 ? '' : 's'} found</p>
          <p>Page {page} of {totalPages}</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Asset</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Brand</th>
                <th className="px-2 py-2">Current location</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Camera</th>
                <th className="px-2 py-2">Sound</th>
                <th className="px-2 py-2">Video</th>
                <th className="px-2 py-2">Installed</th>
                <th className="px-2 py-2">Last service</th>
              </tr>
            </thead>

            <tbody>
              {paginatedAssets.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-2 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                    No assets match the current search and filters.
                  </td>
                </tr>
              )}

              {paginatedAssets.map((asset) => {
                const profile = TYPE_PROFILES[asset.type] || { category: 'Asset' }

                return (
                  <tr
                    key={asset.id}
                    onClick={() => navigate(`/admin/isnas-assets/${asset.id}`)}
                    className="cursor-pointer border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20"
                  >
                    <td className="px-2 py-3">
                      <p className="font-medium text-stone-900 dark:text-stone-100">{asset.name}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{asset.id} • {asset.serialNumber}</p>
                    </td>
                    <td className="px-2 py-3 text-stone-700 dark:text-stone-200">
                      <p>{asset.type}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{profile.category}</p>
                    </td>
                    <td className="px-2 py-3 text-stone-700 dark:text-stone-200">
                      <p className="font-medium text-stone-900 dark:text-stone-100">{asset.brand}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{asset.model}</p>
                    </td>
                    <td className="px-2 py-3 text-stone-700 dark:text-stone-200">
                      <p className="font-medium text-stone-900 dark:text-stone-100">{asset.currentLocation}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{asset.zone}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{asset.ipAddress}</p>
                    </td>
                    <td className="px-2 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[asset.status] || statusTone.Standby}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-2 py-3">{renderBooleanBadge(asset.cameraEnabled)}</td>
                    <td className="px-2 py-3">{renderBooleanBadge(asset.soundEnabled)}</td>
                    <td className="px-2 py-3">{renderBooleanBadge(asset.videoEnabled)}</td>
                    <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{formatDate(asset.installedDate)}</td>
                    <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{formatDate(asset.lastServiceDate)}</td>
                  </tr>
                )
              })}
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
      </article>

      <ModalDialog
        shown={showCreateModal}
        closeFunction={closeCreateModal}
        dialogTitle="Create asset"
        maxWidthClass="max-w-3xl"
        key={createFormRenderKey}
      >
        <div className="space-y-4">
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Add a new surveillance asset or IoT device to the registry.
          </p>

          {createError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
              {createError}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Name</span>
              <input
                key={`name-${createFormRenderKey}`}
                type="text"
                value={newAsset.name}
                onChange={(event) => updateNewAssetField('name', event.target.value)}
                placeholder="North perimeter PTZ camera"
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              />
            </label>

            <label>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Type</span>
              <select
                value={newAsset.type}
                onChange={(event) => {
                  const type = event.target.value
                  const profile = TYPE_PROFILES[type]
                  setNewAsset((current) => ({
                    ...current,
                    type,
                    cameraEnabled: profile.cameraEnabled,
                    soundEnabled: profile.soundEnabled,
                    videoEnabled: profile.videoEnabled,
                  }))
                  if (createError) {
                    setCreateError('')
                  }
                }}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              >
                {ASSET_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Brand</span>
              <select
                value={newAsset.brand}
                onChange={(event) => updateNewAssetField('brand', event.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              >
                {BRANDS.map((brand) => (
                  <option key={brand}>{brand}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Model</span>
              <input
                type="text"
                value={newAsset.model}
                onChange={(event) => updateNewAssetField('model', event.target.value)}
                placeholder="Q63 SecureView"
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              />
            </label>

            <label>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Serial number</span>
              <input
                type="text"
                value={newAsset.serialNumber}
                onChange={(event) => updateNewAssetField('serialNumber', event.target.value)}
                placeholder="SN-2026-1001"
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              />
            </label>

            <label>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Current location</span>
              <select
                value={newAsset.location}
                onChange={(event) => updateNewAssetField('location', event.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              >
                {LOCATIONS.map((location) => (
                  <option key={location}>{location}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Status</span>
              <select
                value={newAsset.status}
                onChange={(event) => updateNewAssetField('status', event.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
              >
                {STATUSES.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>

            <div className="md:col-span-2 grid gap-3 sm:grid-cols-3">
              <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-3 text-sm text-stone-700 dark:border-stone-800 dark:text-stone-200">
                <input
                  type="checkbox"
                  checked={newAsset.cameraEnabled}
                  onChange={(event) => updateNewAssetField('cameraEnabled', event.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-emerald focus:ring-emerald"
                />
                <span className="inline-flex items-center gap-2">
                  <CameraIcon className="h-4 w-4" />
                  Camera enabled
                </span>
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-3 text-sm text-stone-700 dark:border-stone-800 dark:text-stone-200">
                <input
                  type="checkbox"
                  checked={newAsset.soundEnabled}
                  onChange={(event) => updateNewAssetField('soundEnabled', event.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-emerald focus:ring-emerald"
                />
                <span className="inline-flex items-center gap-2">
                  <AudioIcon className="h-4 w-4" />
                  Sound enabled
                </span>
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-3 text-sm text-stone-700 dark:border-stone-800 dark:text-stone-200">
                <input
                  type="checkbox"
                  checked={newAsset.videoEnabled}
                  onChange={(event) => updateNewAssetField('videoEnabled', event.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 text-emerald focus:ring-emerald"
                />
                <span className="inline-flex items-center gap-2">
                  <VideoIcon className="h-4 w-4" />
                  Video enabled
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeCreateModal}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={createAsset}
              className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald/90 dark:bg-light-green dark:text-stone-900 dark:hover:bg-light-green/80"
            >
              Create asset
            </button>
          </div>
        </div>
      </ModalDialog>
    </section>
  )
}

export default IsnasAssets