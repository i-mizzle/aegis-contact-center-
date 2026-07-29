import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../../../context/ThemeContext'
import PlusIcon from '../../../components/elements/icons/PlusIcon';
import {
  buildFallbackRoutePath,
  fetchRoadRoute,
  getPathPointAndNextIndex,
} from '../../../utils/roadRoutes'
import ModalDialog from '../../../components/layouts/ModalDialog'
import RecordNewIncident from '../../../components/elements/workflow/incidents/RecordNewIncident';

const baseIncidents = [
  {
    id: 'inc-abuja-001',
    title: 'Armed Robbery in Progress',
    address: 'Aminu Kano Crescent, Wuse 2, Abuja',
    coordinates: [9.08457, 7.46644],
    description: 'Two masked suspects reported with firearms near a pharmacy. Civilians sheltering inside nearby stores.',
    reportedBy: {
      name: 'Aisha Sule',
      phoneNumber: '+234 803 442 1199',
    },
    emergencyContact: '+234 803 442 1199',
    type: 'robbery',
    status: 'active',
    severity: 'critical',
    reportedAt: '2026-07-19T09:12:00Z',
    callPriority: 'P1',
    unitsAssigned: ['Police Unit P-14', 'Police Unit P-21'],
  },
  {
    id: 'inc-abuja-002',
    title: 'Residential Fire Outbreak',
    address: '3rd Avenue, Gwarinpa, Abuja',
    coordinates: [9.07678, 7.39897],
    description: 'Kitchen fire has spread to upper floor. Family evacuated. Smoke visible from neighboring blocks.',
    reportedBy: {
      name: 'Chukwuemeka Okafor',
      phoneNumber: '+234 812 991 4450',
    },
    emergencyContact: '+234 812 991 4450',
    type: 'fire',
    status: 'active',
    severity: 'high',
    reportedAt: '2026-07-19T08:55:00Z',
    callPriority: 'P1',
    unitsAssigned: ['Fire Service F-06', 'Ambulance A-09'],
  },
  {
    id: 'inc-abuja-003',
    title: 'Vehicle Theft Complaint',
    address: 'Jabi Lake Mall Car Park, Abuja',
    coordinates: [9.07284, 7.42969],
    description: 'Black Toyota Corolla missing from lower deck parking. CCTV request submitted to security desk.',
    reportedBy: {
      name: 'Musa Danjuma',
      phoneNumber: '+234 809 551 0034',
    },
    emergencyContact: '+234 809 551 0034',
    type: 'theft',
    status: 'active',
    severity: 'medium',
    reportedAt: '2026-07-19T07:21:00Z',
    callPriority: 'P2',
    unitsAssigned: ['Police Unit P-08'],
  },
  {
    id: 'inc-abuja-004',
    title: 'Domestic Disturbance Call',
    address: 'Games Village, Kaura District, Abuja',
    coordinates: [9.01941, 7.48952],
    description: 'Caller reports escalating physical altercation. Child present on-site. Neighbors requested immediate intervention.',
    reportedBy: {
      name: 'Tolani Bello',
      phoneNumber: '+234 705 619 2247',
    },
    emergencyContact: '+234 705 619 2247',
    type: 'domestic',
    status: 'active',
    severity: 'high',
    reportedAt: '2026-07-19T06:48:00Z',
    callPriority: 'P1',
    unitsAssigned: ['Police Unit P-03', 'Ambulance A-02'],
  },
  {
    id: 'inc-abuja-005',
    title: 'Burglary Investigation Complete',
    address: 'Zone 4, Wuse Market Axis, Abuja',
    coordinates: [9.06818, 7.48019],
    description: 'Suspect apprehended. Stolen electronics recovered and handed over to owners.',
    reportedBy: {
      name: 'Ifeanyi Nwachukwu',
      phoneNumber: '+234 816 430 2291',
    },
    emergencyContact: '+234 816 430 2291',
    type: 'robbery',
    status: 'resolved',
    severity: 'medium',
    reportedAt: '2026-07-18T21:16:00Z',
    callPriority: 'P3',
    unitsAssigned: ['Police Unit P-11'],
  },
]

