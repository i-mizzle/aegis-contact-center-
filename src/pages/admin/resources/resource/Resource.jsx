import React, { useMemo } from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'

const Resource = () => {
  const { resourceId } = useParams()
  const location = useLocation()

  const resource = useMemo(() => {
    const agencies = [
      'Federal Road Safety Corps',
      'Nigeria Police Force',
      'Department of State Services',
      'National Emergency Management Agency',
      'Nigeria Security and Civil Defence Corps',
      'Lagos State Emergency Management Agency',
      'Fire Service Command',
      'State Traffic Management Authority',
    ]

    const resourceTypes = ['Office', 'Command Post', 'Outstation', 'Checkpoint', 'Response Hub']
    const locations = [
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

    const statuses = ['Operational', 'Limited', 'Under Maintenance']
    const adminFirstNames = ['Amina', 'Tunde', 'Chidinma', 'Ibrahim', 'Zainab', 'Kelechi', 'Ngozi', 'Samuel', 'Hadiza', 'Emeka', 'Yusuf', 'Bolanle']
    const adminLastNames = ['Okafor', 'Bello', 'Adewale', 'Musa', 'Eze', 'Balogun', 'Iheanacho', 'Abubakar', 'Udo', 'Nwosu', 'Lawal', 'Onyema']

    const numericId = Number(`${resourceId || ''}`.replace(/\D/g, '')) || 1
    const index = Math.max(0, numericId - 1)
    const agency = agencies[index % agencies.length]
    const resourceType = resourceTypes[index % resourceTypes.length]
    const locationData = locations[index % locations.length]
    const status = statuses[index % statuses.length]
    const adminName = `${adminFirstNames[index % adminFirstNames.length]} ${adminLastNames[(index * 3) % adminLastNames.length]}`
    const normalizedAdminName = adminName.toLowerCase().replace(/\s+/g, '.')

    return {
      id: `RSC-${numericId.toString().padStart(4, '0')}`,
      agency,
      resourceType,
      name: `${agency.split(' ').slice(0, 2).join(' ')} ${resourceType} ${numericId}`,
      city: locationData.city,
      state: locationData.state,
      status,
      personnelCount: 18 + ((index * 7) % 95),
      vehicleAssets: (index % 6) + 1,
      commAssets: 4 + ((index * 3) % 18),
      totalAssets: ((index % 6) + 1) + (4 + ((index * 3) % 18)) + (index % 5),
      establishedAt: new Date(2021 + (index % 4), (index * 2) % 12, ((index * 3) % 27) + 1),
      administrator: {
        name: adminName,
        email: `${normalizedAdminName}.${numericId}@aegis-demo.org`,
        phone: `080${(31000000 + (index * 197)).toString().slice(0, 8)}`,
      },
    }
  }, [resourceId])

  const statusTone = {
    Operational: 'bg-emerald/15 text-emerald',
    Limited: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    'Under Maintenance': 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
  }

  const tabs = [
    { label: 'Resource Personnel', path: `/admin/resources-assets/resources/${resource.id}/personnel` },
    { label: 'Resource Assets', path: `/admin/resources-assets/resources/${resource.id}/assets` },
  ]

  const formatDate = (value) => new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value)

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">Resource Details</p>
          <h1 className="mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-100">{resource.name}</h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{resource.city}, {resource.state} • {resource.agency}</p>
        </div>

        {/* <Link
          to="/admin/resources-assets/resources"
          className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
        >
          Back to resources
        </Link> */}
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
            <p className="text-xs text-stone-500 dark:text-stone-400">Resource ID</p>
            <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{resource.id}</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
            <p className="text-xs text-stone-500 dark:text-stone-400">Resource type</p>
            <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{resource.resourceType}</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
            <p className="text-xs text-stone-500 dark:text-stone-400">Assigned personnel</p>
            <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{resource.personnelCount.toLocaleString('en-NG')}</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
            <p className="text-xs text-stone-500 dark:text-stone-400">Tracked assets</p>
            <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{resource.totalAssets.toLocaleString('en-NG')}</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
            <p className="text-xs text-stone-500 dark:text-stone-400">Status</p>
            <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[resource.status]}`}>
              {resource.status}
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
            <p className="text-xs text-stone-500 dark:text-stone-400">Resource administrator</p>
            <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{resource.administrator.name}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">{resource.administrator.email}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">{resource.administrator.phone}</p>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/60 dark:bg-stone-900/20">
            <p className="text-xs text-stone-500 dark:text-stone-400">Operations overview</p>
            <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">Vehicles: {resource.vehicleAssets} • Comms equipment: {resource.commAssets}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Established: {formatDate(resource.establishedAt)}</p>
          </div>
        </div>
      </article>

      <div className="rounded-lg border p-3 dark:border-stone-800">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald text-stone-800 dark:bg-light-green dark:text-stone-900!'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800/50 dark:text-stone-800 dark:hover:bg-stone-700/50'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>

      <Outlet />
    </section>
  )
}

export default Resource