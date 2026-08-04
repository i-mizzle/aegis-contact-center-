import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTheme } from '../../../context/ThemeContext'
import {
  buildFallbackRoutePath,
  fetchRoadRoute,
  getPathPointAndNextIndex,
  getSegmentDistance,
} from '../../../utils/roadRoutes'
import ModalDialog from '../../../components/layouts/ModalDialog';
import DeployAsset from '../../../components/elements/workflow/incidents/DeployAsset';
import AddIncidentNote from '../../../components/elements/workflow/incidents/AddIncidentNote';
import ResolveIncident from '../../../components/elements/workflow/incidents/ResolveIncident';
import AutocompleteSelect from '../../../components/elements/form/AutocompleteSelect';
import TextareaField from '../../../components/elements/form/TextareaField';
import FormButton from '../../../components/elements/form/FormButton';
import ChevronIcon from '../../../components/elements/icons/ChevronIcon';

const attachmentKindByMime = {
  image: 'photo',
  video: 'video',
  audio: 'audio',
  application: 'document',
  text: 'document',
}

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
  {
    id: 'inc-abuja-006',
    title: 'Reported Kidnapping Case',
    address: 'Sultan Maccido Crescent, Wuye District, Abuja',
    coordinates: [9.06284, 7.44815],
    description: 'Family reports a 17-year-old student was forced into a dark SUV after evening lesson pick-up. Last verified direction of travel was toward the Wuye interchange.',
    reportedBy: {
      name: 'Nnenna Eze',
      phoneNumber: '+234 807 119 4408',
    },
    emergencyContact: '+234 807 119 4408',
    type: 'kidnapping',
    status: 'active',
    severity: 'critical',
    reportedAt: '2026-07-19T10:06:00Z',
    callPriority: 'P1',
    unitsAssigned: ['Police Unit P-03', 'DSS'],
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

const allAssets = [
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
    id: 'asset-police-03',
    name: 'Police Unit P-03',
    type: 'police unit',
    status: 'ready to deploy',
    coordinates: [9.02621, 7.49253],
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
    id: 'asset-fire-02',
    name: 'Fire Service F-02',
    type: 'fire service unit',
    status: 'ready to deploy',
    coordinates: [9.09454, 7.43766],
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
    name: 'Ambulance A-02',
    type: 'ambulance unit',
    status: 'ready to deploy',
    coordinates: [9.0168, 7.48367],
  },
  {
    id: 'asset-ambulance-03',
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
  {
    id: 'asset-ffs-01',
    name: 'Federal Fire Service',
    type: 'fire service unit',
    status: 'ready to deploy',
    requiresApproval: true,
    coordinates: [9.08314, 7.44938],
  },
  {
    id: 'asset-dss-01',
    name: 'DSS',
    type: 'security unit',
    status: 'ready to deploy',
    requiresApproval: true,
    coordinates: [9.06845, 7.47618],
  },
]

const typeTone = {
  robbery: 'bg-red-500/15 text-red-600 dark:text-red-300',
  fire: 'bg-orange-500/15 text-orange-600 dark:text-orange-300',
  theft: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  domestic: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
  kidnapping: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
}

const statusTone = {
  active: 'bg-emerald/20 text-emerald-700 dark:text-light-green',
  resolved: 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200',
}

const assetStatusTone = {
  deployed: 'text-red-600 dark:text-red-300',
  'ready to deploy': 'text-emerald-700 dark:text-light-green',
  unavailable: 'text-stone-500 dark:text-stone-400',
  'on site': 'text-sky-700 dark:text-sky-300',
  'awaiting approval': 'text-amber-700 dark:text-amber-300',
}

const assetFill = {
  deployed: '#ef4444',
  'ready to deploy': '#10b981',
  unavailable: '#78716c',
  'on site': '#0ea5e9',
  'awaiting approval': '#f59e0b',
}

const incidentFillByType = {
  robbery: '#ef4444',
  fire: '#f97316',
  theft: '#f59e0b',
  domestic: '#e11d48',
  kidnapping: '#7c3aed',
}

const SIMULATION_TICK_MS = 120
const MAP_ZOOM = 14

const bodyCamStreamVideoOptions = [
  {
    id: 'stream-1',
    label: 'City street camera',
    url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
  },
  {
    id: 'stream-2',
    label: 'Responder dash camera',
    url: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
  },
  {
    id: 'stream-3',
    label: 'Aerial support feed',
    url: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
  },
]

const droneStreamVideoOptions = [
  {
    id: 'drone-stream-1',
    label: 'Aerial patrol footage',
    url: 'https://video-previews.elements.envatousercontent.com/c297e742-6881-4887-8011-d1e08cfc7754/watermarked_preview/watermarked_preview.mp4',
  },
  {
    id: 'drone-stream-2',
    label: 'Aerial city flyover',
    url: 'https://video-previews.elements.envatousercontent.com/files/e552b338-c210-4a8e-bb9b-1a929313667e/video_preview_h264.mp4',
  },
]

const streetCamStreamVideoOptions = [
  {
    id: 'streetcam-stream-1',
    label: 'Traffic corridor camera',
    url: 'https://video-previews.elements.envatousercontent.com/files/2bd5a591-8f8a-4b2a-97e5-089536dc806d/video_preview_h264.mp4',
  },
]

const escalationAuthorities = [
  'Inspector General Command Center',
  'Federal Fire Service HQ',
  'DSS Regional Operations Desk',
  'NEMA National Response Coordination',
  'State Emergency Management Headquarters',
]

const firstNames = ['Amina', 'Kabiru', 'Tunde', 'Ifeoma', 'Binta', 'Daniel', 'Salma', 'Chinedu', 'Hauwa', 'Femi']
const lastNames = ['Musa', 'Okoro', 'Balogun', 'Yakubu', 'Nwosu', 'Adeyemi', 'Sule', 'Garba', 'Bello', 'Obi']

const hashString = (value) => value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

const buildAssetPersonnel = (asset) => {
  const assetHash = hashString(asset.id)
  const personnelCountByType = {
    'police unit': 2,
    'fire service unit': 6,
    'ambulance unit': 4,
    'nema station': 3,
    'security unit': 4,
  }

  const roleByType = {
    'police unit': ['Lead Officer', 'Support Officer'],
    'fire service unit': ['Crew Commander', 'Pump Operator', 'Rescue Specialist', 'Firefighter', 'Safety Officer', 'Medic Support'],
    'ambulance unit': ['Paramedic Lead', 'Paramedic', 'Emergency Technician', 'Driver'],
    'nema station': ['Field Coordinator', 'Search Specialist', 'Operations Support'],
    'security unit': ['Lead Analyst', 'Tactical Officer', 'Surveillance Specialist', 'Field Operator'],
  }

  const personnelCount = personnelCountByType[asset.type] ?? 2
  const roles = roleByType[asset.type] ?? ['Responder', 'Responder']

  const personnel = Array.from({ length: personnelCount }).map((_, index) => {
    const nameIndex = (assetHash + index * 3) % firstNames.length
    const lastNameIndex = (assetHash + index * 5) % lastNames.length
    const hasBodyCam = asset.type === 'police unit' && index % 2 === 0

    return {
      id: `${asset.id}-personnel-${index + 1}`,
      name: `${firstNames[nameIndex]} ${lastNames[lastNameIndex]}`,
      role: roles[index] ?? `Responder ${index + 1}`,
      hasBodyCam,
      deviceLabel: hasBodyCam ? 'Body Cam' : null,
    }
  })

  let drone = null
  if (asset.type === 'police unit' && assetHash % 2 === 0) {
    drone = {
      name: `SkyEye Patrol Drone ${asset.name.split(' ').pop()}`,
      serial: `PD-${assetHash}-A`,
    }
  }

  if (asset.type === 'fire service unit') {
    drone = {
      name: `FireWatch Thermal Drone ${asset.name.split(' ').pop()}`,
      serial: `FD-${assetHash}-T`,
    }
  }

  return {
    personnel,
    drone,
  }
}

const buildIncidentIcon = (incidentType) => L.divIcon({
  className: 'incident-pin-marker',
  html: `
    <div style="position: relative; width: 24px; height: 24px; transform: scale(1.2); transition: transform .2s;">
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

const buildSightingIcon = (confidence = 'medium') => {
  const fillByConfidence = {
    high: '#dc2626',
    medium: '#f59e0b',
    low: '#facc15',
  }

  const fill = fillByConfidence[confidence] ?? fillByConfidence.medium

  return L.divIcon({
    className: 'sighting-marker',
    html: `
      <div style="position: relative; width: 20px; height: 20px;">
        <div style="position:absolute; inset:2px; border-radius:9999px; background:${fill}; border:2px solid #ffffff;"></div>
        <div style="position:absolute; inset:0; border-radius:9999px; border:2px solid ${fill}; opacity:0.45;"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  })
}

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