const resolvedIncidentSeed = [
  { title: 'Market Pickpocketing Report', address: 'Utako Market, Abuja', coordinates: [9.06158, 7.42541], type: 'theft', severity: 'low' },
  { title: 'Nighttime Store Break-In', address: 'Garki Area 10, Abuja', coordinates: [9.02962, 7.48944], type: 'robbery', severity: 'medium' },
  { title: 'Domestic Welfare Check', address: 'Lokogoma District, Abuja', coordinates: [8.96248, 7.44751], type: 'domestic', severity: 'medium' },
  { title: 'Electrical Fire Contained', address: 'Kado Estate, Abuja', coordinates: [9.08093, 7.43516], type: 'fire', severity: 'high' },
  { title: 'Motorcycle Theft Follow-Up', address: 'Kubwa Phase 2, Abuja', coordinates: [9.16628, 7.32477], type: 'theft', severity: 'low' },
  { title: 'ATM Robbery Attempt Averted', address: 'Wuye District, Abuja', coordinates: [9.06435, 7.44879], type: 'robbery', severity: 'high' },
  { title: 'Gas Leak Fire Alert', address: 'Dawaki Junction, Abuja', coordinates: [9.11925, 7.38222], type: 'fire', severity: 'medium' },
  { title: 'Family Dispute De-escalated', address: 'Karu Site, Abuja', coordinates: [9.00358, 7.56213], type: 'domestic', severity: 'low' },
  { title: 'Warehouse Theft Recovery', address: 'Idu Industrial Area, Abuja', coordinates: [9.09064, 7.51743], type: 'theft', severity: 'medium' },
  { title: 'Street Mugging Suspect Arrested', address: 'Jahi District, Abuja', coordinates: [9.09108, 7.4466], type: 'robbery', severity: 'medium' },
  { title: 'Apartment Kitchen Fire', address: 'Lifecamp, Abuja', coordinates: [9.10345, 7.40139], type: 'fire', severity: 'medium' },
  { title: 'Domestic Threat Intervention', address: 'Gudu District, Abuja', coordinates: [9.00954, 7.46748], type: 'domestic', severity: 'high' },
  { title: 'Phone Snatching Incident', address: 'Area 1 Roundabout, Abuja', coordinates: [9.03995, 7.49795], type: 'theft', severity: 'low' },
  { title: 'Armed Burglary Response', address: 'Maitama Extension, Abuja', coordinates: [9.09578, 7.50006], type: 'robbery', severity: 'high' },
  { title: 'Transformer Fire Response', address: 'Karmo, Abuja', coordinates: [9.0592, 7.38091], type: 'fire', severity: 'medium' },
  { title: 'Neighbor Disturbance Call', address: 'Asokoro Extension, Abuja', coordinates: [9.03678, 7.54262], type: 'domestic', severity: 'low' },
  { title: 'Office Laptop Theft', address: 'Central Area, Abuja', coordinates: [9.05114, 7.49288], type: 'theft', severity: 'medium' },
  { title: 'Fuel Station Robbery Alert', address: 'Gwarimpa 1st Avenue, Abuja', coordinates: [9.08563, 7.39469], type: 'robbery', severity: 'high' },
  { title: 'Workshop Fire Emergency', address: 'Durumi District, Abuja', coordinates: [9.02294, 7.44447], type: 'fire', severity: 'high' },
  { title: 'Domestic Emergency Follow-Up', address: 'Apo Resettlement, Abuja', coordinates: [9.00431, 7.50274], type: 'domestic', severity: 'medium' },
]

const additionalResolvedIncidents = resolvedIncidentSeed.map((incident, index) => ({
  id: `inc-abuja-r-${(index + 6).toString().padStart(3, '0')}`,
  title: incident.title,
  address: incident.address,
  coordinates: incident.coordinates,
  description: `Follow-up report closed by dispatch team. Case archived after verification and field update ${index + 1}.`,
  reportedBy: {
    name: `Caller ${index + 6}`,
    phoneNumber: `+234 810 ${String(3000000 + index * 173).padStart(7, '0')}`,
  },
  emergencyContact: `+234 810 ${String(3000000 + index * 173).padStart(7, '0')}`,
  type: incident.type,
  status: 'resolved',
  severity: incident.severity,
  reportedAt: new Date(Date.UTC(2026, 6, 18, 20 - Math.floor(index / 2), (index * 7) % 60, 0)).toISOString(),
  callPriority: index % 4 === 0 ? 'P2' : 'P3',
  unitsAssigned: ['Police Unit P-11'],
}))

const incidents = [...baseIncidents, ...additionalResolvedIncidents]

