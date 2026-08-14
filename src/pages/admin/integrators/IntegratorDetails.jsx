import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AudioIcon from '../../../components/elements/icons/AudioIcon'
import CameraIcon from '../../../components/elements/icons/CameraIcon'
import PhotoIcon from '../../../components/elements/icons/PhotoIcon'
import { getIntegratorById } from './integratorData'

const IntegratorDetails = () => {
  const { integratorId } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [incidentSearchTerm, setIncidentSearchTerm] = useState('')
  const [incidentStatusFilter, setIncidentStatusFilter] = useState('All statuses')
  const [assetSearchTerm, setAssetSearchTerm] = useState('')
  const [assetStatusFilter, setAssetStatusFilter] = useState('All statuses')
  const [assetTypeFilter, setAssetTypeFilter] = useState('All asset types')

  const integrator = useMemo(() => getIntegratorById(integratorId), [integratorId])

  const formatDate = (value, includeTime = false) => {
    if (!value) {
      return 'N/A'
    }

    return new Intl.DateTimeFormat('en-NG', includeTime
      ? {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      : {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(new Date(value))
  }

  const statusTone = {
    Operational: 'bg-emerald/15 text-emerald',
    Limited: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Pilot: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  }

  const incidentTone = {
    Resolved: 'bg-emerald/15 text-emerald',
    Ongoing: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Escalated: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
  }

  const severityTone = {
    Low: 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200',
    Moderate: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    High: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    Critical: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  }

  const assetTone = {
    Active: 'bg-emerald/15 text-emerald',
    Standby: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
    'Under Maintenance': 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Decommissioned: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
    Deployed: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'incidents', label: 'Incidents' },
    { id: 'assets', label: 'Assets' },
  ]

  const filteredIncidents = useMemo(() => {
    if (!integrator) {
      return []
    }

    const normalizedSearch = incidentSearchTerm.trim().toLowerCase()

    return integrator.incidents.filter((incident) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          incident.id,
          incident.title,
          incident.location,
          incident.reporter,
          incident.responseLead,
          incident.summary,
          incident.escalatedTo,
        ].some((value) => `${value}`.toLowerCase().includes(normalizedSearch))

      const matchesStatus = incidentStatusFilter === 'All statuses' || incident.status === incidentStatusFilter
      return matchesSearch && matchesStatus
    })
  }, [incidentSearchTerm, incidentStatusFilter, integrator])

  const filteredAssets = useMemo(() => {
    if (!integrator) {
      return []
    }

    const normalizedSearch = assetSearchTerm.trim().toLowerCase()

    return integrator.assets.filter((asset) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          asset.id,
          asset.name,
          asset.type,
          asset.brand,
          asset.model,
          asset.serialNumber,
          asset.currentLocation,
          asset.zone,
          asset.status,
        ].some((value) => `${value}`.toLowerCase().includes(normalizedSearch))

      const matchesStatus = assetStatusFilter === 'All statuses' || asset.status === assetStatusFilter
      const matchesType = assetTypeFilter === 'All asset types' || asset.type === assetTypeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [assetSearchTerm, assetStatusFilter, assetTypeFilter, integrator])

  const assetTypes = useMemo(() => {
    if (!integrator) {
      return ['All asset types']
    }

    return ['All asset types', ...new Set(integrator.assets.map((asset) => asset.type))]
  }, [integrator])

  return (
    !integrator ? (
      <section className="space-y-4 rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Integrator not found</p>
        <p className="text-sm text-stone-600 dark:text-stone-300">The selected integrator record could not be resolved.</p>
        <Link to="/admin/integrators" className="inline-flex rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald/90 dark:bg-light-green dark:text-stone-900">
          Back to integrators
        </Link>
      </section>
    ) : (
      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">Integrator Details</p>
            <h1 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">{integrator.name}</h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              {integrator.category} in {integrator.city}, {integrator.state} with incident coordination, asset visibility, and escalation tracking.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* <Link
              to="/admin/integrators"
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
            >
              Back to integrators
            </Link> */}
            <span className={`inline-flex items-center rounded-full px-3 py-2 text-sm font-semibold ${statusTone[integrator.status]}`}>
              {integrator.status}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">Integrator ID</p>
            <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">{integrator.id}</h3>
          </article>
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">Protected sites</p>
            <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">{integrator.protectedSites}</h3>
          </article>
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">Response teams</p>
            <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">{integrator.responseTeams}</h3>
          </article>
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">Incident load</p>
            <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">{integrator.ongoingIncidents} ongoing</h3>
          </article>
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <p className="text-xs text-stone-500 dark:text-stone-400">Tracked assets</p>
            <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">{integrator.assetCount}</h3>
          </article>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald text-stone-800 dark:bg-light-green dark:text-stone-900'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800/50 dark:text-stone-200 dark:hover:bg-stone-700/50'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Organisation profile</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Headquarters</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{integrator.headquarters}</p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Sector</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{integrator.sector}</p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20 sm:col-span-2">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Coverage</p>
                    <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">{integrator.serviceCoverage}</p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Onboarded</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{formatDate(integrator.onboardedAt)}</p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Last sync</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{formatDate(integrator.lastSyncAt, true)}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Operations and escalation</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Primary partner agency</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{integrator.partnerAgency}</p>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Fallback: {integrator.escalationBackup}</p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Control desk</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{integrator.primaryContactDesk}</p>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Monitoring window: {integrator.monitoringHours}</p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Service levels</p>
                    <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">Ack: {integrator.serviceLevelAgreement.acknowledgement}</p>
                    <p className="text-sm text-stone-700 dark:text-stone-300">Dispatch: {integrator.serviceLevelAgreement.dispatch}</p>
                    <p className="text-sm text-stone-700 dark:text-stone-300">Reporting: {integrator.serviceLevelAgreement.reportingCycle}</p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Platform health</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{integrator.apiHealth}</p>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Tenant code: {integrator.tenantCode}</p>
                  </div>
                </div>
              </article>
            </div>

            <div className="space-y-4">
              <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Administrator</h2>
                <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700/60 dark:bg-stone-900/20">
                  <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">{integrator.administrator.name}</p>
                  <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{integrator.administrator.title}</p>
                  <div className="mt-4 space-y-2 text-sm text-stone-700 dark:text-stone-300">
                    <p>Email: {integrator.administrator.email}</p>
                    <p>Primary phone: {integrator.administrator.phone}</p>
                    <p>Alternate phone: {integrator.administrator.alternatePhone}</p>
                    <p>Years leading outfit: {integrator.administrator.yearsLeading}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Scale snapshot</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Staff strength</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{integrator.staffStrength}</p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Guards on roster</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{integrator.guardsOnRoster}</p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Connected users</p>
                    <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{integrator.connectedResidents.toLocaleString('en-NG')}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Service lines</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {integrator.serviceLines.map((line) => (
                      <span key={line} className="rounded-full bg-emerald/10 px-2 py-1 text-xs font-medium text-emerald dark:text-light-green">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Compliance</p>
                  <div className="mt-2 space-y-2">
                    {integrator.compliance.map((item) => (
                      <p key={item} className="text-sm text-stone-700 dark:text-stone-300">{item}</p>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Incident register</h2>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Resolved, ongoing, and escalated incidents recorded for this outfit. Escalated rows show the agency handling the next response layer.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-emerald/10 px-3 py-1 font-semibold text-emerald dark:text-light-green">{integrator.resolvedIncidents} resolved</span>
                <span className="rounded-full bg-amber-500/10 px-3 py-1 font-semibold text-amber-700 dark:text-amber-300">{integrator.ongoingIncidents} ongoing</span>
                <span className="rounded-full bg-rose-500/10 px-3 py-1 font-semibold text-rose-700 dark:text-rose-300">{integrator.escalatedIncidents} escalated</span>
              </div>
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-[1.5fr_1fr]">
              <label>
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Search incidents</span>
                <input
                  type="search"
                  value={incidentSearchTerm}
                  onChange={(event) => setIncidentSearchTerm(event.target.value)}
                  placeholder="Search by title, location, reporter, or escalation agency..."
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
                />
              </label>

              <label>
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Status</span>
                <select
                  value={incidentStatusFilter}
                  onChange={(event) => setIncidentStatusFilter(event.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
                >
                  {['All statuses', 'Resolved', 'Ongoing', 'Escalated'].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                    <th className="px-2 py-2">Incident</th>
                    <th className="px-2 py-2">Reported</th>
                    <th className="px-2 py-2">Severity</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Escalation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncidents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-2 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                        No incidents match the current search and filters.
                      </td>
                    </tr>
                  )}

                  {filteredIncidents.map((incident) => (
                    <tr key={incident.id} className="border-b border-stone-100 align-top transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20">
                      <td className="px-2 py-3">
                        <p className="font-medium text-stone-900 dark:text-stone-100">{incident.title}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{incident.id} • {incident.location}</p>
                        <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">{incident.summary}</p>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Reporter: {incident.reporter} • Lead: {incident.responseLead}</p>
                      </td>
                      <td className="px-2 py-3 text-stone-700 dark:text-stone-200">
                        <p>{formatDate(incident.reportedAt, true)}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">Response window: {incident.responseWindow}</p>
                      </td>
                      <td className="px-2 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${severityTone[incident.severity]}`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${incidentTone[incident.status]}`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-stone-700 dark:text-stone-200">
                        {incident.status === 'Escalated' ? (
                          <div>
                            <p className="font-medium text-stone-900 dark:text-stone-100">{incident.escalatedTo}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400">Escalated externally</p>
                          </div>
                        ) : (
                          <span className="text-xs text-stone-500 dark:text-stone-400">Handled in-house</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        )}

        {activeTab === 'assets' && (
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Outfit assets</h2>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Asset registry for the integrator, following the same surveillance and IoT list style used in the AEGIS asset screens.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-emerald/10 px-3 py-1 font-semibold text-emerald dark:text-light-green">{integrator.assets.filter((asset) => asset.status === 'Active').length} active</span>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 font-semibold text-sky-700 dark:text-sky-300">{integrator.assets.filter((asset) => asset.status === 'Deployed').length} deployed</span>
                <span className="rounded-full bg-amber-500/10 px-3 py-1 font-semibold text-amber-700 dark:text-amber-300">{integrator.assets.filter((asset) => asset.status === 'Under Maintenance').length} under maintenance</span>
              </div>
            </div>

            <div className="mb-6 grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr]">
              <label>
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Search assets</span>
                <input
                  type="search"
                  value={assetSearchTerm}
                  onChange={(event) => setAssetSearchTerm(event.target.value)}
                  placeholder="Search by id, type, model, location..."
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
                />
              </label>

              <label>
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Asset type</span>
                <select
                  value={assetTypeFilter}
                  onChange={(event) => setAssetTypeFilter(event.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
                >
                  {assetTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">Status</span>
                <select
                  value={assetStatusFilter}
                  onChange={(event) => setAssetStatusFilter(event.target.value)}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-emerald dark:border-stone-800 dark:bg-stone-950 dark:text-stone-100"
                >
                  {['All statuses', 'Active', 'Deployed', 'Standby', 'Under Maintenance', 'Decommissioned'].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                    <th className="px-2 py-2">Asset</th>
                    <th className="px-2 py-2">Type</th>
                    <th className="px-2 py-2">Location</th>
                    <th className="px-2 py-2">Service dates</th>
                    <th className="px-2 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-2 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                        No assets match the current search and filters.
                      </td>
                    </tr>
                  )}

                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20">
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="font-medium text-stone-900 dark:text-stone-100">{asset.name}</p>
                          {asset.soundEnabled && (
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
                          {asset.cameraEnabled && (
                            <span title="Still capture enabled" className="inline-flex rounded-full bg-emerald/15 p-1 text-emerald dark:text-light-green">
                              <PhotoIcon className="h-3.5 w-3.5" />
                              <span className="sr-only">Still capture enabled</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{asset.id} • {asset.serialNumber}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{asset.brand} • {asset.model}</p>
                      </td>
                      <td className="px-2 py-3 text-stone-700 dark:text-stone-200">
                        <p>{asset.type}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">Zone: {asset.zone}</p>
                      </td>
                      <td className="px-2 py-3 text-stone-700 dark:text-stone-200">
                        <p>{asset.currentLocation}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">IP: {asset.ipAddress}</p>
                      </td>
                      <td className="px-2 py-3 text-stone-700 dark:text-stone-200">
                        <p>Installed: {formatDate(asset.installedDate)}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">Serviced: {formatDate(asset.lastServiceDate)}</p>
                      </td>
                      <td className="px-2 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${assetTone[asset.status] || assetTone.Active}`}>
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        )}
      </section>
    )
  )
}

export default IntegratorDetails