const createIncidentNotes = (incidentId) => {
  if (incidentId === 'inc-abuja-006') {
    return [
      {
        id: `${incidentId}-note-1`,
        author: 'Mariam Yusuf',
        role: 'Family Liaison',
        text: 'Victim profile submitted by guardian. Student was wearing a navy school hoodie, black skirt, and white sneakers at time of abduction.',
        time: '2026-07-19T10:09:00Z',
        attachments: [
          {
            id: `${incidentId}-note-1-photo`,
            name: 'Victim profile photo.jpg',
            kind: 'photo',
            url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
          },
        ],
      },
      {
        id: `${incidentId}-note-2`,
        author: 'Amina Salisu',
        role: 'Dispatcher',
        text: 'Reported sighting: dark Toyota Highlander matching caller description seen by two pedestrians approaching Wuye interchange at approximately 10:04 AM.',
        time: '2026-07-19T10:12:00Z',
        attachments: [],
      },
      {
        id: `${incidentId}-note-3`,
        author: 'Ibrahim Nnaji',
        role: 'Field Response',
        text: 'Secondary sighting received from fuel station attendant near Berger axis. Vehicle may have changed lanes toward the ring road feeder.',
        time: '2026-07-19T10:16:00Z',
        attachments: [
          {
            id: `${incidentId}-note-3-audio`,
            name: 'Attendant voice statement.mp3',
            kind: 'audio',
            url: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
          },
        ],
      },
      {
        id: `${incidentId}-note-4`,
        author: 'Ruth Adesina',
        role: 'Command Officer',
        text: 'DSS surveillance support requested. Nearby CCTV cluster and school gate footage flagged for urgent collection.',
        time: '2026-07-19T10:21:00Z',
        attachments: [
          {
            id: `${incidentId}-note-4-doc`,
            name: 'Sighting grid brief.pdf',
            kind: 'document',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          },
        ],
      },
    ]
  }

  return [
    {
      id: `${incidentId}-note-1`,
      author: 'Mariam Yusuf',
      role: 'Dispatcher',
      text: '911 intake completed. Caller details and event timeline validated.',
      time: '2026-07-19T09:18:00Z',
      attachments: [
        {
          id: `${incidentId}-note-1-photo`,
          name: 'Caller storefront photo.jpg',
          kind: 'photo',
          url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80',
        },
      ],
    },
    {
      id: `${incidentId}-note-2`,
      author: 'Ibrahim Nnaji',
      role: 'Responder',
      text: 'Perimeter established. Awaiting specialized support for scene control.',
      time: '2026-07-19T09:23:00Z',
      attachments: [
        {
          id: `${incidentId}-note-2-audio`,
          name: 'Responder voice update.mp3',
          kind: 'audio',
          url: 'https://samplelib.com/lib/preview/mp3/sample-3s.mp3',
        },
      ],
    },
    {
      id: `${incidentId}-note-3`,
      author: 'Ruth Adesina',
      role: 'Command Officer',
      text: 'Incident remains under active monitoring. Keep updates every 5 minutes.',
      time: '2026-07-19T09:29:00Z',
      attachments: [
        {
          id: `${incidentId}-note-3-doc`,
          name: 'Initial incident brief.pdf',
          kind: 'document',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
      ],
    },
  ]
}

const createPublicFeeds = (incidentId, incidentType) => {
  if (incidentType === 'kidnapping') {
    return [
      {
        id: `${incidentId}-feed-1`,
        sender: {
          name: 'Bashir Lawan',
          email: 'bashir.lawan@example.com',
          phone: '+234 813 540 1122',
          avatar: 'BL',
        },
        text: 'I saw the same SUV near the Wuye underpass. It paused briefly before turning toward the service lane. Sharing the picture I took from a distance.',
        time: '2026-07-19T10:14:00Z',
        attachments: [
          {
            id: `${incidentId}-feed-1-photo`,
            name: 'SUV sighting.jpg',
            kind: 'photo',
            url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
          },
        ],
      },
      {
        id: `${incidentId}-feed-2`,
        sender: {
          name: 'Halima Suleiman',
          email: 'halima.suleiman@example.com',
          phone: '+234 802 445 7708',
          avatar: 'HS',
        },
        text: 'Uploading a voice note from the bus stop. Two men were arguing about changing number plates just after the SUV passed.',
        time: '2026-07-19T10:18:00Z',
        attachments: [
          {
            id: `${incidentId}-feed-2-audio`,
            name: 'Bus stop witness note.wav',
            kind: 'audio',
            url: 'https://samplelib.com/lib/preview/wav/sample-3s.wav',
          },
        ],
      },
      {
        id: `${incidentId}-feed-3`,
        sender: {
          name: 'Daniel Obot',
          email: 'daniel.obot@example.com',
          phone: '+234 805 210 1142',
          avatar: 'DO',
        },
        text: 'My dash camera captured a partial rear view near the interchange. Sharing the clip in case it helps match the vehicle.',
        time: '2026-07-19T10:22:00Z',
        attachments: [
          {
            id: `${incidentId}-feed-3-video`,
            name: 'Dash camera clip.mp4',
            kind: 'video',
            url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
          },
        ],
      },
    ]
  }

  return [
  {
    id: `${incidentId}-feed-1`,
    sender: {
      name: 'Aisha Gambo',
      email: 'aisha.gambo@example.com',
      phone: '+234 813 640 2201',
      avatar: 'AG',
    },
    text: `I am across the road from the ${incidentType} scene. Security vehicles just blocked the nearest turn-in and pedestrians are gathering by the storefronts.`,
    time: '2026-07-19T09:20:00Z',
    attachments: [
      {
        id: `${incidentId}-feed-1-photo`,
        name: 'Street-side witness photo.jpg',
        kind: 'photo',
        url: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  {
    id: `${incidentId}-feed-2`,
    sender: {
      name: 'Daniel Obot',
      email: 'daniel.obot@example.com',
      phone: '+234 805 210 1142',
      avatar: 'DO',
    },
    text: 'Uploading a short clip from the junction camera angle. You can hear bystanders calling out the direction responders moved in.',
    time: '2026-07-19T09:24:00Z',
    attachments: [
      {
        id: `${incidentId}-feed-2-video`,
        name: 'Junction clip.mp4',
        kind: 'video',
        url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
      },
    ],
  },
  {
    id: `${incidentId}-feed-3`,
    sender: {
      name: 'Halima Suleiman',
      email: 'halima.suleiman@example.com',
      phone: '+234 802 445 7708',
      avatar: 'HS',
    },
    text: 'Sharing a voice note from inside the block. Smoke is lighter now but there are still people waiting for clearance to return.',
    time: '2026-07-19T09:28:00Z',
    attachments: [
      {
        id: `${incidentId}-feed-3-audio`,
        name: 'Resident voice note.wav',
        kind: 'audio',
        url: 'https://samplelib.com/lib/preview/wav/sample-3s.wav',
      },
      {
        id: `${incidentId}-feed-3-photo`,
        name: 'Building frontage.png',
        kind: 'photo',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
      },
    ],
  },
  ]
}

const incidentSightingsById = {
  'inc-abuja-006': [
    {
      id: 'inc-abuja-006-sighting-1',
      title: 'Pedestrian sighting',
      location: 'Approach to Wuye interchange',
      coordinates: [9.06573, 7.45086],
      source: 'Dispatcher note',
      reportedAt: '2026-07-19T10:12:00Z',
      confidence: 'high',
      details: 'Two pedestrians reported a dark Toyota Highlander matching the caller description heading toward the interchange.',
    },
    {
      id: 'inc-abuja-006-sighting-2',
      title: 'Fuel station attendant report',
      location: 'Berger axis fuel station',
      coordinates: [9.07144, 7.44138],
      source: 'Field response note',
      reportedAt: '2026-07-19T10:16:00Z',
      confidence: 'medium',
      details: 'Attendant reported the SUV moved through the feeder lane and may have started a direction change toward the ring road.',
    },
    {
      id: 'inc-abuja-006-sighting-3',
      title: 'Dashcam visual',
      location: 'Service lane near Wuye underpass',
      coordinates: [9.05998, 7.44451],
      source: 'Public feed upload',
      reportedAt: '2026-07-19T10:22:00Z',
      confidence: 'medium',
      details: 'Dashcam clip captured a partial rear view of the suspect vehicle slowing near the service lane before rejoining traffic.',
    },
  ],
}

const inferAttachmentKind = (file) => {
  if (!file) {
    return 'document'
  }

  const [category] = (file.type ?? '').split('/')
  return attachmentKindByMime[category] ?? 'document'
}

const formatActivityTime = (value) => new Date(value).toLocaleString('en-NG', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const renderAttachmentPreview = (attachment) => {
  if (attachment.kind === 'photo') {
    return <img alt={attachment.name} className="h-24 w-full rounded-md object-cover" src={attachment.url} />
  }

  if (attachment.kind === 'video') {
    return <video className="h-24 w-full rounded-md bg-stone-950 object-cover" src={attachment.url} controls preload="metadata" />
  }

  if (attachment.kind === 'audio') {
    return <audio className="w-full" src={attachment.url} controls preload="metadata" />
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noreferrer"
      className="flex min-h-24 w-full items-center justify-center rounded-md border border-dashed border-stone-300 bg-stone-100 px-3 text-center text-[11px] font-semibold text-stone-700 dark:border-stone-700 dark:bg-stone-800/40 dark:text-stone-200"
    >
      Open document
    </a>
  )
}

const aiAnalysisByIncidentType = {
  robbery: {
    summary: 'Threat pattern indicates an active violent-property crime with elevated civilian exposure near commercial frontage.',
    recommendations: [
      'Lock down the immediate perimeter and direct civilians into sheltered interior zones.',
      'Prioritize armed police interception with a secondary unit covering escape routes.',
      'Preserve witness statements and nearby CCTV feeds for post-scene evidence handling.',
    ],
  },
  fire: {
    summary: 'Incident profile suggests escalating structural risk with likely smoke migration and secondary casualty exposure.',
    recommendations: [
      'Keep fire suppression units on offensive attack while confirming building evacuation status.',
      'Stage ambulance support outside the hot zone for smoke inhalation triage.',
      'Request utility isolation and prevent public re-entry until heat spread is contained.',
    ],
  },
  theft: {
    summary: 'Current indicators point to a contained property-loss incident with strong value in rapid evidence preservation.',
    recommendations: [
      'Secure the scene boundary and limit disturbance around the last confirmed asset location.',
      'Collect surveillance access, timestamps, and witness movement accounts immediately.',
      'Broadcast suspect or vehicle descriptors to nearby patrol units for area canvassing.',
    ],
  },
  domestic: {
    summary: 'Call details indicate a volatile interpersonal scene with a credible risk of re-escalation and vulnerable persons present.',
    recommendations: [
      'Separate involved parties on arrival and conduct an immediate welfare check on dependants.',
      'Deploy responders trained in de-escalation before considering scene transfer or arrest action.',
      'Document visible injuries, threats, and prior call history for safeguarding follow-up.',
    ],
  },
  kidnapping: {
    summary: 'Narrative indicators suggest a high-priority abduction response requiring rapid route denial, surveillance review, and controlled family liaison.',
    recommendations: [
      'Immediately expand the search grid around the last verified sighting and lock outbound road chokepoints.',
      'Activate surveillance recovery for nearby traffic, fuel station, and school perimeter cameras within the reported timeframe.',
      'Coordinate police and intelligence assets while maintaining a single verified family-contact channel for updates.',
    ],
  },
}

const buildAiAnalysis = (incident) => {
  if (!incident) {
    return null
  }

  const template = aiAnalysisByIncidentType[incident.type] ?? {
    summary: 'AI triage indicates the scene needs continued command oversight while responders stabilize the incident.',
    recommendations: [
      'Maintain command updates until field responders confirm scene stabilization.',
      'Validate caller details and preserve all available evidence from the location.',
      'Prepare follow-up escalation if on-scene conditions deteriorate.',
    ],
  }

  return {
    headline: `${incident.type.charAt(0).toUpperCase()}${incident.type.slice(1)} risk assessment generated from the current incident narrative.`,
    summary: template.summary,
    recommendations: template.recommendations,
  }
}

const IncidentDetails = () => {
  const { incidentId } = useParams()
  const { isDarkMode } = useTheme()
  const incident = useMemo(
    () => incidents.find((item) => item.id === incidentId) ?? null,
    [incidentId],
  )

  const [incidentStatus, setIncidentStatus] = useState(incident?.status ?? 'active')
  const [notes, setNotes] = useState(() => createIncidentNotes(incidentId ?? 'incident'))
  const [activeFeedTab, setActiveFeedTab] = useState('notes')
  const [assetProgressById, setAssetProgressById] = useState({})
  const [roadPathByAssetId, setRoadPathByAssetId] = useState({})
  const [isAiAnalysisLoading, setIsAiAnalysisLoading] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState(() => buildAiAnalysis(incident))
  const [publicFeeds, setPublicFeeds] = useState(() => createPublicFeeds(incidentId ?? 'incident', incident?.type ?? 'incident'))
  const incidentSightings = useMemo(
    () => incidentSightingsById[incidentId] ?? [],
    [incidentId],
  )

  useEffect(() => {
    setIncidentStatus(incident?.status ?? 'active')
  }, [incident])

  useEffect(() => {
    setNotes(createIncidentNotes(incidentId ?? 'incident'))
    setPublicFeeds(createPublicFeeds(incidentId ?? 'incident', incident?.type ?? 'incident'))
    setAssetProgressById({})
    setActiveFeedTab('notes')
  }, [incidentId])

  useEffect(() => {
    setIsAiAnalysisLoading(true)
    setAiAnalysis(null)

    const timer = window.setTimeout(() => {
      setAiAnalysis(buildAiAnalysis(incident))
      setIsAiAnalysisLoading(false)
    }, 2600)

    return () => {
      window.clearTimeout(timer)
    }
  }, [incident])

  const nearbyAssets = useMemo(() => {
    if (!incident) {
      return []
    }

    return allAssets
      .map((asset) => {
        const distance = getSegmentDistance(incident.coordinates, asset.coordinates)
        const shouldDeployInitially = incident.status === 'active' && incident.unitsAssigned.includes(asset.name)
        return {
          ...asset,
          distance,
          status: shouldDeployInitially ? 'deployed' : asset.status,
          deployedIncidentId: shouldDeployInitially ? incident.id : asset.deployedIncidentId,
        }
      })
      .sort((a, b) => a.distance - b.distance)
        .slice(0, 8)
  }, [incident])

  const [assetsState, setAssetsState] = useState([])

  useEffect(() => {
    setAssetsState(nearbyAssets)
  }, [nearbyAssets])

  const deployedAssetRoutes = useMemo(() => {
    if (!incident || incidentStatus !== 'active') {
      return []
    }

    return assetsState
      .filter((asset) => asset.status === 'deployed' && asset.deployedIncidentId === incident.id)
      .map((asset, index) => ({
        asset,
        targetIncident: incident,
        speed: 0.0035 + index * 0.001,
      }))
  }, [assetsState, incident, incidentStatus])

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
          // Keep the temporary simulation path until the real road path is available.
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

  const routeSpeedByAssetId = useMemo(
    () => Object.fromEntries(deployedAssetRoutes.map((route) => {
      const routeDuration = roadPathByAssetId[route.asset.id]?.durationSeconds
      if (!routeDuration || routeDuration <= 0) {
        return [route.asset.id, route.speed]
      }

      const durationBasedSpeed = (SIMULATION_TICK_MS / 1000) / routeDuration
      return [route.asset.id, Math.max(0.0005, Math.min(durationBasedSpeed, route.speed))]
    })),
    [deployedAssetRoutes, roadPathByAssetId],
  )

  useEffect(() => {
    if (deployedAssetRoutes.length === 0 || incidentStatus !== 'active') {
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
  }, [deployedAssetRoutes, incidentStatus, roadPathByAssetId, routeSpeedByAssetId])

  useEffect(() => {
    if (!incident || incidentStatus !== 'active') {
      return
    }

    setAssetsState((previous) => {
      let hasStatusChange = false

      const next = previous.map((asset) => {
        if (asset.status !== 'deployed' || asset.deployedIncidentId !== incident.id) {
          return asset
        }

        const progress = assetProgressById[asset.id] ?? 0
        if (progress < 1) {
          return asset
        }

        hasStatusChange = true
        return {
          ...asset,
          status: 'on site',
        }
      })

      return hasStatusChange ? next : previous
    })
  }, [assetProgressById, incident, incidentStatus])

  const animatedAssets = useMemo(
    () => assetsState.map((asset) => {
      if (!incident || !asset.deployedIncidentId || asset.deployedIncidentId !== incident.id) {
        return {
          ...asset,
          currentCoordinates: asset.coordinates,
          progress: null,
          etaSeconds: null,
        }
      }

      const route = deployedRouteByAssetId[asset.id]
      if (!route) {
        return {
          ...asset,
          currentCoordinates: asset.coordinates,
          progress: null,
          etaSeconds: null,
        }
      }

      const progress = assetProgressById[asset.id] ?? 0
      const roadPath = roadPathByAssetId[asset.id]?.points ?? null
      const simulationPath = roadPath ?? buildFallbackRoutePath(asset.coordinates, route.targetIncident.coordinates)
      const effectiveProgress = roadPath && roadPath.length >= 2 ? progress : 0
      const { point } = getPathPointAndNextIndex(simulationPath, effectiveProgress)
      const routeSpeed = routeSpeedByAssetId[asset.id] ?? route.speed

      return {
        ...asset,
        currentCoordinates: point ?? asset.coordinates,
        progress: effectiveProgress,
        routePath: roadPath,
        simulationPath,
        etaSeconds: roadPath && roadPath.length >= 2 ? getRemainingEtaSeconds(progress, routeSpeed) : null,
      }
    }),
    [assetProgressById, assetsState, deployedRouteByAssetId, incident, roadPathByAssetId, routeSpeedByAssetId],
  )

  const deploymentMeta = useMemo(() => {
    const deployedAssets = animatedAssets.filter((asset) => asset.deployedIncidentId === incident?.id)
    if (deployedAssets.length === 0) {
      return null
    }

    const soonestEta = deployedAssets.reduce((min, asset) => Math.min(min, asset.etaSeconds ?? 0), Number.POSITIVE_INFINITY)
    return {
      allOnSite: deployedAssets.every((asset) => asset.status === 'on site'),
      soonestEtaSeconds: Number.isFinite(soonestEta) ? soonestEta : 0,
      assets: deployedAssets,
    }
  }, [animatedAssets, incident])

  const nearbyDeployableAssets = useMemo(
    () => animatedAssets.filter((asset) => !asset.requiresApproval),
    [animatedAssets],
  )

  const restrictedAssets = useMemo(
    () => animatedAssets.filter((asset) => asset.requiresApproval),
    [animatedAssets],
  )

  const [dispatching, setDispatching] = useState(false)
  const [assetToDispatch, setAssetToDispatch] = useState(null)

  const deployAsset = () => {
    setAssetsState((previous) => previous.map((item) => (
      item.id === assetToDispatch.id
        ? {
          ...item,
          status: item.requiresApproval ? 'awaiting approval' : 'deployed',
          deployedIncidentId: incident.id,
        }
        : item
    )))
    setAssetProgressById((previous) => ({ ...previous, [assetToDispatch.id]: 0 }))
  }

  const startAssetDeployment = (asset) => {
    setAssetToDispatch(asset)
    setTimeout(() => {
      setDispatching(true)
    }, 200)
  }

  const endAssetDeployment = () => {
    setDispatching(false)
    setTimeout(() => {
      setAssetToDispatch(null)
    }, 200)
  }

  const [addingNote, setAddingNote] = useState(false)
  const [sidebarSectionsOpen, setSidebarSectionsOpen] = useState({
    profile: true,
    aiAnalysis: true,
    nearbyAssets: true,
    streetcams: true,
  })

  const toggleSidebarSection = (sectionKey) => {
    setSidebarSectionsOpen((current) => ({
      ...current,
      [sectionKey]: !current[sectionKey],
    }))
  }

  const streetcams = useMemo(() => {
    if (!incident) {
      return []
    }

    return [
      {
        id: `${incident.id}-streetcam-1`,
        name: 'Traffic Cam - Wuse Junction',
        zone: 'North-East Corridor',
      },
      {
        id: `${incident.id}-streetcam-2`,
        name: 'Traffic Cam - Market Overpass',
        zone: 'Central Axis',
      },
      {
        id: `${incident.id}-streetcam-3`,
        name: 'Traffic Cam - Ring Road Access',
        zone: 'Southbound Entry',
      },
    ]
  }, [incident])

  const addNote = ({ text, attachment }) => {
    const normalizedAttachments = attachment?.file
      ? [{
        id: `${incident.id}-note-attachment-${Date.now()}`,
        name: attachment.file.name,
        kind: inferAttachmentKind(attachment.file),
        url: URL.createObjectURL(attachment.file),
      }]
      : []

    setNotes((previous) => ([
      {
        id: `${incident.id}-note-${Date.now()}`,
        author: 'Amina Salisu',
        role: 'Dispatcher',
        text,
        time: new Date().toISOString(),
        attachments: normalizedAttachments,
      },
      ...previous,
    ]))
  }

  const [resolving, setResolving] = useState(false)
  const [escalating, setEscalating] = useState(false)
  const [escalationAuthority, setEscalationAuthority] = useState('')
  const [escalationNote, setEscalationNote] = useState('')
  const [videoStream, setVideoStream] = useState({ shown: false, title: '', url: '' })

  const openVideoStream = (titlePrefix, streamOptions = bodyCamStreamVideoOptions) => {
    const selectedVideo = streamOptions[Math.floor(Math.random() * streamOptions.length)]
    setVideoStream({
      shown: true,
      title: `${titlePrefix} • ${selectedVideo.label}`,
      url: selectedVideo.url,
    })
  }

  const closeVideoStream = () => {
    setVideoStream({ shown: false, title: '', url: '' })
  }

  const resolveIncident = () => {
    setIncidentStatus('resolved')
    setAssetsState((previous) => previous.map((asset) => (
      asset.deployedIncidentId === incident.id ? { ...asset, status: 'ready to deploy', deployedIncidentId: null } : asset
    )))
    setAssetProgressById({})
  }

  const escalateIncident = () => {
    if (!escalationAuthority) {
      return
    }

    setNotes((previous) => ([
      {
        id: `${incident.id}-escalation-${Date.now()}`,
        author: 'Escalation Desk',
        role: 'Escalation',
        text: `Escalated to ${escalationAuthority}.${escalationNote ? ` Note: ${escalationNote}` : ''}`,
        time: new Date().toISOString(),
      },
      ...previous,
    ]))

    setEscalating(false)
    setEscalationAuthority('')
    setEscalationNote('')
  }

  if (!incident) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Incident not found</h1>
        <p className="text-sm text-stone-600 dark:text-stone-300">The incident you requested could not be found.</p>
        <Link
          to="/admin/incidents"
          className="inline-flex rounded-md bg-emerald px-3 py-2 text-sm font-semibold text-stone-900 dark:bg-light-green"
        >
          Back to incidents
        </Link>
      </section>
    )
  }

  return (
    <>
      <section className="space-y-4">
        <div className="flex w-full items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">Incident Details</p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-100">{incident.title}</h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{incident.address}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
              onClick={() => setAddingNote(true)}
            >
              Add a note
            </button>
            <button
              type="button"
              className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:brightness-95"
              onClick={() => {
                setEscalating(true)
              }}
            >
              Escalate Incident
            </button>
            <button
              type="button"
              className="rounded-md bg-emerald px-3 py-2 text-xs font-semibold text-stone-900 transition hover:brightness-95 dark:bg-light-green"
              onClick={() => {
                setResolving(true)
              }}
            >
              Resolve Incident
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-4 xl:flex-row">
          <div className="w-full rounded-lg border border-stone-200 bg-white p-2 dark:border-stone-900/50 dark:bg-stone-900/10 xl:w-2/3">
            <div className="h-155 w-full overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700/60">
              <MapContainer center={incident.coordinates} zoom={MAP_ZOOM} className="h-full w-full">
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                  url={
                    isDarkMode
                      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                  }
                />

                <Marker position={incident.coordinates} icon={buildIncidentIcon(incident.type)}>
                  <Popup minWidth={240}>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{incident.title}</p>
                      <p className="text-xs text-stone-500">{incident.address}</p>
                      <p className="mt-1 text-xs text-stone-700">{incident.description}</p>
                    </div>
                  </Popup>
                </Marker>

                {incidentSightings.map((sighting) => (
                  <React.Fragment key={sighting.id}>
                    <Marker position={sighting.coordinates} icon={buildSightingIcon(sighting.confidence)}>
                      <Popup minWidth={240}>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-stone-900">{sighting.title}</p>
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                              {sighting.confidence} confidence
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">{sighting.location}</p>
                          <p className="mt-1 text-xs text-stone-700">{sighting.details}</p>
                          <p className="mt-2 text-[11px] font-medium text-stone-700">Source: {sighting.source}</p>
                          <p className="text-[11px] text-stone-500">Reported {formatActivityTime(sighting.reportedAt)}</p>
                        </div>
                      </Popup>
                    </Marker>

                    <Circle
                      center={sighting.coordinates}
                      radius={140}
                      pathOptions={{
                        color: sighting.confidence === 'high' ? '#dc2626' : '#f59e0b',
                        fillColor: sighting.confidence === 'high' ? '#dc2626' : '#f59e0b',
                        fillOpacity: 0.08,
                        weight: 1,
                      }}
                    />
                  </React.Fragment>
                ))}

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
                  const traveledPath = displayPath.slice(0, Math.max(1, movingState.nextIndex))
                  const remainingPath = [movingCoordinates, ...displayPath.slice(movingState.nextIndex)]

                  return (
                    <React.Fragment key={`route-${route.asset.id}`}>
                      <Polyline
                        positions={displayPath}
                        pathOptions={{
                          color: '#0ea5e9',
                          weight: 2,
                          dashArray: isRoadPathLoaded ? '8 8' : '4 10',
                          opacity: isRoadPathLoaded ? 0.45 : 0.28,
                        }}
                      />
                      <Polyline
                        positions={traveledPath.length > 1 ? traveledPath : [route.asset.coordinates, movingCoordinates]}
                        pathOptions={{ color: '#2563eb', weight: 3, opacity: 0.9 }}
                      />
                      <Polyline
                        positions={remainingPath.length > 1 ? remainingPath : [movingCoordinates, route.targetIncident.coordinates]}
                        pathOptions={{ color: '#22c55e', weight: 3, opacity: 0.8 }}
                      />
                    </React.Fragment>
                  )
                })}

                {animatedAssets.map((asset) => (
                  <Marker key={asset.id} position={asset.currentCoordinates} icon={buildAssetIcon(asset.status)}>
                    <Popup minWidth={220}>
                      <div>
                        <p className="text-sm font-semibold text-stone-900">{asset.name}</p>
                        <p className="text-xs text-stone-500">{asset.type}</p>
                        <p className="text-xs font-semibold text-stone-800">Status: {asset.status}</p>
                        {asset.deployedIncidentId === incident.id ? (
                          <p className="text-xs text-stone-700">
                            {asset.etaSeconds && asset.etaSeconds > 0 ? `ETA ${formatEta(asset.etaSeconds)}` : 'On Site'}
                          </p>
                        ) : null}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                <Circle
                  center={incident.coordinates}
                  radius={450}
                  pathOptions={{
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.08,
                    weight: 1,
                  }}
                />
              </MapContainer>
            </div>

            <article className="mt-3 rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/50 dark:bg-stone-800/20">
              <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-3 dark:border-stone-700/50">
                <div className="flex items-center gap-2 rounded-lg bg-white p-1 dark:bg-stone-900/30">
                  <button
                    type="button"
                    onClick={() => setActiveFeedTab('notes')}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${activeFeedTab === 'notes' ? 'bg-emerald text-stone-950 dark:bg-light-green' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'}`}
                  >
                    Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFeedTab('publicFeeds')}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${activeFeedTab === 'publicFeeds' ? 'bg-emerald text-stone-950 dark:bg-light-green' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'}`}
                  >
                    Public Feeds
                  </button>
                </div>

                {activeFeedTab === 'notes' ? (
                  <button
                    type="button"
                    onClick={() => setAddingNote(true)}
                    className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                  >
                    Add Note
                  </button>
                ) : null}
              </div>

              {activeFeedTab === 'notes' ? (
                <div className="mt-3 space-y-2">
                  {notes.map((note) => (
                    <div key={note.id} className="rounded-md border border-stone-200 bg-white p-2.5 dark:border-stone-700/40 dark:bg-stone-900/20">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{note.author}</p>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400">{formatActivityTime(note.time)}</p>
                        </div>
                        <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-stone-700 dark:bg-stone-700 dark:text-stone-200">
                          {note.role}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-stone-600 dark:text-stone-300">{note.text}</p>

                      {note.attachments?.length ? (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {note.attachments.map((attachment) => (
                            <div key={attachment.id} className="rounded-md border border-stone-200 bg-stone-50 p-2 dark:border-stone-700/50 dark:bg-stone-800/20">
                              {renderAttachmentPreview(attachment)}
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <p className="text-[11px] font-medium text-stone-800 dark:text-stone-100">{attachment.name}</p>
                                <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-stone-700 dark:bg-stone-700 dark:text-stone-200">
                                  {attachment.kind}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  {publicFeeds.map((feed) => (
                    <div key={feed.id} className="rounded-md border border-stone-200 bg-white p-3 dark:border-stone-700/40 dark:bg-stone-900/20">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-sm font-semibold text-emerald-800 dark:bg-light-green/20 dark:text-light-green">
                          {feed.sender.avatar}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 dark:border-stone-700/40 dark:bg-stone-800/30">
                            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{feed.sender.name}</p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400">{feed.sender.email}</p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400">{feed.sender.phone}</p>
                          </div>

                          <p className="mt-3 text-[11px] text-stone-600 dark:text-stone-300">{feed.text}</p>
                          <p className="mt-2 text-[10px] text-stone-500 dark:text-stone-400">{formatActivityTime(feed.time)}</p>

                          {feed.attachments?.length ? (
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                              {feed.attachments.map((attachment) => (
                                <div key={attachment.id} className="rounded-md border border-stone-200 bg-stone-50 p-2 dark:border-stone-700/50 dark:bg-stone-800/20">
                                  {renderAttachmentPreview(attachment)}
                                  <div className="mt-2 flex items-center justify-between gap-2">
                                    <p className="text-[11px] font-medium text-stone-800 dark:text-stone-100">{attachment.name}</p>
                                    <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-stone-700 dark:bg-stone-700 dark:text-stone-200">
                                      {attachment.kind}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>

          <div className="w-full space-y-3 xl:w-1/3">
            <article className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-900/50 dark:bg-stone-900/10">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Incident Profile</h2>
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${statusTone[incidentStatus] ?? statusTone.active}`}>
                    {incidentStatus}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSidebarSection('profile')}
                    className="rounded-md border border-stone-300 p-1 text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                    aria-label="Toggle incident profile"
                  >
                    <ChevronIcon className={`h-4 w-4 transition-transform ${sidebarSectionsOpen.profile ? '-rotate-90' : 'rotate-0'}`} />
                  </button>
                </div>
              </div>

              {sidebarSectionsOpen.profile ? (
                <>
                  <p className="mt-2 text-xs text-stone-700 dark:text-stone-200">{incident.description}</p>
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

                  {deploymentMeta ? (
                    <div className="mt-3 rounded-md bg-indigo-500/10 px-2 py-2 text-[11px] text-indigo-700 dark:text-indigo-300">
                      {deploymentMeta.allOnSite
                        ? 'Assets On Site'
                        : `Assets Deployed • ETA ${formatEta(deploymentMeta.soonestEtaSeconds)}`}
                    </div>
                  ) : null}

                  <div className="mt-3 grid gap-1 text-[11px] text-stone-600 dark:text-stone-300">
                    <p>
                      Reported by: <span className="font-semibold text-stone-800 dark:text-stone-100">{incident.reportedBy.name}</span>
                    </p>
                    <p>Phone: {incident.reportedBy.phoneNumber}</p>
                    <p>Emergency line: {incident.emergencyContact}</p>
                    <p>
                      Coordinates: {incident.coordinates[0].toFixed(5)}, {incident.coordinates[1].toFixed(5)}
                    </p>
                  </div>
                </>
              ) : null}
            </article>


            {/* AI ANALYSIS */}
            <article className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-400/10 dark:bg-yellow-900/10">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-yellow-950 dark:text-yellow-100">AI Analysis</h2>
                <button
                  type="button"
                  onClick={() => toggleSidebarSection('aiAnalysis')}
                  className="rounded-md border border-yellow-300 p-1 text-yellow-700 transition hover:bg-yellow-100 dark:border-yellow-500/40 dark:text-yellow-200 dark:hover:bg-yellow-900/30"
                  aria-label="Toggle AI analysis"
                >
                  <ChevronIcon className={`h-4 w-4 transition-transform ${sidebarSectionsOpen.aiAnalysis ? '-rotate-90' : 'rotate-0'}`} />
                </button>
              </div>

              {sidebarSectionsOpen.aiAnalysis && isAiAnalysisLoading ? (
                <div className="mt-3 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-yellow-700 dark:text-yellow-300">
                    Processing incident narrative...
                  </p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-yellow-200/80 dark:bg-yellow-100/10">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-yellow-500/70 dark:bg-yellow-300/60" />
                  </div>
                  <p className="text-[11px] text-yellow-800/80 dark:text-yellow-100/70">
                    Reviewing caller report, threat pattern, severity level, and likely responder priorities.
                  </p>
                </div>
              ) : sidebarSectionsOpen.aiAnalysis && aiAnalysis ? (
                <div className="mt-3 space-y-3">
                  <div className="rounded-md border border-yellow-300/80 bg-white/70 px-3 py-2 dark:border-yellow-200/10 dark:bg-stone-900/20">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-yellow-800 dark:text-yellow-200">
                      Assessment
                    </p>
                    <p className="mt-1 text-xs font-medium text-stone-900 dark:text-stone-100">{aiAnalysis.headline}</p>
                    <p className="mt-1 text-[11px] text-stone-700 dark:text-stone-300">{aiAnalysis.summary}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-yellow-800 dark:text-yellow-200">
                      Recommended Next Actions
                    </p>
                    <div className="mt-2 space-y-2">
                      {aiAnalysis.recommendations.map((recommendation, index) => (
                        <div
                          key={`${incident.id}-ai-recommendation-${index + 1}`}
                          className="rounded-md border border-yellow-300/70 bg-white/80 px-3 py-2 text-[11px] text-stone-800 dark:border-yellow-200/10 dark:bg-stone-900/20 dark:text-stone-200"
                        >
                          <span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500/20 text-[10px] font-bold text-yellow-900 dark:bg-yellow-300/20 dark:text-yellow-100">
                            {index + 1}
                          </span>
                          {recommendation}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </article>

            <article className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-900/50 dark:bg-stone-900/10">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Nearby Assets</h2>
                <button
                  type="button"
                  onClick={() => toggleSidebarSection('nearbyAssets')}
                  className="rounded-md border border-stone-300 p-1 text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                  aria-label="Toggle nearby assets"
                >
                  <ChevronIcon className={`h-4 w-4 transition-transform ${sidebarSectionsOpen.nearbyAssets ? '-rotate-90' : 'rotate-0'}`} />
                </button>
              </div>
              {sidebarSectionsOpen.nearbyAssets ? (
                <div className="mt-2 space-y-2">
                  {nearbyDeployableAssets.map((asset) => {
                  const isAssignedHere = asset.deployedIncidentId === incident.id
                  const canDeploy = incidentStatus === 'active' && !isAssignedHere && asset.status !== 'unavailable'
                  const assetCrew = buildAssetPersonnel(asset)

                  return (
                    <div key={asset.id} className={`rounded-md border border-sky-200 px-3 py-2 transition-all dark:border-sky-900/50 dark:bg-stone-800/30 ${isAssignedHere ? 'bg-emerald-50/70 ring-1 ring-emerald-200 dark:ring-emerald-900/50' : 'bg-stone-100'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-xs font-semibold text-stone-800 dark:text-stone-100">{asset.name}</p>
                            {asset.requiresApproval ? (
                              <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-800 dark:border-amber-600/70 dark:bg-amber-900/30 dark:text-amber-200">
                                Requires Approval
                              </span>
                            ) : null}
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">{asset.type}</p>
                          <p className={`text-[11px] font-semibold ${assetStatusTone[asset.status] ?? assetStatusTone['ready to deploy']}`}>
                            {asset.status}
                          </p>
                          {isAssignedHere ? (
                            <p className="text-[11px] text-stone-600 dark:text-stone-300">
                              {asset.etaSeconds && asset.etaSeconds > 0 ? `ETA ${formatEta(asset.etaSeconds)}` : 'On Site'}
                            </p>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          disabled={!canDeploy}
                          onClick={() => {
                            startAssetDeployment(asset)
                          }}
                          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-90 ${asset.status === 'awaiting approval' ? 'bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-200' : 'bg-emerald text-stone-900 hover:brightness-95 dark:bg-light-green'}`}
                        >
                          {asset.status === 'awaiting approval' ? 'Awaiting approval' : isAssignedHere ? 'Deployed' : 'Deploy Asset'}
                        </button>
                      </div>

                      {isAssignedHere ? (
                        <div className="mt-2 rounded-md border border-stone-200 bg-white/80 px-2.5 py-2 dark:border-stone-700 dark:bg-stone-900/30">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-700 dark:text-stone-200">
                            Personnel ({assetCrew.personnel.length})
                          </p>
                          <div className="mt-1.5 space-y-1.5">
                            {assetCrew.personnel.map((member) => (
                              <div key={member.id} className="flex items-center justify-between gap-2 rounded bg-stone-100 px-2 py-1 dark:bg-stone-800/40">
                                <div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <p className="text-[11px] font-semibold text-stone-800 dark:text-stone-100">{member.name}</p>
                                    {member.hasBodyCam ? (
                                      <span className="inline-flex rounded-full border border-sky-300 bg-sky-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sky-800 dark:border-sky-700 dark:bg-sky-900/20 dark:text-sky-200">
                                        Bodycam Enabled
                                      </span>
                                    ) : null}
                                  </div>
                                  <p className="text-[10px] text-stone-500 dark:text-stone-400">{member.role}</p>
                                </div>
                                {member.hasBodyCam ? (
                                  <button
                                    type="button"
                                    onClick={() => openVideoStream(`${member.name} Body Cam`, bodyCamStreamVideoOptions)}
                                    className="rounded-md border border-sky-300 bg-sky-50 px-2 py-1 text-[10px] font-semibold text-sky-800 transition hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-900/20 dark:text-sky-200"
                                  >
                                    Stream video
                                  </button>
                                ) : null}
                              </div>
                            ))}
                          </div>

                          {assetCrew.drone ? (
                            <div className="mt-2 flex items-center justify-between rounded border border-indigo-200 bg-indigo-50 px-2.5 py-2 dark:border-indigo-700/50 dark:bg-indigo-900/20">
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-200">{assetCrew.drone.name}</p>
                                  <span className="inline-flex rounded-full border border-indigo-300 bg-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-800 dark:border-indigo-500 dark:bg-indigo-900/40 dark:text-indigo-200">
                                    Video Enabled
                                  </span>
                                </div>
                                <p className="text-[10px] text-indigo-700 dark:text-indigo-300">ID: {assetCrew.drone.serial}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => openVideoStream(`${assetCrew.drone.name} Feed`, droneStreamVideoOptions)}
                                className="rounded-md border border-indigo-300 bg-white px-2 py-1 text-[10px] font-semibold text-indigo-800 transition hover:bg-indigo-100 dark:border-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200"
                              >
                                Stream video
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  )
                  })}

                  {restrictedAssets.length ? (
                    <div className="mt-4 space-y-2 rounded-md border border-amber-200 bg-amber-50/70 p-2.5 dark:border-amber-700/30 dark:bg-amber-900/10">
                      <div>
                        <p className="text-xs font-semibold text-amber-900 dark:text-amber-100">Restricted Assets</p>
                        <p className="text-[11px] text-amber-700 dark:text-amber-300">
                          These assets are available for deployment but require command approval before field activation.
                        </p>
                      </div>

                      {restrictedAssets.map((asset) => {
                        const isAssignedHere = asset.deployedIncidentId === incident.id
                        const canDeploy = incidentStatus === 'active' && !isAssignedHere && asset.status !== 'unavailable'

                        return (
                          <div key={asset.id} className="rounded-md border border-amber-200 bg-white px-3 py-2 dark:border-amber-700/30 dark:bg-stone-900/20">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-xs font-semibold text-stone-800 dark:text-stone-100">{asset.name}</p>
                                  <span className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-800 dark:border-amber-600/70 dark:bg-amber-900/30 dark:text-amber-200">
                                    Approval Required
                                  </span>
                                </div>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400">{asset.type}</p>
                                <p className={`text-[11px] font-semibold ${assetStatusTone[asset.status] ?? assetStatusTone['ready to deploy']}`}>
                                  {asset.status}
                                </p>
                              </div>

                              <button
                                type="button"
                                disabled={!canDeploy}
                                onClick={() => {
                                  startAssetDeployment(asset)
                                }}
                                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-90 ${asset.status === 'awaiting approval' ? 'bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-200' : 'bg-emerald text-stone-900 hover:brightness-95 dark:bg-light-green'}`}
                              >
                                {asset.status === 'awaiting approval' ? 'Awaiting approval' : isAssignedHere ? 'Deployed' : 'Deploy Asset'}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>

            <article className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-900/50 dark:bg-stone-900/10">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Streetcams in the Vicinity</h2>
                <button
                  type="button"
                  onClick={() => toggleSidebarSection('streetcams')}
                  className="rounded-md border border-stone-300 p-1 text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                  aria-label="Toggle streetcams"
                >
                  <ChevronIcon className={`h-4 w-4 transition-transform ${sidebarSectionsOpen.streetcams ? '-rotate-90' : 'rotate-0'}`} />
                </button>
              </div>

              {sidebarSectionsOpen.streetcams ? (
                <div className="mt-2 space-y-2">
                  {streetcams.map((camera) => (
                    <div key={camera.id} className="rounded-md border border-sky-200 bg-stone-100 px-3 py-2 dark:border-sky-900/50 dark:bg-stone-800/30">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-xs font-semibold text-stone-800 dark:text-stone-100">{camera.name}</p>
                            <span className="inline-flex rounded-full border border-indigo-300 bg-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-indigo-800 dark:border-indigo-500 dark:bg-indigo-900/40 dark:text-indigo-200">
                              Video Enabled
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">{camera.zone}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => openVideoStream(`${camera.name} Stream`, streetCamStreamVideoOptions)}
                          className="rounded-md border border-indigo-300 bg-white px-2 py-1 text-[10px] font-semibold text-indigo-800 transition hover:bg-indigo-100 dark:border-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200"
                        >
                          Stream video
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </section>

      <ModalDialog
        shown={dispatching}
        closeFunction={()=>{endAssetDeployment()}}
        dialogTitle={`Deploy ${assetToDispatch?.name} to this incident`}
        maxWidthClass={`max-w-lg`}
      >
        <DeployAsset
          doDeploy={deployAsset}
          asset={assetToDispatch}
          close={endAssetDeployment}
        />
      </ModalDialog>

      <ModalDialog
        shown={addingNote}
        closeFunction={()=>{setAddingNote(false)}}
        dialogTitle={`Add a note for this incident`}
        maxWidthClass={`max-w-lg`}
      >
        <AddIncidentNote
          doAddNote={(note)=>{addNote(note)}}
          asset={assetToDispatch}
          close={()=>{setAddingNote(false)}}
        />
      </ModalDialog>

      <ModalDialog
        shown={resolving}
        closeFunction={()=>{setResolving(false)}}
        dialogTitle={`Resolve this incident`}
        maxWidthClass={`max-w-lg`}
      >
        <ResolveIncident 
          doResolve={()=>{resolveIncident()}}
          close={()=>{setResolving(false)}}
        />
      </ModalDialog>

      <ModalDialog
        shown={escalating}
        closeFunction={() => {
          setEscalating(false)
        }}
        dialogTitle={`Escalate incident`}
        maxWidthClass={`max-w-lg`}
      >
        <div className="space-y-4">
          <AutocompleteSelect
            inputLabel="Escalation authority"
            selectOptions={escalationAuthorities.map((authority) => ({ title: authority, value: authority }))}
            titleField="title"
            preSelected={escalationAuthority}
            preSelectedLabel="value"
            placeholderText="Select authority"
            returnFieldValue={(value) => setEscalationAuthority(value.value)}
          />

          <TextareaField
            fieldId="escalation-note"
            inputLabel="Escalation note"
            inputPlaceholder="Add an escalation reason or operational note"
            preloadValue={escalationNote}
            returnFieldValue={(value) => setEscalationNote(value)}
          />

          <div className="flex justify-end">
            <div className="w-40">
              <FormButton
                buttonLabel="Escalate"
                buttonAction={escalateIncident}
                disabled={!escalationAuthority}
              />
            </div>
          </div>
        </div>
      </ModalDialog>

      <ModalDialog
        shown={videoStream.shown}
        closeFunction={closeVideoStream}
        dialogTitle={videoStream.title || 'Live Stream'}
        maxWidthClass={`max-w-3xl`}
      >
        <div className="space-y-3">
          <p className="text-xs text-stone-600 dark:text-stone-300 pb-4">
            Live stream feed from field hardware.
          </p>
          {videoStream.url ? (
            <div className="overflow-hidden rounded-lg border border-stone-200 bg-black dark:border-stone-700">
              <video
                key={videoStream.url}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="h-full max-h-[60vh] w-full"
              >
                <source src={videoStream.url} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-4 text-xs text-stone-600 dark:border-stone-700 dark:bg-stone-900/30 dark:text-stone-300">
              No video stream source available.
            </div>
          )}
        </div>
      </ModalDialog>
    </>
  )
}

export default IncidentDetails