const responseAssets = [
  {
    id: 'asset-police-01',
    name: 'Police Unit P-14',
    type: 'police unit',
    status: 'deployed',
    coordinates: [9.08335, 7.46298],
    deployedIncidentId: 'inc-abuja-001',
  },
  {
    id: 'asset-police-02',
    name: 'Police Unit P-08',
    type: 'police unit',
    status: 'ready to deploy',
    coordinates: [9.06621, 7.42453],
  },
  {
    id: 'asset-fire-01',
    name: 'Fire Service F-06',
    type: 'fire service unit',
    status: 'deployed',
    coordinates: [9.07454, 7.40766],
    deployedIncidentId: 'inc-abuja-002',
  },
  {
    id: 'asset-ambulance-01',
    name: 'Ambulance A-09',
    type: 'ambulance unit',
    status: 'ready to deploy',
    coordinates: [9.07833, 7.43912],
  },
  {
    id: 'asset-ambulance-02',
    name: 'Ambulance A-03',
    type: 'ambulance unit',
    status: 'unavailable',
    coordinates: [9.0338, 7.49367],
  },
  {
    id: 'asset-nema-01',
    name: 'NEMA Station North',
    type: 'nema station',
    status: 'ready to deploy',
    coordinates: [9.10822, 7.45236],
  },
]

const typeTone = {
  robbery: 'bg-red-500/15 text-red-600 dark:text-red-300',
  fire: 'bg-orange-500/15 text-orange-600 dark:text-orange-300',
  theft: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  domestic: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
}

const statusTone = {
  active: 'bg-emerald/20 text-emerald-700 dark:text-light-green',
  resolved: 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200',
}

const severityWeight = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const assetStatusTone = {
  deployed: 'text-red-600 dark:text-red-300',
  'ready to deploy': 'text-emerald-700 dark:text-light-green',
  unavailable: 'text-stone-500 dark:text-stone-400',
}

const assetFill = {
  deployed: '#ef4444',
  'ready to deploy': '#10b981',
  unavailable: '#78716c',
}

const incidentFillByType = {
  robbery: '#ef4444',
  fire: '#f97316',
  theft: '#f59e0b',
  domestic: '#e11d48',
}

const SIMULATION_TICK_MS = 120

const defaultMapCenter = [9.0765, 7.4679]

const mapAreaAliases = {
  'wuse 2': [9.08457, 7.46644],
  gwarinpa: [9.07678, 7.39897],
  jabi: [9.07284, 7.42969],
  'games village': [9.01941, 7.48952],
  maitama: [9.09578, 7.50006],
  asokoro: [9.03678, 7.54262],
  lokogoma: [8.96248, 7.44751],
  kubwa: [9.16628, 7.32477],
  utako: [9.06158, 7.42541],
  apo: [9.00431, 7.50274],
}

const parseCoordinatesQuery = (value) => {
  const trimmed = value.trim()
  const match = trimmed.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/)
  if (!match) {
    return null
  }

  const latitude = Number(match[1])
  const longitude = Number(match[2])
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return null
  }

  return [latitude, longitude]
}

const jitterCoordinates = (center, maxOffset = 0.007) => {
  const latOffset = (Math.random() - 0.5) * maxOffset
  const lngOffset = (Math.random() - 0.5) * maxOffset
  return [center[0] + latOffset, center[1] + lngOffset]
}

const buildNearbyAssets = (center) => {
  const templates = [
    { type: 'police unit', namePrefix: 'Police Unit', codePrefix: 'P' },
    { type: 'ambulance unit', namePrefix: 'Ambulance', codePrefix: 'A' },
    { type: 'fire service unit', namePrefix: 'Fire Service', codePrefix: 'F' },
    { type: 'nema station', namePrefix: 'NEMA Station', codePrefix: 'N' },
  ]

  return templates.map((template, index) => {
    const unitNumber = 20 + Math.floor(Math.random() * 60)
    return {
      id: `asset-nearby-${Date.now()}-${index}`,
      name: `${template.namePrefix} ${template.codePrefix}-${unitNumber}`,
      type: template.type,
      status: 'ready to deploy',
      coordinates: jitterCoordinates(center),
      currentCoordinates: jitterCoordinates(center, 0.0045),
      targetIncident: null,
      progress: null,
    }
  })
}

const MapViewportController = ({ selectedIncident, markerRefs, mapSearchTarget }) => {
  const map = useMap()

  useEffect(() => {
    if (!selectedIncident) {
      return
    }

    map.flyTo(selectedIncident.coordinates, 13.5, { duration: 0.6 })
    const marker = markerRefs.current[selectedIncident.id]
    if (marker) {
      marker.openPopup()
    }
  }, [map, markerRefs, selectedIncident])

  useEffect(() => {
    if (!mapSearchTarget) {
      return
    }

    map.flyTo(mapSearchTarget.coordinates, mapSearchTarget.zoom ?? 14, { duration: 0.7 })
  }, [map, mapSearchTarget])

  return null
}

