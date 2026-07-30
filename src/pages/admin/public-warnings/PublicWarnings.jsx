import React, { useRef, useMemo, useState } from 'react'
import ModalDialog from '../../../components/layouts/ModalDialog'
import TextField from '../../../components/elements/form/TextField'
import TextareaField from '../../../components/elements/form/TextareaField'
import AutocompleteSelect from '../../../components/elements/form/AutocompleteSelect'
import Checkbox from '../../../components/elements/form/Checkbox'
import RadioGroup from '../../../components/elements/form/RadioGroup'
import FormButton from '../../../components/elements/form/FormButton'
import FileUpload from '../../../components/elements/form/FileUpload'

const DELIVERY_CHANNELS = ['SMS', 'Email', 'App push', 'Social media']

const WARNING_TYPES = [
  { label: 'Crime Watch', description: 'Crime incidents, threats, and policing advisories.' },
  { label: 'Disaster Alert', description: 'Flooding, fire outbreaks, storms, and major hazards.' },
  { label: 'Environmental Advisory', description: 'Heat, air quality, and weather-related caution notices.' },
  { label: 'Missing Person', description: 'Urgent public support notices for missing persons.' },
  { label: 'Traffic and Transport', description: 'Road closures, diversions, and transport disruptions.' },
  { label: 'Public Health Notice', description: 'Health advisories and preventive safety broadcasts.' },
]

const WARNING_TYPE_TONE = {
  'Crime Watch': 'bg-red-500/15 text-red-600 dark:text-red-300',
  'Disaster Alert': 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  'Environmental Advisory': 'bg-emerald/15 text-emerald',
  'Missing Person': 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
  'Traffic and Transport': 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
  'Public Health Notice': 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
}

const REGION_OPTIONS = [
  { name: 'Lagos Mainland' },
  { name: 'Lagos Island' },
  { name: 'Abuja Municipal' },
  { name: 'Wuse' },
  { name: 'Kubwa' },
  { name: 'Kano Municipal' },
  { name: 'Port Harcourt' },
  { name: 'Ibadan North' },
  { name: 'Kaduna North' },
  { name: 'Enugu East' },
  { name: 'Benin City' },
  { name: 'Jos North' },
]

const formatDateTime = (value) => {
  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)
}

const wantedPersonAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVufv-lHG6ZZD14ASnJRnGLT4tx_EC9FNPxRIIc5qh1Q&s=10'

const buildSeedWarnings = () => {
  return [
    {
      id: 'WARN-0001',
      type: 'Crime Watch',
      title: 'Wanted Person Alert',
      body: 'Public assistance needed. Last seen near the central market area. Do not approach and report any sightings immediately.',
      deliveredTo: 15820,
      regions: ['Lagos Mainland', 'Lagos Island', 'Ikeja'],
      channels: ['App push', 'Social media', 'Email'],
      sentAt: new Date('2026-07-30T08:15:00'),
      resendCount: 0,
      avatar: wantedPersonAvatar,
      avatarAlt: 'Wanted person notice',
      isWantedPerson: true,
      personName: 'Unknown Suspect',
      lastSeen: 'Central Market, Lagos',
    },
    {
      id: 'WARN-0002',
      type: 'Crime Watch',
      title: 'Armed Robbery Advisory',
      body: 'Security teams are monitoring reported robbery activity. Avoid isolated streets after dark and stay in groups.',
      deliveredTo: 9360,
      regions: ['Abuja Municipal', 'Wuse', 'Kubwa'],
      channels: ['SMS', 'App push'],
      sentAt: new Date('2026-07-29T21:30:00'),
      resendCount: 1,
    },
    {
      id: 'WARN-0003',
      type: 'Disaster Alert',
      title: 'Flood Watch Update',
      body: 'Heavy rainfall expected from 6PM. Move valuables to higher ground and avoid river channels.',
      deliveredTo: 12490,
      regions: ['Lagos Mainland', 'Lagos Island', 'Port Harcourt'],
      channels: ['SMS', 'App push', 'Social media'],
      sentAt: new Date('2026-07-29T18:05:00'),
      resendCount: 0,
    },
    {
      id: 'WARN-0004',
      type: 'Environmental Advisory',
      title: 'Heat Advisory',
      body: 'Daytime temperatures are high. Stay hydrated, reduce outdoor activity between 12PM and 3PM.',
      deliveredTo: 8620,
      regions: ['Abuja Municipal', 'Wuse', 'Kubwa'],
      channels: ['SMS', 'Email'],
      sentAt: new Date('2026-07-28T11:20:00'),
      resendCount: 1,
    },
    {
      id: 'WARN-0005',
      type: 'Traffic and Transport',
      title: 'Road Closure Notice',
      body: 'Emergency repairs are ongoing on Ring Road. Use approved diversions until 8PM today.',
      deliveredTo: 5375,
      regions: ['Ibadan North', 'Benin City'],
      channels: ['SMS', 'App push'],
      sentAt: new Date('2026-07-27T08:40:00'),
      resendCount: 2,
    },
    {
      id: 'WARN-0006',
      type: 'Public Health Notice',
      title: 'Power Surge Alert',
      body: 'Temporary voltage fluctuation reported. Unplug sensitive devices until official all-clear notice.',
      deliveredTo: 6410,
      regions: ['Kano Municipal', 'Kaduna North', 'Jos North'],
      channels: ['SMS', 'Email', 'Social media'],
      sentAt: new Date('2026-07-26T19:10:00'),
      resendCount: 0,
    },
  ]
}

