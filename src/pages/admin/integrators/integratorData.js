import {
  BRANDS,
  LOCATIONS,
  TYPE_PROFILES,
  createSeedAssets,
} from '../aegis-assets/aegisAssetData'

const INTEGRATOR_PROFILES = [
  {
    name: 'Halcyon Estates Security',
    category: 'Residential Estate',
    sector: 'Private Estate Management',
    state: 'Lagos',
    city: 'Lekki',
    headquarters: 'Admiralty Way, Lekki Phase 1',
    serviceCoverage: 'Three gated estates and two waterfront access corridors',
    administratorTitle: 'Managing Director',
    staffStrength: 148,
    guardsOnRoster: 104,
    responseTeams: 6,
    protectedSites: 5,
    connectedResidents: 1860,
    monitoringHours: '24/7',
    partnerAgency: 'Nigeria Police Force',
    escalationBackup: 'Lagos State Emergency Management Agency',
    primaryContactDesk: 'Estate Command and Call Desk',
    serviceLines: ['Access control', 'Perimeter surveillance', 'Resident panic response', 'Visitor screening'],
  },
  {
    name: 'Sentinel Crest University Safety Corps',
    category: 'University Campus',
    sector: 'Education',
    state: 'Ogun',
    city: 'Ifo',
    headquarters: 'Campus Security Directorate, Main Senate Road',
    serviceCoverage: 'Main campus, teaching hospital annex, student hostels, and sports complex',
    administratorTitle: 'Director of Security',
    staffStrength: 214,
    guardsOnRoster: 162,
    responseTeams: 9,
    protectedSites: 11,
    connectedResidents: 14200,
    monitoringHours: '24/7',
    partnerAgency: 'Nigeria Security and Civil Defence Corps',
    escalationBackup: 'Fire Service Command',
    primaryContactDesk: 'Campus Control Room',
    serviceLines: ['Campus patrol', 'Student escort response', 'Dormitory monitoring', 'Event crowd management'],
  },
  {
    name: 'Praetorian Industrial Risk Services',
    category: 'Industrial Park',
    sector: 'Manufacturing and Logistics',
    state: 'Rivers',
    city: 'Port Harcourt',
    headquarters: 'Trans Amadi Industrial Layout',
    serviceCoverage: 'Four warehouses, truck yard, loading corridor, and process control blocks',
    administratorTitle: 'Operations Administrator',
    staffStrength: 173,
    guardsOnRoster: 128,
    responseTeams: 7,
    protectedSites: 8,
    connectedResidents: 3200,
    monitoringHours: '24/7',
    partnerAgency: 'Department of State Services',
    escalationBackup: 'Nigeria Police Force',
    primaryContactDesk: 'Industrial Security Operations Center',
    serviceLines: ['Warehouse monitoring', 'Cargo escort', 'Industrial alarm response', 'Shift handover auditing'],
  },
  {
    name: 'Meridian Care Hospital Protection Unit',
    category: 'Hospital Network',
    sector: 'Healthcare',
    state: 'FCT',
    city: 'Abuja',
    headquarters: 'Maitama Specialist Care District',
    serviceCoverage: 'Three hospitals, emergency triage gate, labs, and pharmacy depots',
    administratorTitle: 'Chief Administrator',
    staffStrength: 132,
    guardsOnRoster: 86,
    responseTeams: 5,
    protectedSites: 6,
    connectedResidents: 5400,
    monitoringHours: '24/7',
    partnerAgency: 'National Emergency Management Agency',
    escalationBackup: 'Fire Service Command',
    primaryContactDesk: 'Medical Security Coordination Desk',
    serviceLines: ['Emergency department support', 'Ambulance bay control', 'Pharmacy vault monitoring', 'Visitor screening'],
  },
  {
    name: 'Bridgepoint Retail Security Collective',
    category: 'Commercial District',
    sector: 'Retail and Leisure',
    state: 'Kano',
    city: 'Kano Municipal',
    headquarters: 'City Mall Operations Plaza',
    serviceCoverage: 'Retail mall, cinema wing, cash handling corridor, and parking decks',
    administratorTitle: 'General Administrator',
    staffStrength: 119,
    guardsOnRoster: 82,
    responseTeams: 4,
    protectedSites: 4,
    connectedResidents: 6900,
    monitoringHours: '20/7',
    partnerAgency: 'State Traffic Management Authority',
    escalationBackup: 'Nigeria Police Force',
    primaryContactDesk: 'Mall Command Desk',
    serviceLines: ['Crowd flow monitoring', 'Storefront alarm response', 'Cash movement escort', 'Parking surveillance'],
  },
  {
    name: 'CedarShield Faith and Community Watch',
    category: 'Community and Worship',
    sector: 'Faith-based Organisation',
    state: 'Kaduna',
    city: 'Kaduna North',
    headquarters: 'Mission Avenue Community Centre',
    serviceCoverage: 'Worship auditorium, schools, residences, and community clinic grounds',
    administratorTitle: 'Executive Administrator',
    staffStrength: 96,
    guardsOnRoster: 71,
    responseTeams: 4,
    protectedSites: 7,
    connectedResidents: 4800,
    monitoringHours: '18/7',
    partnerAgency: 'Nigeria Security and Civil Defence Corps',
    escalationBackup: 'Nigeria Police Force',
    primaryContactDesk: 'Community Watch Operations Room',
    serviceLines: ['Event security', 'School gate screening', 'Community patrol', 'Medical incident escalation'],
  },
]