const buildIncidentIcon = (incidentType, selected) => L.divIcon({
  className: 'incident-pin-marker',
  html: `
    <div style="position: relative; width: 24px; height: 24px; transform: ${selected ? 'scale(1.25)' : 'scale(1)'}; transition: transform .2s;">
      <div style="position:absolute; inset:0; border-radius:9999px; background:${incidentFillByType[incidentType] ?? '#10b981'}; border:2px solid #ffffff;"></div>
      <div style="position:absolute; left:50%; bottom:-8px; width:10px; height:10px; background:${incidentFillByType[incidentType] ?? '#10b981'}; transform:translateX(-50%) rotate(45deg);"></div>
    </div>
  `,
  iconSize: [24, 32],
  iconAnchor: [12, 30],
  popupAnchor: [0, -28],
})

const buildAssetIcon = (assetStatus) => L.divIcon({
  className: 'asset-marker',
  html: `
    <div style="width:16px; height:16px; border-radius:4px; background:${assetFill[assetStatus] ?? '#78716c'}; border:2px solid #ffffff;"></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -12],
})

const getRemainingEtaSeconds = (progress, speed) => {
  if (progress >= 1 || speed <= 0) {
    return 0
  }

  return Math.ceil((((1 - progress) / speed) * SIMULATION_TICK_MS) / 1000)
}

const formatEta = (seconds) => {
  if (seconds <= 0) {
    return 'On Site'
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

const Incidents = () => {
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const markerRefs = useRef({})
  const cardRefs = useRef({})
  const [isAssetsPanelOpen, setIsAssetsPanelOpen] = useState(true)
  const [assetProgressById, setAssetProgressById] = useState({})
  const [roadPathByAssetId, setRoadPathByAssetId] = useState({})

  const orderedIncidents = useMemo(
    () => [...incidents].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'active' ? -1 : 1
      }

      if (severityWeight[a.severity] !== severityWeight[b.severity]) {
        return severityWeight[b.severity] - severityWeight[a.severity]
      }

      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    }),
    [],
  )

  const activeIncidents = useMemo(
    () => orderedIncidents.filter((incident) => incident.status === 'active'),
    [orderedIncidents],
  )

  const resolvedIncidents = useMemo(
    () => orderedIncidents.filter((incident) => incident.status === 'resolved'),
    [orderedIncidents],
  )

  const deployedAssetRoutes = useMemo(
    () => responseAssets
      .filter((asset) => asset.status === 'deployed' && asset.deployedIncidentId)
      .map((asset, index) => {
        const targetIncident = activeIncidents.find((incident) => incident.id === asset.deployedIncidentId)
        if (!targetIncident) {
          return null
        }

        return {
          asset,
          targetIncident,
          speed: 0.0045 + index * 0.0015,
        }
      })
      .filter(Boolean),
    [activeIncidents],
  )

  const deployedRouteByAssetId = useMemo(
    () => Object.fromEntries(deployedAssetRoutes.map((route) => [route.asset.id, route])),
    [deployedAssetRoutes],
  )

  useEffect(() => {
    if (deployedAssetRoutes.length === 0) {
      setRoadPathByAssetId({})
      return undefined
    }

    let isCancelled = false

    const fetchRoadPaths = async () => {
      const routeEntries = await Promise.all(deployedAssetRoutes.map(async (route) => {
        try {
          const routeData = await fetchRoadRoute(route.asset.coordinates, route.targetIncident.coordinates)
          if (routeData) {
            return [route.asset.id, routeData]
          }
        } catch {
          // If the route service fails, omit the route line rather than drawing a straight substitute.
        }

        return null
      }))

      if (!isCancelled) {
        setRoadPathByAssetId(Object.fromEntries(routeEntries.filter(Boolean)))
      }
    }

    fetchRoadPaths()

    return () => {
      isCancelled = true
    }
  }, [deployedAssetRoutes])

  const routeSpeedByAssetId = useMemo(() => Object.fromEntries(deployedAssetRoutes.map((route) => {
    const routeDuration = roadPathByAssetId[route.asset.id]?.durationSeconds
    const fallbackSpeed = route.speed

    if (!routeDuration || routeDuration <= 0) {
      return [route.asset.id, fallbackSpeed]
    }

    const durationBasedSpeed = (SIMULATION_TICK_MS / 1000) / routeDuration
    return [route.asset.id, Math.max(0.0005, Math.min(durationBasedSpeed, fallbackSpeed))]
  })), [deployedAssetRoutes, roadPathByAssetId])

  const animatedAssets = useMemo(
    () => responseAssets.map((asset) => {
      if (asset.status !== 'deployed' || !asset.deployedIncidentId) {
        return {
          ...asset,
          currentCoordinates: asset.coordinates,
          targetIncident: null,
          progress: null,
        }
      }

      const route = deployedRouteByAssetId[asset.id]
      if (!route) {
        return {
          ...asset,
          currentCoordinates: asset.coordinates,
          targetIncident: null,
          progress: null,
        }
      }

      const progress = assetProgressById[asset.id] ?? 0
      const roadPath = roadPathByAssetId[asset.id]?.points
      if (!roadPath || roadPath.length < 2) {
        return {
          ...asset,
          currentCoordinates: asset.coordinates,
          targetIncident: route.targetIncident,
          progress: 0,
          routePath: null,
          placeholderPath: buildFallbackRoutePath(asset.coordinates, route.targetIncident.coordinates),
        }
      }
      const { point } = getPathPointAndNextIndex(roadPath, progress)

      return {
        ...asset,
        currentCoordinates: point ?? asset.coordinates,
        targetIncident: route.targetIncident,
        progress,
        routePath: roadPath,
        placeholderPath: roadPath,
      }
    }),
    [assetProgressById, deployedRouteByAssetId, roadPathByAssetId],
  )

  const incidentDeploymentMeta = useMemo(() => {
    const deploymentMap = {}

    animatedAssets.forEach((asset) => {
      if (!asset.targetIncident) {
        return
      }

      const route = deployedRouteByAssetId[asset.id]
      if (!route) {
        return
      }

      const incidentId = asset.targetIncident.id
      const etaSeconds = getRemainingEtaSeconds(asset.progress ?? 0, routeSpeedByAssetId[asset.id] ?? route.speed)

      if (!deploymentMap[incidentId]) {
        deploymentMap[incidentId] = {
          assets: [],
          allOnSite: true,
          soonestEtaSeconds: Number.POSITIVE_INFINITY,
        }
      }

      deploymentMap[incidentId].assets.push({
        id: asset.id,
        name: asset.name,
        etaSeconds,
      })

      if (etaSeconds > 0) {
        deploymentMap[incidentId].allOnSite = false
        deploymentMap[incidentId].soonestEtaSeconds = Math.min(
          deploymentMap[incidentId].soonestEtaSeconds,
          etaSeconds,
        )
      }
    })

    Object.values(deploymentMap).forEach((item) => {
      if (item.soonestEtaSeconds === Number.POSITIVE_INFINITY) {
        item.soonestEtaSeconds = 0
      }
    })

    return deploymentMap
  }, [animatedAssets, deployedRouteByAssetId, routeSpeedByAssetId])

  useEffect(() => {
    if (deployedAssetRoutes.length === 0) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setAssetProgressById((previous) => {
        const next = { ...previous }
        deployedAssetRoutes.forEach((route) => {
          const roadPath = roadPathByAssetId[route.asset.id]?.points
          if (!roadPath || roadPath.length < 2) {
            next[route.asset.id] = previous[route.asset.id] ?? 0
            return
          }

          const current = next[route.asset.id] ?? 0
          const routeSpeed = routeSpeedByAssetId[route.asset.id] ?? route.speed
          next[route.asset.id] = Math.min(current + routeSpeed, 1)
        })
        return next
      })
    }, SIMULATION_TICK_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [deployedAssetRoutes, roadPathByAssetId, routeSpeedByAssetId])

  const [selectedIncidentId, setSelectedIncidentId] = useState(activeIncidents[0]?.id ?? null)

  const selectedIncident = useMemo(
    () => activeIncidents.find((incident) => incident.id === selectedIncidentId) ?? activeIncidents[0] ?? null,
    [activeIncidents, selectedIncidentId],
  )

  useEffect(() => {
    if (!selectedIncidentId && activeIncidents[0]) {
      setSelectedIncidentId(activeIncidents[0].id)
    }
  }, [activeIncidents, selectedIncidentId])

  useEffect(() => {
    if (!selectedIncidentId) {
      return
    }

    const cardNode = cardRefs.current[selectedIncidentId]
    if (cardNode) {
      cardNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [selectedIncidentId])

  const [recordingIncident, setRecordingIncident] = useState(false)
  const [mapSearchQuery, setMapSearchQuery] = useState('')
  const [mapSearchFeedback, setMapSearchFeedback] = useState('Search by area name or coordinates (lat, lng) and press Enter.')
  const [mapSearchTarget, setMapSearchTarget] = useState(null)
  const [nearbyAssets, setNearbyAssets] = useState([])

  const allMapAssets = useMemo(
    () => [...animatedAssets, ...nearbyAssets],
    [animatedAssets, nearbyAssets],
  )

  const handleMapSearch = (event) => {
    event.preventDefault()

    const normalizedQuery = mapSearchQuery.trim()
    if (!normalizedQuery) {
      setMapSearchFeedback('Enter an area name or coordinates in the format: 9.0765, 7.4679')
      return
    }

    const searchedCoordinates = parseCoordinatesQuery(normalizedQuery)
    if (searchedCoordinates) {
      setMapSearchTarget({
        coordinates: searchedCoordinates,
        zoom: 14.2,
        token: Date.now(),
      })
      setNearbyAssets(buildNearbyAssets(searchedCoordinates))
      setMapSearchFeedback(`Moved map to ${searchedCoordinates[0].toFixed(5)}, ${searchedCoordinates[1].toFixed(5)} and dropped nearby assets.`)
      return
    }

    const queryLower = normalizedQuery.toLowerCase()
    const activeIncidentMatch = activeIncidents.find((incident) => (
      incident.address.toLowerCase().includes(queryLower)
      || incident.title.toLowerCase().includes(queryLower)
    ))

    if (activeIncidentMatch) {
      setSelectedIncidentId(activeIncidentMatch.id)
      setMapSearchTarget({
        coordinates: activeIncidentMatch.coordinates,
        zoom: 14,
        token: Date.now(),
      })
      setNearbyAssets(buildNearbyAssets(activeIncidentMatch.coordinates))
      setMapSearchFeedback(`Moved map to ${activeIncidentMatch.address} and dropped nearby assets.`)
      return
    }

    const aliasMatchCoordinates = mapAreaAliases[queryLower]
    if (aliasMatchCoordinates) {
      setMapSearchTarget({
        coordinates: aliasMatchCoordinates,
        zoom: 13.8,
        token: Date.now(),
      })
      setNearbyAssets(buildNearbyAssets(aliasMatchCoordinates))
      setMapSearchFeedback(`Moved map to ${normalizedQuery} and dropped nearby assets.`)
      return
    }

    setMapSearchFeedback(`No matching area found for "${normalizedQuery}". Try coordinates like 9.0765, 7.4679.`)
  }

  return (
    <>
      <section className="w-full space-y-4">
        <div className="flex w-full items-center justify-between gap-x-4">
          <div className="w-10/12">
            <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">Emergency Incident Board</p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-100">Live Incident & Asset Map</h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              Active incidents are pinned across Abuja with synchronized dispatch cards and response assets.
            </p>
          </div>

          <div className="w-2/12 flex flex-row-reverse">
            <button onClick={()=>{setRecordingIncident(true)}} className="px-4 py-3 cursor-pointer rounded-lg text-sm text-stone-800 bg-emerald dark:bg-light-green transition duration-200 hover:bg-light-green dark:hover:bg-emerald flex  items-center justify-center gap-x-1 font-semibold">
              <PlusIcon className="h-4 w-4" />
              Record New Incident
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-between gap-4 xl:flex-row">
          <div className="w-full rounded-lg border border-stone-200 bg-white p-2 dark:border-stone-900/50 dark:bg-stone-900/10 xl:w-2/3">
            <div className="mb-2 flex flex-col gap-2 px-2 py-1 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-600 dark:text-stone-300">
                <span className="font-semibold">Legend</span>
                <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />Robbery</span>
                <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" />Fire</span>
                <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Theft</span>
                <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" />Domestic</span>
                <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-emerald" />Asset ready</span>
                <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-red-500" />Asset deployed</span>
              </div>

              <form onSubmit={handleMapSearch} className="w-full max-w-sm lg:w-80">
                <input
                  type="text"
                  value={mapSearchQuery}
                  onChange={(event) => setMapSearchQuery(event.target.value)}
                  placeholder="Search area or enter lat, lng"
                  className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-xs text-stone-700 outline-none ring-0 transition focus:border-emerald dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:focus:border-light-green"
                />
                <p className="mt-1 text-[10px] text-stone-500 dark:text-stone-400">{mapSearchFeedback}</p>
              </form>
            </div>

            <div className="h-155 w-full overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700/60">
              <MapContainer center={defaultMapCenter} zoom={12.7} className="h-full w-full">
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                  url={
                    isDarkMode
                      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                  }
                />

                <MapViewportController
                  selectedIncident={selectedIncident}
                  markerRefs={markerRefs}
                  mapSearchTarget={mapSearchTarget}
                />

                {activeIncidents.map((incident) => {
                  const selected = selectedIncidentId === incident.id
                  return (
                    <Marker
                      key={incident.id}
                      position={incident.coordinates}
                      icon={buildIncidentIcon(incident.type, selected)}
                      ref={(ref) => {
                        if (ref) {
                          markerRefs.current[incident.id] = ref
                        }
                      }}
                      eventHandlers={{
                        click: () => setSelectedIncidentId(incident.id),
                      }}
                    >
                      <Popup minWidth={220}>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-stone-900">{incident.title}</p>
                          <p className="text-xs text-stone-500">{incident.address}</p>
                          <p className="text-xs text-stone-700">{incident.description}</p>
                        </div>
                      </Popup>
                      <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
                        {incident.title}
                      </Tooltip>
                    </Marker>
                  )
                })}

                {deployedAssetRoutes.map((route) => {
                  const progress = assetProgressById[route.asset.id] ?? 0
                  const roadPath = roadPathByAssetId[route.asset.id]?.points
                  const displayPath = roadPath ?? buildFallbackRoutePath(
                    route.asset.coordinates,
                    route.targetIncident.coordinates,
                  )
                  if (!displayPath || displayPath.length < 2) {
                    return null
                  }
                  const isRoadPathLoaded = Boolean(roadPath && roadPath.length >= 2)
                  const effectiveProgress = isRoadPathLoaded ? progress : 0
                  const movingState = getPathPointAndNextIndex(displayPath, effectiveProgress)
                  const movingCoordinates = movingState.point ?? route.asset.coordinates
                  const remainingPath = [movingCoordinates, ...displayPath.slice(movingState.nextIndex)]

                  return (
                    <React.Fragment key={`route-${route.asset.id}`}>
                      <Polyline
                        positions={displayPath}
                        pathOptions={{
                          color: '#0ea5e9',
                          weight: 2,
                          dashArray: isRoadPathLoaded ? '8 8' : '4 10',
                          opacity: isRoadPathLoaded ? 0.35 : 0.28,
                        }}
                      />
                      <Polyline
                        positions={remainingPath.length > 1 ? remainingPath : [movingCoordinates, route.targetIncident.coordinates]}
                        pathOptions={{ color: '#22c55e', weight: 3, opacity: 0.9 }}
                      />
                    </React.Fragment>
                  )
                })}

                {allMapAssets.map((asset) => (
                  <Marker key={asset.id} position={asset.currentCoordinates} icon={buildAssetIcon(asset.status)}>
                    <Popup minWidth={200}>
                      <div>
                        <p className="text-sm font-semibold text-stone-900">{asset.name}</p>
                        <p className="text-xs text-stone-500">{asset.type}</p>
                        <p className="text-xs font-semibold text-stone-800">Status: {asset.status}</p>
                        {asset.targetIncident ? (
                          <>
                            <p className="text-xs text-stone-700">Deployed to: {asset.targetIncident.title}</p>
                            <p className="text-xs text-stone-700">Progress: {Math.round((asset.progress ?? 0) * 100)}%</p>
                          </>
                        ) : null}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {selectedIncident ? (
                  <Circle
                    center={selectedIncident.coordinates}
                    radius={420}
                    pathOptions={{
                      color: '#10b981',
                      fillColor: '#10b981',
                      fillOpacity: 0.1,
                      weight: 1,
                    }}
                  />
                ) : null}
              </MapContainer>
            </div>

            <article className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/50 dark:bg-stone-800/20">
              <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                Resolved Incidents ({resolvedIncidents.length})
              </h2>
              <div className="mt-2 space-y-2 overflow-y-auto pr-1">
                {resolvedIncidents.map((incident) => (
                  <div key={incident.id} className="rounded-md border border-stone-200 bg-white p-2.5 dark:border-stone-700/40 dark:bg-stone-900/20">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{incident.title}</p>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${statusTone[incident.status]}`}>
                        {incident.status}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-stone-600 dark:text-stone-300">{incident.address}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${typeTone[incident.type]}`}>
                        {incident.type}
                      </span>
                      <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold text-stone-700 dark:bg-stone-700 dark:text-stone-200">
                        {incident.callPriority}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="mt-2 rounded-md bg-emerald px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:brightness-95 dark:bg-light-green"
                      onClick={() => navigate(`/admin/incidents/${incident.id}`)}
                    >
                      See details
                    </button>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="w-full space-y-3 xl:w-1/3">
            <article className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-900/50 dark:bg-stone-900/10">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Response Assets</h2>
                <button
                  type="button"
                  onClick={() => setIsAssetsPanelOpen((current) => !current)}
                  className="rounded-md border border-stone-300 px-2 py-1 text-[11px] font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                >
                  {isAssetsPanelOpen ? 'Collapse' : 'Expand'}
                </button>
              </div>

              {isAssetsPanelOpen ? (
                <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  {allMapAssets.map((asset) => (
                    <div key={asset.id} className="rounded-md bg-stone-100 px-3 py-2 dark:bg-stone-800/30">
                      <p className="text-xs font-semibold text-stone-800 dark:text-stone-100">{asset.name}</p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">{asset.type}</p>
                      <p className={`text-[11px] font-semibold ${assetStatusTone[asset.status]}`}>{asset.status}</p>
                      {asset.targetIncident ? (
                        <>
                          <p className="text-[11px] text-stone-600 dark:text-stone-300">Target: {asset.targetIncident.title}</p>
                          <p className="text-[11px] text-stone-600 dark:text-stone-300">ETA Progress: {Math.round((asset.progress ?? 0) * 100)}%</p>
                        </>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </article>

            <article className="space-y-2 overflow-y-auto rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-900/50 dark:bg-stone-900/10">
              <h2 className="z-10 bg-white py-1 text-sm font-semibold text-stone-800 dark:bg-stone-900 dark:text-stone-100">
                Active Incidents ({activeIncidents.length})
              </h2>

              {activeIncidents.map((incident) => {
                const selected = selectedIncidentId === incident.id
                const deploymentMeta = incidentDeploymentMeta[incident.id]
                return (
                  <div
                    key={incident.id}
                    ref={(node) => {
                      if (node) {
                        cardRefs.current[incident.id] = node
                      }
                    }}
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={`cursor-pointer rounded-lg border p-3 transition ${
                      selected
                        ? 'border-emerald bg-emerald/10 dark:border-light-green dark:bg-light-green/10'
                        : 'border-stone-200 bg-stone-50 hover:border-stone-300 dark:border-stone-700/50 dark:bg-stone-800/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{incident.title}</p>
                      <div className="flex items-center gap-1.5">
                        {deploymentMeta ? (
                          <div className="group relative">
                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              deploymentMeta.allOnSite
                                ? 'bg-sky-500/20 text-sky-700 dark:text-sky-300'
                                : 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                            }`}>
                              {deploymentMeta.allOnSite
                                ? 'Assets On Site'
                                : `Assets Deployed • ETA ${formatEta(deploymentMeta.soonestEtaSeconds)}`}
                            </span>
                            <div className="pointer-events-none invisible absolute right-0 top-full z-20 mt-1 w-56 rounded-md border border-stone-200 bg-white px-2 py-2 text-[11px] text-stone-700 opacity-0 shadow-sm transition group-hover:visible group-hover:opacity-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">
                              <p className="font-semibold">Deployed Assets</p>
                              <div className="mt-1 space-y-1">
                                {deploymentMeta.assets.map((asset) => (
                                  <p key={asset.id}>
                                    {asset.name} • {asset.etaSeconds > 0 ? `ETA ${formatEta(asset.etaSeconds)}` : 'On Site'}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : null}
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${statusTone[incident.status]}`}>
                          {incident.status}
                        </span>
                      </div>
                    </div>

                    <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">{incident.address}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${typeTone[incident.type]}`}>
                        {incident.type}
                      </span>
                      <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold text-stone-700 dark:bg-stone-700 dark:text-stone-200">
                        {incident.callPriority}
                      </span>
                      <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-stone-700 dark:bg-stone-700 dark:text-stone-200">
                        {incident.severity}
                      </span>
                    </div>

                    <div className="mt-2 grid gap-1 text-[11px] text-stone-600 dark:text-stone-300">
                      <p>
                        Reported by: <span className="font-semibold text-stone-800 dark:text-stone-100">{incident.reportedBy.name}</span> ({incident.reportedBy.phoneNumber})
                      </p>
                      <p>Emergency line: {incident.emergencyContact}</p>
                      <p>
                        Coordinates: {incident.coordinates[0].toFixed(5)}, {incident.coordinates[1].toFixed(5)}
                      </p>
                      <p>Units: {incident.unitsAssigned.join(', ')}</p>
                    </div>

                    <button
                      type="button"
                      className="mt-3 rounded-md bg-emerald px-3 py-1.5 text-xs font-semibold text-stone-900 transition hover:brightness-95 dark:bg-light-green"
                      onClick={(event) => {
                        event.stopPropagation()
                        navigate(`/admin/incidents/${incident.id}`)
                      }}
                    >
                      See details
                    </button>
                  </div>
                )
              })}
            </article>
          </div>
        </div>
      </section>
      
      <ModalDialog
        shown={recordingIncident}
        closeFunction={()=>{setRecordingIncident(false)}}
        dialogTitle={`Record a new incident`}
        maxWidthClass={`max-w-6xl`}
      >
        <RecordNewIncident isOpen={recordingIncident} />
      </ModalDialog>
    </>
  )
}

export default Incidents