import React, { useEffect, useMemo, useRef, useState } from 'react'
import ModalDialog from '../../../components/layouts/ModalDialog'
import ImportRecipients from '../../../components/elements/workflows/recipients/ImportRecipients'
import NewRecipient from '../../../components/elements/workflows/recipients/NewRecipient'
import DotsVertical from '../../../components/elements/icons/DotsVertical'

const Recipients = () => {
  const programmeCatalog = useMemo(() => ([
    'Flood Relief Programme',
    'Food Security Support',
    'Medical Emergency Grant',
    'Displacement Assistance Fund',
    'Household Stabilization Grant',
    'Community Recovery Support',
    'Livelihood Restoration Fund',
    'Emergency Cash Transfer',
  ]), [])

  const locations = ['Lagos', 'Kano', 'Kaduna', 'Borno', 'Benue', 'Rivers', 'FCT', 'Plateau']
  const channels = ['Bank Transfer', 'Wallet', 'USSD', 'NQR', 'Voucher']

  const [recipients, setRecipients] = useState(() => {
    const baseNames = [
      'Aisha Mohammed', 'Musa Ibrahim', 'Chinwe Okafor', 'Sadiq Bello', 'Maryam Abdullahi', 'Tunde Akinyemi',
      'Fatima Lawal', 'Ifeanyi Nwosu', 'Zainab Yusuf', 'Umar Garba', 'Amina Jibrin', 'Victor Eze',
    ]

    return Array.from({ length: baseNames.length + 50 }, (_, index) => {
      const baseName = baseNames[index % baseNames.length]
      const name = index < baseNames.length ? baseName : `${baseName} ${Math.floor(index / baseNames.length) + 1}`
      const channel = channels[index % channels.length]
      const eligiblePrograms = [
        programmeCatalog[index % programmeCatalog.length],
        programmeCatalog[(index + 2) % programmeCatalog.length],
      ]
      const amount = 250000 + (index * 87500)
      const riskFlag = index % 5 === 0 ? 'Fraud Risk' : 'Safe'
      const statusCycle = ['Active', 'Suspended', 'Deactivated', 'In Review']
      const status = statusCycle[index % statusCycle.length]

      return {
        id: `REC-${(index + 1).toString().padStart(4, '0')}`,
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.').replace(/\./g, '_')}.${index + 1}@example.org`,
        phoneNumber: `080${(25000000 + index * 143).toString().padStart(8, '0').slice(0, 8)}`,
        location: locations[index % locations.length],
        eligiblePrograms,
        totalReceivedAmount: amount,
        receivedFromPrograms: Math.max(1, (index % 4) + 1),
        dateAdded: new Date(2026, index % 12, ((index * 2) % 27) + 1),
        channel,
        riskFlag,
        status,
        channelProvider: {
          'Bank Transfer': 'Zenith Bank',
          Wallet: 'Opay',
          USSD: 'MTN',
          NQR: 'Interswitch',
          Voucher: 'National Relief Trust',
        }[channel],
      }
    })
  })

  const [selectedRecipient, setSelectedRecipient] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [actionMenuRecipientId, setActionMenuRecipientId] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('All locations')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [riskFilter, setRiskFilter] = useState('All risk flags')
  const [channelFilter, setChannelFilter] = useState('All channels')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15
  const actionMenuRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!actionMenuRecipientId || !actionMenuRef.current) {
        return
      }

      if (!actionMenuRef.current.contains(event.target)) {
        setActionMenuRecipientId('')
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [actionMenuRecipientId])

  const stats = useMemo(() => {
    const totalRecipients = recipients.length
    const totalReceived = recipients.reduce((sum, recipient) => sum + recipient.totalReceivedAmount, 0)
    const programsCovered = new Set(recipients.flatMap((recipient) => recipient.eligiblePrograms)).size
    const channelsCovered = new Set(recipients.map((recipient) => recipient.channel)).size

    return {
      totalRecipients,
      totalReceived,
      programsCovered,
      channelsCovered,
    }
  }, [recipients])

  const filteredRecipients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return recipients.filter((recipient) => {
      const matchesSearch = !normalizedSearch || [
        recipient.name,
        recipient.email,
        recipient.phoneNumber,
        recipient.location,
        recipient.channel,
        recipient.channelProvider,
        recipient.status,
        recipient.riskFlag,
        recipient.eligiblePrograms.join(' '),
      ].some((field) => field.toLowerCase().includes(normalizedSearch))

      const matchesLocation = locationFilter === 'All locations' || recipient.location === locationFilter
      const matchesStatus = statusFilter === 'All statuses' || recipient.status === statusFilter
      const matchesRisk = riskFilter === 'All risk flags' || recipient.riskFlag === riskFilter
      const matchesChannel = channelFilter === 'All channels' || recipient.channel === channelFilter

      return matchesSearch && matchesLocation && matchesStatus && matchesRisk && matchesChannel
    })
  }, [channelFilter, locationFilter, recipients, riskFilter, searchTerm, statusFilter])

  const totalPages = Math.max(Math.ceil(filteredRecipients.length / pageSize), 1)

  const paginatedRecipients = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const start = (safePage - 1) * pageSize
    return filteredRecipients.slice(start, start + pageSize)
  }, [currentPage, filteredRecipients, totalPages])

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

  const detailField = (label, value) => (
    <div className="rounded-lg bg-stone-50 px-4 py-3 dark:bg-stone-900/20">
      <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">{value}</p>
    </div>
  )

  const getInitials = (name) => name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const channelTone = {
    'Bank Transfer': 'bg-emerald/15 text-emerald',
    Wallet: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
    USSD: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    NQR: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
    Voucher: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
  }

  const riskTone = {
    Safe: 'bg-emerald/15 text-emerald',
    'Fraud Risk': 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
  }

  const statusTone = {
    Active: 'bg-emerald/15 text-emerald',
    Suspended: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Deactivated: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
    'In Review': 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
  }

  const updateRecipientState = (recipientId, updates) => {
    setRecipients((current) => current.map((recipient) => (
      recipient.id === recipientId ? { ...recipient, ...updates } : recipient
    )))

    setSelectedRecipient((current) => {
      if (!current || current.id !== recipientId) {
        return current
      }

      return { ...current, ...updates }
    })
  }

  const runRecipientAction = (recipient, action) => {
    if (action === 'Suspend') {
      updateRecipientState(recipient.id, { status: 'Suspended' })
    }

    if (action === 'Unsuspend') {
      updateRecipientState(recipient.id, { status: 'Active' })
    }

    if (action === 'Deactivate') {
      updateRecipientState(recipient.id, { status: 'Deactivated', riskFlag: 'Fraud Risk' })
    }

    if (action === 'Review') {
      updateRecipientState(recipient.id, { status: 'In Review' })
    }

    setActionMenuRecipientId('')
  }

  const addRecipient = (recipient) => {
    const newRecipient = {
      id: `REC-${(recipients.length + 1).toString().padStart(4, '0')}`,
      name: recipient.name,
      email: recipient.email,
      phoneNumber: recipient.phoneNumber,
      location: recipient.location,
      eligiblePrograms: recipient.eligiblePrograms,
      totalReceivedAmount: 0,
      receivedFromPrograms: 0,
      dateAdded: new Date(),
      channel: recipient.channel,
      channelProvider: recipient.channelProvider,
      riskFlag: 'Safe',
      status: 'Active',
    }

    setRecipients((current) => [newRecipient, ...current])
    setCurrentPage(1)
    setShowCreateModal(false)
  }

  const beginImport = () => {
    setShowImportModal(false)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setLocationFilter('All locations')
    setStatusFilter('All statuses')
    setRiskFilter('All risk flags')
    setChannelFilter('All channels')
    setCurrentPage(1)
  }

  const setFilter = (setter, value) => {
    setter(value)
    setCurrentPage(1)
  }

  return (
    <section className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total recipients</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{stats.totalRecipients}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total received</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(stats.totalReceived)}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Eligible programs</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{stats.programsCovered}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Receiving channels</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{stats.channelsCovered}</h3>
        </article>
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Recipients</h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Recipient records with identity, contact details, location, eligible programmes, disbursement history, and channel.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
            >
              Import recipients from CSV
            </button>
            <button
              type="button"
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
            >
              Export recipients
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald/90"
            >
              Create new recipient
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr_auto] mb-8">
          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setFilter(setSearchTerm, event.target.value)}
              placeholder="Search recipients, email, phone, program..."
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            />
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Location</span>
            <select
              value={locationFilter}
              onChange={(event) => setFilter(setLocationFilter, event.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            >
              <option>All locations</option>
              {locations.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setFilter(setStatusFilter, event.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            >
              <option>All statuses</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Deactivated</option>
              <option>In Review</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Risk</span>
            <select
              value={riskFilter}
              onChange={(event) => setFilter(setRiskFilter, event.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            >
              <option>All risk flags</option>
              <option>Safe</option>
              <option>Fraud Risk</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Channel</span>
            <select
              value={channelFilter}
              onChange={(event) => setFilter(setChannelFilter, event.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
            >
              <option>All channels</option>
              {channels.map((channel) => (
                <option key={channel}>{channel}</option>
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
          <p>{filteredRecipients.length} recipient{filteredRecipients.length === 1 ? '' : 's'} found</p>
          <p>Page {Math.min(currentPage, totalPages)} of {totalPages}</p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Recipient</th>
                <th className="px-2 py-2">Location</th>
                <th className="px-2 py-2">Eligible programs</th>
                <th className="px-2 py-2">Total received</th>
                <th className="px-2 py-2">Date added</th>
                <th className="px-2 py-2">Receiving channels</th>
                <th className="px-2 py-2">Risk flag</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2 text-right">Options</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecipients.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-2 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                    No recipients match the current search and filters.
                  </td>
                </tr>
              )}

              {paginatedRecipients.map((recipient) => (
                <tr
                  key={recipient.id}
                  onClick={() => setSelectedRecipient(recipient)}
                  className="cursor-pointer border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20"
                >
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-sm font-semibold text-emerald">
                        {getInitials(recipient.name)}
                      </div>
                      <div>
                        <p className="font-medium text-stone-900 dark:text-stone-100">{recipient.name}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{recipient.email}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{recipient.phoneNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{recipient.location}</td>
                  <td className="px-2 py-3">
                    <div className="flex flex-wrap gap-2">
                      {recipient.eligiblePrograms.map((program) => (
                        <span key={program} className="rounded-full bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600 dark:bg-stone-900/30 dark:text-stone-300">
                          {program}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{formatCurrency(recipient.totalReceivedAmount)}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">from {recipient.receivedFromPrograms} programme{recipient.receivedFromPrograms === 1 ? '' : 's'}</p>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{formatDate(recipient.dateAdded)}</td>
                  <td className="px-2 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${channelTone[recipient.channel]}`}>{recipient.channel}</span>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{recipient.channelProvider}</p>
                  </td>
                  <td className="px-2 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${riskTone[recipient.riskFlag]}`}>{recipient.riskFlag}</span>
                  </td>
                  <td className="px-2 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[recipient.status]}`}>{recipient.status}</span>
                  </td>
                  <td className="px-2 py-3">
                    <div
                      ref={actionMenuRecipientId === recipient.id ? actionMenuRef : null}
                      className="relative flex justify-end"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setActionMenuRecipientId((current) => (current === recipient.id ? '' : recipient.id))}
                        className="rounded-lg border border-stone-200 px-2.5 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
                        aria-label="Recipient options"
                      >
                        <DotsVertical classes="h-4 w-4" />
                      </button>

                      {actionMenuRecipientId === recipient.id && (
                        <div className="absolute right-0 top-9 z-20 w-44 rounded-lg border border-stone-200 bg-white p-1 shadow-lg shadow-black/5 dark:border-stone-800 dark:bg-stone-950">
                          <button
                            type="button"
                            onClick={() => runRecipientAction(recipient, recipient.status === 'Suspended' ? 'Unsuspend' : 'Suspend')}
                            className="block w-full rounded px-3 py-2 text-left text-xs text-stone-700 transition hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-900/60"
                          >
                            {recipient.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                          </button>
                          <button
                            type="button"
                            onClick={() => runRecipientAction(recipient, 'Deactivate')}
                            className="block w-full rounded px-3 py-2 text-left text-xs text-stone-700 transition hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-900/60"
                          >
                            Deactivate
                          </button>
                          <button
                            type="button"
                            onClick={() => runRecipientAction(recipient, 'Review')}
                            className="block w-full rounded px-3 py-2 text-left text-xs text-stone-700 transition hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-900/60"
                          >
                            Review
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Showing {filteredRecipients.length === 0 ? 0 : (Math.min(currentPage, totalPages) - 1) * pageSize + 1}
            {' '}
            to {Math.min(Math.min(currentPage, totalPages) * pageSize, filteredRecipients.length)} of {filteredRecipients.length}
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

      <ModalDialog
        shown={showImportModal}
        closeFunction={() => setShowImportModal(false)}
        dialogTitle="Import recipients from CSV"
        maxWidthClass="max-w-2xl"
      >
        <ImportRecipients onBeginImport={beginImport} />
      </ModalDialog>

      <ModalDialog
        shown={showCreateModal}
        closeFunction={() => setShowCreateModal(false)}
        dialogTitle="Create new recipient"
        maxWidthClass="max-w-4xl"
      >
        <NewRecipient programmes={programmeCatalog} onAddRecipient={addRecipient} />
      </ModalDialog>

      <ModalDialog
        shown={Boolean(selectedRecipient)}
        closeFunction={() => setSelectedRecipient(null)}
        dialogTitle={selectedRecipient?.name || 'Recipient details'}
        maxWidthClass="max-w-3xl"
      >
        {selectedRecipient && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {selectedRecipient && (
                <div className="rounded-lg bg-stone-50 px-4 py-3 dark:bg-stone-900/20 sm:col-span-2">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Identity</p>
                  <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedRecipient.name}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{selectedRecipient.email} • {selectedRecipient.phoneNumber}</p>
                </div>
              )}
              {detailField('Location', selectedRecipient.location)}
              {detailField('Date added', formatDate(selectedRecipient.dateAdded))}
              {detailField('Total received', formatCurrency(selectedRecipient.totalReceivedAmount))}
              {detailField('Received from programmes', `${selectedRecipient.receivedFromPrograms} programme${selectedRecipient.receivedFromPrograms === 1 ? '' : 's'}`)}
              {detailField('Channel', selectedRecipient.channel)}
              {detailField('Channel provider', selectedRecipient.channelProvider)}
              {detailField('Risk flag', <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${riskTone[selectedRecipient.riskFlag]}`}>{selectedRecipient.riskFlag}</span>)}
              {detailField('Status', <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[selectedRecipient.status]}`}>{selectedRecipient.status}</span>)}
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
              <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Recipient actions</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => runRecipientAction(selectedRecipient, selectedRecipient.status === 'Suspended' ? 'Unsuspend' : 'Suspend')}
                  className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
                >
                  {selectedRecipient.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                </button>
                <button
                  type="button"
                  onClick={() => runRecipientAction(selectedRecipient, 'Deactivate')}
                  className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
                >
                  Deactivate
                </button>
                <button
                  type="button"
                  onClick={() => runRecipientAction(selectedRecipient, 'Review')}
                  className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
                >
                  Review
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
              <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Eligible programmes</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedRecipient.eligiblePrograms.map((program) => (
                  <span key={program} className="rounded-full bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600 dark:bg-stone-900/30 dark:text-stone-300">
                    {program}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </ModalDialog>
    </section>
  )
}

export default Recipients