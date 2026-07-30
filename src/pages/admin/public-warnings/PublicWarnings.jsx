import React, { useMemo, useState } from 'react'
import ModalDialog from '../../../components/layouts/ModalDialog'
import TextField from '../../../components/elements/form/TextField'
import TextareaField from '../../../components/elements/form/TextareaField'
import AutocompleteSelect from '../../../components/elements/form/AutocompleteSelect'
import Checkbox from '../../../components/elements/form/Checkbox'
import FormButton from '../../../components/elements/form/FormButton'

const DELIVERY_CHANNELS = ['SMS', 'Email', 'App push', 'Social media']

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

const buildSeedWarnings = () => {
  return [
    {
      id: 'WARN-0001',
      title: 'Flood Watch Update',
      body: 'Heavy rainfall expected from 6PM. Move valuables to higher ground and avoid river channels.',
      deliveredTo: 12490,
      regions: ['Lagos Mainland', 'Lagos Island', 'Port Harcourt'],
      channels: ['SMS', 'App push', 'Social media'],
      sentAt: new Date('2026-07-29T18:05:00'),
      resendCount: 0,
    },
    {
      id: 'WARN-0002',
      title: 'Heat Advisory',
      body: 'Daytime temperatures are high. Stay hydrated, reduce outdoor activity between 12PM and 3PM.',
      deliveredTo: 8620,
      regions: ['Abuja Municipal', 'Wuse', 'Kubwa'],
      channels: ['SMS', 'Email'],
      sentAt: new Date('2026-07-28T11:20:00'),
      resendCount: 1,
    },
    {
      id: 'WARN-0003',
      title: 'Road Closure Notice',
      body: 'Emergency repairs are ongoing on Ring Road. Use approved diversions until 8PM today.',
      deliveredTo: 5375,
      regions: ['Ibadan North', 'Benin City'],
      channels: ['SMS', 'App push'],
      sentAt: new Date('2026-07-27T08:40:00'),
      resendCount: 2,
    },
    {
      id: 'WARN-0004',
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
  const [message, setMessage] = useState('')
  const [selectedRegionOption, setSelectedRegionOption] = useState(null)
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedChannels, setSelectedChannels] = useState([])
  const [processing, setProcessing] = useState(false)

  const [formErrors, setFormErrors] = useState({
    title: '',
    message: '',
    regions: '',
    channels: '',
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
  }

  const removeRegion = (region) => {
    setSelectedRegions((current) => current.filter((item) => item !== region))
  }

  const resetCreateWarningForm = () => {
    setTitle('')
    setMessage('')
    setSelectedRegionOption(null)
    setSelectedRegions([])
    setSelectedChannels([])
    setFormErrors({
      title: '',
      message: '',
      regions: '',
      channels: '',
    })
  }

  const closeCreateModal = () => {
    setShowCreateModal(false)
    resetCreateWarningForm()
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
      message: message.trim() ? '' : 'Message is required',
      regions: selectedRegions.length > 0 ? '' : 'Select at least one region',
      channels: selectedChannels.length > 0 ? '' : 'Select at least one channel',
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
      title: title.trim(),
      body: message.trim(),
      deliveredTo: generatedDeliveredTo,
      regions: selectedRegions,
      channels: selectedChannels,
      sentAt: new Date(),
      resendCount: 0,
    }

    setWarnings((current) => [newWarning, ...current])
    setProcessing(false)
    closeCreateModal()
  }

  return (
    <section className="space-y-5">
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
            className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald/90"
          >
            Create new warning
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Warning</th>
                <th className="px-2 py-2">Delivered to</th>
                <th className="px-2 py-2">Regions</th>
                <th className="px-2 py-2">Channels</th>
                <th className="px-2 py-2">Last sent</th>
                <th className="px-2 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {warnings.map((warning) => (
                <tr key={warning.id} className="border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-900/20">
                  <td className="px-2 py-3 align-top">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{warning.title}</p>
                    <p className="mt-1 max-w-md text-xs leading-5 text-stone-500 dark:text-stone-400">{warning.body}</p>
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
        </div>
      </article>

      <ModalDialog
        shown={showCreateModal}
        closeFunction={closeCreateModal}
        dialogTitle="Create and send public warning"
        maxWidthClass="max-w-xl"
      >
        <div className="space-y-4">
          <div className="grid gap-4">
            <TextField
              requiredField
              inputLabel="Warning title"
              inputPlaceholder="E.g. Flood watch update"
              returnFieldValue={setTitle}
              hasError={formErrors.title}
              maxLength={80}
            />
          </div>


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
            {formErrors.channels && <p className="mt-2 text-xs text-red-500">{formErrors.channels}</p>}
          </div>

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