const PublicWarnings = () => {
  const [warnings, setWarnings] = useState(() => buildSeedWarnings())
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [title, setTitle] = useState('')
  const [selectedType, setSelectedType] = useState(null)
  const [message, setMessage] = useState('')
  const [selectedRegionOption, setSelectedRegionOption] = useState(null)
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedChannels, setSelectedChannels] = useState([])
  const [selectedAttachment, setSelectedAttachment] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [audienceReach, setAudienceReach] = useState(0)
  const [audienceProgress, setAudienceProgress] = useState(0)
  const [isIdentifyingAudience, setIsIdentifyingAudience] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [channelFilter, setChannelFilter] = useState('All')
  const [regionFilter, setRegionFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 8
  const audienceSimulationQueueRef = useRef(0)
  const audienceSimulationRunningRef = useRef(false)
  const audienceSimulationTimerRef = useRef(null)

  const [formErrors, setFormErrors] = useState({
    title: '',
    type: '',
    message: '',
    regions: '',
    channels: '',
    attachment: '',
  })

  const summary = useMemo(() => {
    const recipients = warnings.reduce((sum, item) => sum + item.deliveredTo, 0)
    const uniqueRegions = new Set(warnings.flatMap((item) => item.regions)).size

    return {
      totalWarnings: warnings.length,
      totalRecipients: recipients,
      uniqueRegions,
    }
  }, [warnings])

  const typeOptions = useMemo(() => {
    return ['All', ...new Set(warnings.map((warning) => warning.type))]
  }, [warnings])

  const channelOptions = useMemo(() => {
    return ['All', ...new Set(warnings.flatMap((warning) => warning.channels))]
  }, [warnings])

  const regionOptions = useMemo(() => {
    return ['All', ...new Set(warnings.flatMap((warning) => warning.regions))]
  }, [warnings])

  const filteredWarnings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return warnings.filter((warning) => {
      const matchesQuery =
        query.length === 0 ||
        warning.title.toLowerCase().includes(query) ||
        warning.body.toLowerCase().includes(query) ||
        warning.type.toLowerCase().includes(query) ||
        warning.regions.some((region) => region.toLowerCase().includes(query)) ||
        warning.channels.some((channel) => channel.toLowerCase().includes(query))

      const matchesType = typeFilter === 'All' || warning.type === typeFilter
      const matchesChannel = channelFilter === 'All' || warning.channels.includes(channelFilter)
      const matchesRegion = regionFilter === 'All' || warning.regions.includes(regionFilter)

      return matchesQuery && matchesType && matchesChannel && matchesRegion
    })
  }, [channelFilter, regionFilter, searchTerm, typeFilter, warnings])

  const totalPages = Math.max(1, Math.ceil(filteredWarnings.length / itemsPerPage))
  const page = Math.min(currentPage, totalPages)

  const paginatedWarnings = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return filteredWarnings.slice(start, start + itemsPerPage)
  }, [filteredWarnings, page])

  const fromRow = filteredWarnings.length === 0 ? 0 : (page - 1) * itemsPerPage + 1
  const toRow = Math.min(page * itemsPerPage, filteredWarnings.length)

  const isUploadType = selectedType?.label === 'Missing Person' || selectedType?.label === 'Crime Watch'

  const runAudienceSimulation = () => {
    if (audienceSimulationQueueRef.current <= 0) {
      audienceSimulationRunningRef.current = false
      setIsIdentifyingAudience(false)
      setAudienceProgress(0)
      return
    }

    audienceSimulationRunningRef.current = true
    audienceSimulationQueueRef.current -= 1
    setIsIdentifyingAudience(true)
    setAudienceProgress(0)

    const startedAt = Date.now()
    const duration = 3000

    if (audienceSimulationTimerRef.current) {
      clearInterval(audienceSimulationTimerRef.current)
    }

    audienceSimulationTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextProgress = Math.min((elapsed / duration) * 100, 100)

      setAudienceProgress(nextProgress)

      if (nextProgress >= 100) {
        clearInterval(audienceSimulationTimerRef.current)
        audienceSimulationTimerRef.current = null

        const simulatedAudienceGain = 1100 + Math.floor(Math.random() * 2300)
        setAudienceReach((current) => current + simulatedAudienceGain)

        runAudienceSimulation()
      }
    }, 100)
  }

  const queueAudienceSimulation = () => {
    audienceSimulationQueueRef.current += 1

    if (!audienceSimulationRunningRef.current) {
      runAudienceSimulation()
    }
  }

  const toggleChannel = (channel) => {
    setSelectedChannels((current) => {
      if (current.includes(channel)) {
        return current.filter((item) => item !== channel)
      }

      return [...current, channel]
    })
  }

  const addSelectedRegion = () => {
    const regionName = selectedRegionOption?.name
    if (!regionName || selectedRegions.includes(regionName)) {
      return
    }

    setSelectedRegions((current) => [...current, regionName])
    setFormErrors((current) => ({ ...current, regions: '' }))
    queueAudienceSimulation()
  }

  const removeRegion = (region) => {
    setSelectedRegions((current) => current.filter((item) => item !== region))
  }

  const resetCreateWarningForm = () => {
    setTitle('')
    setSelectedType(null)
    setMessage('')
    setSelectedRegionOption(null)
    setSelectedRegions([])
    setSelectedChannels([])
    setSelectedAttachment(null)
    setAudienceReach(0)
    setAudienceProgress(0)
    setIsIdentifyingAudience(false)

    if (audienceSimulationTimerRef.current) {
      clearInterval(audienceSimulationTimerRef.current)
      audienceSimulationTimerRef.current = null
    }

    audienceSimulationQueueRef.current = 0
    audienceSimulationRunningRef.current = false

    setFormErrors({
      title: '',
      type: '',
      message: '',
      regions: '',
      channels: '',
      attachment: '',
    })
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    resetCreateWarningForm()
  }

  const onSelectWarningType = (type) => {
    setSelectedType(type)
    setFormErrors((current) => ({
      ...current,
      type: '',
      attachment: type?.label === 'Missing Person' ? current.attachment : '',
    }))
  }

  const resendWarning = (warningId) => {
    setWarnings((current) => current.map((warning) => {
      if (warning.id !== warningId) {
        return warning
      }

      return {
        ...warning,
        sentAt: new Date(),
        resendCount: warning.resendCount + 1,
      }
    }))
  }

  const createWarning = () => {
    const nextErrors = {
      title: title.trim() ? '' : 'Title is required',
      type: selectedType?.label ? '' : 'Warning type is required',
      message: message.trim() ? '' : 'Message is required',
      regions: selectedRegions.length > 0 ? '' : 'Select at least one region',
      channels: selectedChannels.length > 0 ? '' : 'Select at least one channel',
      attachment: selectedType?.label === 'Missing Person' && !selectedAttachment
        ? 'Upload an image or supporting file for this missing person alert'
        : '',
    }

    setFormErrors(nextErrors)

    const hasErrors = Object.values(nextErrors).some((value) => value !== '')
    if (hasErrors) {
      return
    }

    setProcessing(true)

    const generatedDeliveredTo = selectedRegions.length * (1200 + Math.floor(Math.random() * 1900))

    const newWarning = {
      id: `WARN-${(warnings.length + 1).toString().padStart(4, '0')}`,
      type: selectedType.label,
      title: title.trim(),
      body: message.trim(),
      deliveredTo: generatedDeliveredTo,
      regions: selectedRegions,
      channels: selectedChannels,
      attachmentName: selectedAttachment?.name || '',
      sentAt: new Date(),
      resendCount: 0,
    }

    setWarnings((current) => [newWarning, ...current])
    setCurrentPage(1)
    setProcessing(false)
    closeCreateModal()
  }

  const updateFilters = (updater) => {
    updater()
    setCurrentPage(1)
  }

  return (
    <section className="space-y-5">
    <div className="">
        <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">Public Warnings</p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">Public Warnings Suite</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            Centralized platform for managing public warnings, including message broadcasting, audience targeting, and regional coverage.
        </p>
    </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total warnings sent</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.totalWarnings}</h3>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">People reached</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.totalRecipients.toLocaleString()}</h3>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Coverage regions</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.uniqueRegions}</h3>
        </article>
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Public warnings</h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Broadcast alerts with message previews, delivery volume, and regional coverage.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white dark:text-stone-800 transition hover:bg-emerald/90"
          >
            Create new warning
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label htmlFor="warnings-search" className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Search</label>
            <input
              id="warnings-search"
              type="search"
              value={searchTerm}
              onChange={(event) => updateFilters(() => setSearchTerm(event.target.value))}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
              placeholder="Search title, type, region, channel"
            />
          </div>

          <div>
            <label htmlFor="warnings-type-filter" className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Type</label>
            <select
              id="warnings-type-filter"
              value={typeFilter}
              onChange={(event) => updateFilters(() => setTypeFilter(event.target.value))}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="warnings-channel-filter" className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Channel</label>
            <select
              id="warnings-channel-filter"
              value={channelFilter}
              onChange={(event) => updateFilters(() => setChannelFilter(event.target.value))}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
            >
              {channelOptions.map((channel) => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="warnings-region-filter" className="mb-1 block text-xs text-stone-500 dark:text-stone-400">Region</label>
            <select
              id="warnings-region-filter"
              value={regionFilter}
              onChange={(event) => updateFilters(() => setRegionFilter(event.target.value))}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 focus:border-stone-400 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
            >
              {regionOptions.map((region) => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setTypeFilter('All')
                setChannelFilter('All')
                setRegionFilter('All')
                setCurrentPage(1)
              }}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Warning</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Delivered to</th>
                <th className="px-2 py-2">Regions</th>
                <th className="px-2 py-2">Channels</th>
                <th className="px-2 py-2">Last sent</th>
                <th className="px-2 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedWarnings.map((warning) => (
                <tr key={warning.id} className="border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-900/20">
                  <td className="px-2 py-3 align-top">
                    <div className="flex items-start gap-3">
                      {warning.avatar && (
                        <img
                          src={warning.avatar}
                          alt={warning.avatarAlt || warning.title}
                          className="h-auto w-14 shrink-0 rounded-lg border border-stone-200 object-cover dark:border-stone-800"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900 dark:text-stone-100">{warning.title}</p>
                        {warning.isWantedPerson && warning.personName && (
                          <p className="mt-1 text-xs font-medium text-stone-600 dark:text-stone-300">Wanted person: {warning.personName}</p>
                        )}
                        {warning.isWantedPerson && warning.lastSeen && (
                          <p className="text-xs text-stone-500 dark:text-stone-400">Last seen: {warning.lastSeen}</p>
                        )}
                        <p className="mt-1 max-w-md text-xs leading-5 text-stone-500 dark:text-stone-400">{warning.body}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 align-top">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${WARNING_TYPE_TONE[warning.type] || 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-300'}`}>
                      {warning.type}
                    </span>
                  </td>
                  <td className="px-2 py-3 align-top text-stone-700 dark:text-stone-200">
                    <p className="font-semibold">{warning.deliveredTo.toLocaleString()}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">people</p>
                  </td>
                  <td className="px-2 py-3 align-top text-stone-600 dark:text-stone-300">{warning.regions.join(', ')}</td>
                  <td className="px-2 py-3 align-top">
                    <div className="flex flex-wrap gap-2">
                      {warning.channels.map((channel) => (
                        <span key={`${warning.id}-${channel}`} className="rounded-full bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600 dark:bg-stone-900/30 dark:text-stone-300">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-2 py-3 align-top text-stone-600 dark:text-stone-300">
                    <p>{formatDateTime(warning.sentAt)}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Resent {warning.resendCount} time{warning.resendCount === 1 ? '' : 's'}</p>
                  </td>
                  <td className="px-2 py-3 align-top text-right">
                    <button
                      type="button"
                      onClick={() => resendWarning(warning.id)}
                      className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
                    >
                      Resend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedWarnings.length === 0 && (
            <div className="py-8 text-center text-sm text-stone-500 dark:text-stone-400">No public warnings match the selected filters.</div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 text-sm dark:border-stone-700 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone-600 dark:text-stone-300">Showing {fromRow} to {toRow} of {filteredWarnings.length} warnings</p>
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

      <ModalDialog
        shown={showCreateModal}
        closeFunction={closeCreateModal}
        dialogTitle="Create and send public warning"
        maxWidthClass="max-w-4xl"
      >
        <div className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <TextField
                requiredField
                inputLabel="Warning title"
                inputPlaceholder="E.g. Flood watch update"
                returnFieldValue={setTitle}
                hasError={formErrors.title}
                maxLength={80}
              />

              <TextareaField
                requiredField
                inputLabel="Warning message"
                inputPlaceholder="Write a short public warning message (max 160 characters)"
                returnFieldValue={setMessage}
                hasError={formErrors.message}
                maxLength={160}
                preloadValue=""
              />

              <p className="text-xs text-stone-500 dark:text-stone-400">{message.length}/160 characters</p>

              <div className="w-full mt-4">
                <AutocompleteSelect
                  selectOptions={REGION_OPTIONS}
                  inputLabel="Select region"
                  placeholderText="Search and select a region"
                  titleField="name"
                  returnFieldValue={setSelectedRegionOption}
                  hasError={false}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addSelectedRegion}
                  className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
                >
                  Add region
                </button>
                {formErrors.regions && <p className="text-xs text-red-500">{formErrors.regions}</p>}
              </div>

              {selectedRegions.length > 0 && (
                <div className="flex flex-wrap gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-900/20">
                  {selectedRegions.map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => removeRegion(region)}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-100 dark:bg-stone-950 dark:text-stone-200 dark:hover:bg-stone-900"
                    >
                      {region} x
                    </button>
                  ))}
                </div>
              )}

              <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-900/20">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-medium text-stone-600 dark:text-stone-300">Estimated audience reach</p>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{audienceReach.toLocaleString()}</p>
                </div>

                {isIdentifyingAudience && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-stone-500 dark:text-stone-400 pb-2">Identifying audience...</p>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                      <div
                        className="h-full rounded-full bg-emerald transition-all duration-100"
                        style={{ width: `${audienceProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">Delivery channels</p>
                <div className="grid gap-2 sm:grid-cols-2 pt-4">
                  {DELIVERY_CHANNELS.map((channel) => (
                    <Checkbox
                      key={channel}
                      CheckboxLabel={channel}
                      isChecked={selectedChannels.includes(channel)}
                      checkboxToggleFunction={() => toggleChannel(channel)}
                      hasError={Boolean(formErrors.channels)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <RadioGroup
                items={WARNING_TYPES}
                inputLabel="Warning type"
                requiredField
                returnSelected={onSelectWarningType}
                hasError={formErrors.type}
              />

              {isUploadType && (
                <div>
                  <FileUpload
                    fieldLabel="Upload image or supporting file"
                    acceptedFormats={['jpg', 'jpeg', 'png', 'pdf']}
                    maxFileSize={10}
                    hasError={Boolean(formErrors.attachment)}
                    returnFileDetails={({ file }) => {
                      setSelectedAttachment(file)
                      setFormErrors((current) => ({ ...current, attachment: '' }))
                    }}
                  />
                  {formErrors.attachment && <p className="-mt-2 text-xs text-red-500">{formErrors.attachment}</p>}
                  {selectedType?.label === 'Crime Watch' && (
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Optional: add suspect image or bulletin document.</p>
                  )}
                </div>
              )}

              
            </div>
          </div>

          {formErrors.channels && <p className="mt-2 text-xs text-red-500">{formErrors.channels}</p>}

          <div className="pt-2">
            <FormButton
              buttonLabel="Send warning"
              buttonAction={createWarning}
              processing={processing}
              disabled={processing}
            />
          </div>
        </div>
      </ModalDialog>
    </section>
  )
}

export default PublicWarnings
