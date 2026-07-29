import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Circle, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../../../context/ThemeContext'

const BudgetDetails = () => {
  const { budgetId } = useParams()
  const { isDarkMode } = useTheme()

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

  const statuses = ['Active', 'Planned', 'Paused', 'Closed']

  const resolveBudget = useMemo(() => {
    const demoBaseDate = new Date(2026, 6, 29)
    const numericId = Number(`${budgetId || ''}`.replace(/\D/g, '')) || 1
    const index = Math.max(0, numericId - 1)
    const amountInMillions = 85 + ((index * 23) % 620)
    const utilization = 18 + ((index * 11) % 80)
    const status = statuses[index % statuses.length]
    const programme = programmeNames[index % programmeNames.length]
    const coverageCount = (index % 3) + 2
    const coverageStates = Array.from({ length: coverageCount }, (_, step) => states[(index + step * 2) % states.length])

    const createdAt = new Date(2026, (index * 7) % 12, (index * 3) % 28 + 1)
    const expiryAt = new Date(demoBaseDate)
    if (index % 10 === 0) {
      expiryAt.setDate(expiryAt.getDate() + 2)
    } else if (index % 10 === 1) {
      expiryAt.setDate(expiryAt.getDate() + 14)
    } else if (index % 10 === 2) {
      expiryAt.setDate(expiryAt.getDate() + 27)
    } else {
      expiryAt.setDate(expiryAt.getDate() + 35 + ((index * 13) % 140))
    }

    return {
      id: `BGT-${numericId.toString().padStart(4, '0')}`,
      name: `Assistance Budget ${numericId}`,
      programme,
      status,
      amount: amountInMillions * 1000000,
      utilization,
      coverageStates,
      createdAt,
      expiryAt,
    }
  }, [budgetId])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [channelFilter, setChannelFilter] = useState('All')
  const [recipientPage, setRecipientPage] = useState(1)

  const channels = ['Bank Transfer', 'NQR', 'Voucher', 'USSD', 'Wallet']
  const recipientStatuses = ['Pending', 'Approved', 'Disbursed', 'Failed', 'Flagged']

  const recipients = useMemo(() => {
    return Array.from({ length: 48 }, (_, index) => {
      const state = resolveBudget.coverageStates[index % resolveBudget.coverageStates.length]
      const channel = channels[index % channels.length]
      const status = recipientStatuses[index % recipientStatuses.length]
      const amount = 25000 + ((index * 1750) % 65000)
      const disbursementDate = new Date(resolveBudget.createdAt)
      disbursementDate.setDate(disbursementDate.getDate() + 3 + (index % 18))

      return {
        id: `REC-${resolveBudget.id}-${(index + 1).toString().padStart(3, '0')}`,
        name: `Recipient ${index + 1}`,
        state,
        lga: `${state} LGA ${((index % 5) + 1)}`,
        amount,
        status,
        channel,
        disbursementDate,
        disbursementStatus: status === 'Disbursed' ? 'Disbursed' : status,
      }
    })
  }, [resolveBudget.createdAt, resolveBudget.coverageStates, resolveBudget.id])

  const filteredRecipients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return recipients.filter((recipient) => {
      const matchesQuery =
        query.length === 0 ||
        recipient.name.toLowerCase().includes(query) ||
        recipient.id.toLowerCase().includes(query) ||
        recipient.state.toLowerCase().includes(query) ||
        recipient.lga.toLowerCase().includes(query) ||
        recipient.channel.toLowerCase().includes(query)

      const matchesStatus = statusFilter === 'All' || recipient.status === statusFilter
      const matchesChannel = channelFilter === 'All' || recipient.channel === channelFilter

      return matchesQuery && matchesStatus && matchesChannel
    })
  }, [recipients, searchTerm, statusFilter, channelFilter])

  const itemsPerPage = 25
  const totalPages = Math.max(1, Math.ceil(filteredRecipients.length / itemsPerPage))
  const currentPage = Math.min(recipientPage, totalPages)

  const paginatedRecipients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredRecipients.slice(start, start + itemsPerPage)
  }, [currentPage, filteredRecipients])

  const totalAmount = resolveBudget.amount
  const amountDisbursed = recipients.filter((item) => item.status === 'Disbursed').reduce((sum, item) => sum + item.amount, 0)
  const amountToMopUp = Math.max(totalAmount - amountDisbursed, 0)
  const utilization = totalAmount > 0 ? (amountDisbursed / totalAmount) * 100 : 0
  const recipientsCount = recipients.length
  const disbursedRecipients = recipients.filter((item) => item.status === 'Disbursed').length
  const pendingRecipients = recipients.filter((item) => item.status === 'Pending').length
  const eligibleRecipients = recipients.filter((item) => item.status !== 'Flagged').length

  const fundingSources = useMemo(() => {
    const sourceTypes = ['Government', 'PPP', 'Individual', 'Corporate']
    const sourceNames = [
      'Federal Intervention Grant',
      'State Co-Funding Allocation',
      'NGO Solidarity Pool',
      'Corporate Social Impact Fund',
      'Community Match Grant',
    ]
    const sourceCount = 3 + (Number(`${budgetId || ''}`.replace(/\D/g, '')) % 3)
    const weights = [0.34, 0.26, 0.2, 0.12, 0.08]
    const selectedWeights = weights.slice(0, sourceCount)
    const weightTotal = selectedWeights.reduce((sum, weight) => sum + weight, 0)
    const normalizedWeights = selectedWeights.map((weight) => weight / weightTotal)

    const generatedSources = normalizedWeights.map((weight, index) => {
      const amountProvided = index === sourceCount - 1
        ? totalAmount - Math.round(totalAmount * normalizedWeights.slice(0, index).reduce((sum, current) => sum + current, 0))
        : Math.round(totalAmount * weight)

      return {
        name: sourceNames[index],
        type: sourceTypes[index % sourceTypes.length],
        amountProvided,
        status: index % 2 === 0 ? 'Paid' : 'Pledged',
      }
    })

    return generatedSources
  }, [budgetId, totalAmount])

  const mapStates = states.map((state) => ({
    state,
    covered: resolveBudget.coverageStates.includes(state),
  }))

  const coverageCentres = {
    Lagos: [6.5244, 3.3792],
    Kano: [12.0022, 8.592],
    Kaduna: [10.5222, 7.4383],
    Borno: [11.8333, 13.15],
    Benue: [7.3369, 8.74],
    Rivers: [4.8156, 7.0498],
    FCT: [9.0765, 7.3986],
    Plateau: [9.8965, 8.8583],
    Kogi: [7.8024, 6.7432],
    Anambra: [6.2104, 7.069],
    Ogun: [7.16, 3.35],
    Yobe: [11.746, 11.96],
  }

  const coverageLocations = resolveBudget.coverageStates.map((state, index) => ({
    state,
    coordinates: coverageCentres[state] ?? [9.0765, 7.4679],
    radius: 22000 + (index * 4500),
  }))

  const coverageBounds = coverageLocations.map((location) => location.coordinates)

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

  const setFilterAndReset = (setter, value) => {
    setter(value)
    setRecipientPage(1)
  }

  const recipientStatusTone = {
    Pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Approved: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
    Disbursed: 'bg-emerald/15 text-emerald',
    Failed: 'bg-red-500/15 text-red-600 dark:text-red-400',
    Flagged: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
  }

  const channelTone = {
    'Bank Transfer': 'bg-emerald/15 text-emerald',
    NQR: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
    Voucher: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    USSD: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
    Wallet: 'bg-orange-500/15 text-orange-600 dark:text-orange-300',
  }

  const fundingSourceTone = {
    Paid: 'bg-emerald/15 text-emerald',
    Pledged: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  }

  const budgetStatusTone = {
    Active: 'bg-emerald/15 text-emerald',
    Planned: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
    Paused: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Closed: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
  }

  const pageStart = filteredRecipients.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const pageEnd = Math.min(currentPage * itemsPerPage, filteredRecipients.length)

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">Budget Details</p>
            <h2 className="mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-100">{resolveBudget.name}</h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{resolveBudget.programme}</p>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{resolveBudget.id} • Created {formatDate(resolveBudget.createdAt)} • Expires {formatDate(resolveBudget.expiryAt)}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${budgetStatusTone[resolveBudget.status]}`}>{resolveBudget.status}</span>
            <span className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-semibold text-emerald">{resolveBudget.coverageStates.length} coverage areas</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Budget Amount</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(totalAmount)}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Amount Disbursed</p>
          <h3 className="mt-2 text-xl font-semibold text-emerald">{formatCurrency(amountDisbursed)}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Amount to Mop Up</p>
          <h3 className="mt-2 text-xl font-semibold text-amber-600 dark:text-amber-300">{formatCurrency(amountToMopUp)}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Utilization</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{utilization.toFixed(1)}%</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Eligible Recipients</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{eligibleRecipients}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Disbursed Recipients</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{disbursedRecipients}</h3>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10 xl:col-span-2">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Budget Coverage Map</h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Street map coverage of the areas served by this budget. The view opens zoomed out to include all coverage locations.</p>
          <div className="mt-4 h-96 overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700/60">
            <MapContainer
              bounds={coverageBounds}
              boundsOptions={{ padding: [32, 32], maxZoom: 6 }}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                url={
                  isDarkMode
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                }
              />

              {coverageLocations.map((location, index) => (
                <Circle
                  key={location.state}
                  center={location.coordinates}
                  radius={location.radius}
                  pathOptions={{
                    color: '#10b981',
                    fillColor: '#91F5AD',
                    fillOpacity: 0.18 + (index * 0.02),
                    weight: 1.5,
                  }}
                >
                  <Tooltip direction="top" opacity={0.95}>
                    {location.state} coverage area
                  </Tooltip>
                  <Popup minWidth={220}>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{location.state}</p>
                      <p className="text-xs text-stone-500">Coverage area for {resolveBudget.programme}</p>
                      <p className="mt-1 text-xs text-stone-700">Approximate coverage radius: {Math.round(location.radius / 1000)}km</p>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-stone-600 dark:text-stone-300">
            <span className="font-semibold">Coverage:</span>
            {coverageLocations.map((location) => (
              <span key={location.state} className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald" />
                {location.state}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10 xl:sticky xl:top-4">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Budget Summary</h3>
          <div className="mt-3 space-y-2">
            <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
              <p className="text-xs text-stone-500 dark:text-stone-400">Programme</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{resolveBudget.programme}</p>
            </div>
            <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
              <p className="text-xs text-stone-500 dark:text-stone-400">Budget Status</p>
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${budgetStatusTone[resolveBudget.status]}`}>{resolveBudget.status}</span>
            </div>
            <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
              <p className="text-xs text-stone-500 dark:text-stone-400">Recipients in Scope</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{recipientsCount}</p>
            </div>
            <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
              <p className="text-xs text-stone-500 dark:text-stone-400">Pending Recipients</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{pendingRecipients}</p>
            </div>
            <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
              <p className="text-xs text-stone-500 dark:text-stone-400">Coverage Areas</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{resolveBudget.coverageStates.join(', ')}</p>
            </div>
            <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
              <p className="text-xs text-stone-500 dark:text-stone-400">Expiring On</p>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{formatDate(resolveBudget.expiryAt)}</p>
            </div>
            <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
              <p className="text-xs text-stone-500 dark:text-stone-400">Disbursement Progress</p>
              <div className="mt-2 h-2 rounded-full bg-stone-200 dark:bg-stone-700">
                <div className="h-2 rounded-full bg-emerald" style={{ width: `${utilization}%` }} />
              </div>
              <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{utilization.toFixed(1)}% utilized</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/admin/payments-assistance/budgets" className="inline-flex rounded-md bg-emerald px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-light-green dark:bg-light-green dark:text-stone-900!">
              Back to Budgets
            </Link>
          </div>
        </article>
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Budget Funding Sources</h3>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Sources of funds contributing to this budget. Status indicates whether the source has been paid in or remains pledged.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Source Name</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Amount Provided</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {fundingSources.map((source) => (
                <tr key={source.name} className="border-b border-stone-100 dark:border-stone-800">
                  <td className="px-2 py-3 font-medium text-stone-900 dark:text-stone-100">{source.name}</td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{source.type}</td>
                  <td className="px-2 py-3 font-medium text-stone-800 dark:text-stone-200">{formatCurrency(source.amountProvided)}</td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${fundingSourceTone[source.status]}`}>{source.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100 mt-12">Budget Recipients</h3>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">All eligible recipients for this budget.</p>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 mt-4 mb-8">
          <div>
            <label className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Search Recipients</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setFilterAndReset(setSearchTerm, event.target.value)}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
              placeholder="Search name, location, or channel"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Recipient Status</label>
            <select
              value={statusFilter}
              onChange={(event) => setFilterAndReset(setStatusFilter, event.target.value)}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
            >
              <option value="All">All</option>
              {recipientStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Channel</label>
            <select
              value={channelFilter}
              onChange={(event) => setFilterAndReset(setChannelFilter, event.target.value)}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
            >
              <option value="All">All</option>
              {channels.map((channel) => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Eligible Recipient</th>
                <th className="px-2 py-2">Location</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Disbursement Status</th>
                <th className="px-2 py-2">Disbursement Date</th>
                <th className="px-2 py-2">Channel</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecipients.map((recipient) => (
                <tr key={recipient.id} className="border-b border-stone-100 dark:border-stone-800">
                  <td className="px-2 py-3">
                    <p className="font-medium text-stone-900 dark:text-stone-100">{recipient.name}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{recipient.id}</p>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">
                    <p>{recipient.state}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{recipient.lga}</p>
                  </td>
                  <td className="px-2 py-3 font-medium text-stone-800 dark:text-stone-200">{formatCurrency(recipient.amount)}</td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${recipientStatusTone[recipient.status]}`}>{recipient.status}</span>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">
                    {recipient.status === 'Disbursed' ? formatDate(recipient.disbursementDate) : '—'}
                  </td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${channelTone[recipient.channel]}`}>{recipient.channel}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedRecipients.length === 0 && (
            <div className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">No recipients match the selected filters.</div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-stone-200 pt-3 text-sm dark:border-stone-700 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone-600 dark:text-stone-300">Showing {pageStart} to {pageEnd} of {filteredRecipients.length} recipients</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRecipientPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              Previous
            </button>
            <span className="text-xs text-stone-600 dark:text-stone-300">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setRecipientPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
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

export default BudgetDetails