const ADMIN_FIRST_NAMES = ['Amina', 'Tunde', 'Chidinma', 'Ibrahim', 'Zainab', 'Kelechi', 'Ngozi', 'Samuel', 'Hadiza', 'Emeka', 'Yusuf', 'Bolanle']
const ADMIN_LAST_NAMES = ['Okafor', 'Bello', 'Adewale', 'Musa', 'Eze', 'Balogun', 'Iheanacho', 'Abubakar', 'Udo', 'Nwosu', 'Lawal', 'Onyema']
const INCIDENT_TYPES = ['Burglary Alert', 'Medical Distress', 'Perimeter Breach', 'Suspicious Activity', 'Fire Alarm', 'Crowd Control']
const INCIDENT_STATUSES = ['Resolved', 'Ongoing', 'Escalated']
const INCIDENT_SEVERITIES = ['Low', 'Moderate', 'High', 'Critical']
const INTEGRATOR_STATUSES = ['Operational', 'Limited', 'Pilot']

const formatIntegratorId = (index) => `INT-${(index + 1).toString().padStart(3, '0')}`

const buildAdministrator = (index, integrator) => {
  const fullName = `${ADMIN_FIRST_NAMES[index % ADMIN_FIRST_NAMES.length]} ${ADMIN_LAST_NAMES[(index * 3) % ADMIN_LAST_NAMES.length]}`
  const normalizedName = fullName.toLowerCase().replace(/\s+/g, '.')

  return {
    name: fullName,
    title: integrator.administratorTitle,
    email: `${normalizedName}.${index + 1}@${integrator.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.demo`,
    phone: `080${(31000000 + (index * 263)).toString().slice(0, 8)}`,
    alternatePhone: `070${(41000000 + (index * 157)).toString().slice(0, 8)}`,
    yearsLeading: 3 + (index % 8),
  }
}

const buildAssets = (integrator, index) => {
  const seedAssets = createSeedAssets()
  const assetCount = 10 + (index % 5) * 2
  const startIndex = index * 7

  return Array.from({ length: assetCount }, (_, assetIndex) => {
    const baseAsset = seedAssets[(startIndex + assetIndex) % seedAssets.length]
    const location = LOCATIONS[(startIndex + assetIndex) % LOCATIONS.length]
    const profile = TYPE_PROFILES[baseAsset.type] || {}

    return {
      id: `${formatIntegratorId(index)}-AST-${(assetIndex + 1).toString().padStart(3, '0')}`,
      name: `${integrator.category.split(' ')[0]} ${baseAsset.type}`,
      type: baseAsset.type,
      brand: baseAsset.brand || BRANDS[(startIndex + assetIndex) % BRANDS.length],
      model: baseAsset.model,
      serialNumber: `${formatIntegratorId(index)}-${(8400 + assetIndex * 17).toString()}`,
      location: `${integrator.city} ${location.name}`,
      currentLocation: `${integrator.city} ${location.name}`,
      zone: `Zone ${(assetIndex % 4) + 1}`,
      status: baseAsset.status,
      firmwareVersion: baseAsset.firmwareVersion,
      ipAddress: `10.${index + 31}.${assetIndex + 12}.${(assetIndex * 11) % 254 || 1}`,
      installedDate: baseAsset.installedDate,
      lastServiceDate: baseAsset.lastServiceDate,
      cameraEnabled: baseAsset.cameraEnabled ?? profile.cameraEnabled ?? false,
      soundEnabled: baseAsset.soundEnabled ?? profile.soundEnabled ?? false,
      videoEnabled: baseAsset.videoEnabled ?? profile.videoEnabled ?? false,
    }
  })
}

const buildIncidents = (integrator, index) => {
  return Array.from({ length: 7 + (index % 4) }, (_, incidentIndex) => {
    const status = INCIDENT_STATUSES[(incidentIndex + index) % INCIDENT_STATUSES.length]
    const reportedAt = new Date(2026, (index + incidentIndex) % 7, ((incidentIndex + 3) * 3) % 28 + 1, 8 + (incidentIndex % 8), 10 + ((incidentIndex * 7) % 40))

    return {
      id: `${formatIntegratorId(index)}-INC-${(incidentIndex + 1).toString().padStart(3, '0')}`,
      title: INCIDENT_TYPES[(incidentIndex + index) % INCIDENT_TYPES.length],
      status,
      severity: INCIDENT_SEVERITIES[(incidentIndex + index) % INCIDENT_SEVERITIES.length],
      location: `${integrator.city} ${['North Gate', 'Main Quad', 'Warehouse Row', 'Control Annex', 'East Fence', 'Parking Deck'][incidentIndex % 6]}`,
      reportedAt: reportedAt.toISOString(),
      reporter: ['Control room operator', 'Resident hotline', 'Supervisor patrol', 'Automated sensor'][incidentIndex % 4],
      responseLead: ['Shift Lead', 'Patrol Alpha', 'Control Analyst', 'Rapid Response Unit'][incidentIndex % 4],
      responseWindow: `${8 + ((incidentIndex + index) % 15)} mins`,
      summary: `${integrator.name} logged this incident through the smaller-scale tenant workflow for rapid coordination and event tracking.`,
      escalatedTo: status === 'Escalated'
        ? (incidentIndex % 2 === 0 ? integrator.partnerAgency : integrator.escalationBackup)
        : '',
    }
  })
}

export const createSeedIntegrators = () => {
  return INTEGRATOR_PROFILES.map((profile, index) => {
    const id = formatIntegratorId(index)
    const administrator = buildAdministrator(index, profile)
    const assets = buildAssets(profile, index)
    const incidents = buildIncidents(profile, index)
    const ongoingIncidents = incidents.filter((incident) => incident.status === 'Ongoing').length
    const escalatedIncidents = incidents.filter((incident) => incident.status === 'Escalated').length
    const resolvedIncidents = incidents.filter((incident) => incident.status === 'Resolved').length
    const status = INTEGRATOR_STATUSES[index % INTEGRATOR_STATUSES.length]
    const startDate = new Date(2021 + (index % 4), (index * 2) % 12, ((index + 5) * 2) % 28 + 1)

    return {
      id,
      ...profile,
      status,
      tenantCode: `${profile.name.split(' ').map((part) => part.slice(0, 2).toUpperCase()).join('')}-${index + 11}`,
      foundedAt: new Date(2016 + (index % 6), (index * 3) % 12, ((index + 2) * 4) % 28 + 1).toISOString(),
      onboardedAt: startDate.toISOString(),
      lastSyncAt: new Date(2026, 7, 4, 8 + index, 12 + index * 3).toISOString(),
      apiHealth: ['Healthy', 'Degraded', 'Healthy', 'Healthy', 'Healthy', 'Monitoring'][index % 6],
      assets,
      incidents,
      assetCount: assets.length,
      ongoingIncidents,
      escalatedIncidents,
      resolvedIncidents,
      serviceLevelAgreement: {
        acknowledgement: `${2 + (index % 4)} mins`,
        dispatch: `${7 + (index % 6)} mins`,
        reportingCycle: ['15 mins', '30 mins', 'Hourly'][index % 3],
      },
      compliance: [
        'Incident logging enabled',
        'Administrator verified',
        'Escalation tree mapped',
        index % 2 === 0 ? 'Asset telemetry active' : 'Asset telemetry partial',
      ],
      administrator,
    }
  })
}

export const getIntegratorById = (integratorId) => {
  return createSeedIntegrators().find((integrator) => integrator.id === integratorId) || null
}
