export const ASSET_TYPES = [
  'CCTV Dome Camera',
  'PTZ Camera',
  'Bullet Camera',
  'Thermal Camera',
  'License Plate Reader',
  'Audio Intercom',
  'Alarm Siren',
  'Motion Detector',
  'Access Control Panel',
  'Smart Lock',
  'Radar Sensor',
  'Edge Gateway',
  'Network Video Recorder',
  'Environmental Sensor',
  'Panic Button',
  'Perimeter Beam',
  'Smart Floodlight',
  'Security Drone',
]

export const BRANDS = [
  'Axis Communications',
  'Hikvision',
  'Dahua',
  'Bosch',
  'Hanwha Vision',
  'Honeywell',
  'Ubiquiti',
  'Cisco',
  'Motorola Solutions',
  'Ajax Systems',
]

export const LOCATIONS = [
  { name: 'Gatehouse North', coordinates: [9.08472, 7.47821] },
  { name: 'Gatehouse South', coordinates: [9.08124, 7.47612] },
  { name: 'Perimeter West', coordinates: [9.08391, 7.47155] },
  { name: 'Perimeter East', coordinates: [9.08316, 7.48284] },
  { name: 'Command Center', coordinates: [9.07987, 7.47588] },
  { name: 'Parking Deck', coordinates: [9.07732, 7.48073] },
  { name: 'Server Room', coordinates: [9.08041, 7.47429] },
  { name: 'Loading Bay', coordinates: [9.07685, 7.47381] },
  { name: 'Lobby Entrance', coordinates: [9.08196, 7.47904] },
  { name: 'Roof Access', coordinates: [9.08253, 7.47527] },
  { name: 'Warehouse Aisle 3', coordinates: [9.07598, 7.47042] },
  { name: 'Substation Yard', coordinates: [9.08641, 7.47236] },
]

export const STATUSES = ['Active', 'Decommissioned', 'Under Maintenance', 'Standby', 'Deployed']

export const TYPE_PROFILES = {
  'CCTV Dome Camera': {
    category: 'Surveillance',
    cameraEnabled: true,
    soundEnabled: false,
    videoEnabled: true,
    models: ['Dome 4MP Pro', 'SecureView S4', 'Nexa Dome 360'],
    mediaType: 'video',
  },
  'PTZ Camera': {
    category: 'Surveillance',
    cameraEnabled: true,
    soundEnabled: false,
    videoEnabled: true,
    models: ['PanTrack X9', 'ZoomGuard PTZ', 'SkyPivot 4K'],
    mediaType: 'video',
  },
  'Bullet Camera': {
    category: 'Surveillance',
    cameraEnabled: true,
    soundEnabled: false,
    videoEnabled: true,
    models: ['LineSight B3', 'HawkEye Bullet', 'Perimeter Bullet 8'],
    mediaType: 'video',
  },
  'Thermal Camera': {
    category: 'Surveillance',
    cameraEnabled: true,
    soundEnabled: false,
    videoEnabled: true,
    models: ['ThermoGuard T2', 'HeatScan Pro', 'InfraTrack 6'],
    mediaType: 'video',
  },
  'License Plate Reader': {
    category: 'Analytics',
    cameraEnabled: true,
    soundEnabled: false,
    videoEnabled: true,
    models: ['PlateSense LPR', 'RoadScan AX', 'AutoTag Vision'],
    mediaType: 'image',
  },
  'Audio Intercom': {
    category: 'Communications',
    cameraEnabled: false,
    soundEnabled: true,
    videoEnabled: false,
    models: ['TalkBack T1', 'VoiceLink Entry', 'SecureSpeak 2'],
    mediaType: 'audio',
  },
  'Alarm Siren': {
    category: 'Alarm',
    cameraEnabled: false,
    soundEnabled: true,
    videoEnabled: false,
    models: ['AlertHorn 120', 'SonicGuard S', 'Perimeter Siren X'],
    mediaType: 'audio',
  },
  'Motion Detector': {
    category: 'Detection',
    cameraEnabled: false,
    soundEnabled: false,
    videoEnabled: false,
    models: ['MotionSense M2', 'ZoneWatch Motion', 'Passive IR 8'],
    mediaType: 'image',
  },
  'Access Control Panel': {
    category: 'Access Control',
    cameraEnabled: false,
    soundEnabled: false,
    videoEnabled: false,
    models: ['AccessCore 16', 'EntryHub X', 'SecurePass Panel'],
    mediaType: 'image',
  },
  'Smart Lock': {
    category: 'Access Control',
    cameraEnabled: false,
    soundEnabled: false,
    videoEnabled: false,
    models: ['LockLine S2', 'DoorShield Smart', 'LatchPro 500'],
    mediaType: 'image',
  },
  'Radar Sensor': {
    category: 'Detection',
    cameraEnabled: false,
    soundEnabled: false,
    videoEnabled: false,
    models: ['RadarSense R1', 'EdgeRadar X', 'Perimeter Radar 3'],
    mediaType: 'image',
  },
  'Edge Gateway': {
    category: 'IoT',
    cameraEnabled: false,
    soundEnabled: false,
    videoEnabled: false,
    models: ['Gateway Core G7', 'SecureEdge 2', 'LinkBridge Gateway'],
    mediaType: 'image',
  },
  'Network Video Recorder': {
    category: 'Recording',
    cameraEnabled: false,
    soundEnabled: false,
    videoEnabled: true,
    models: ['NVR Vault 16', 'StreamStore S8', 'VisionRack NVR'],
    mediaType: 'video',
  },
  'Environmental Sensor': {
    category: 'IoT',
    cameraEnabled: false,
    soundEnabled: false,
    videoEnabled: false,
    models: ['EnviroSense E3', 'AirTrack Sensor', 'Climate Node 5'],
    mediaType: 'image',
  },
  'Panic Button': {
    category: 'Alarm',
    cameraEnabled: false,
    soundEnabled: false,
    videoEnabled: false,
    models: ['RapidAlert P1', 'HelpCall Button', 'Silent Alarm Node'],
    mediaType: 'audio',
  },
  'Perimeter Beam': {
    category: 'Detection',
    cameraEnabled: false,
    soundEnabled: false,
    videoEnabled: false,
    models: ['BeamShield B6', 'FenceLine Beam', 'Boundary Alert'],
    mediaType: 'image',
  },
  'Smart Floodlight': {
    category: 'Lighting',
    cameraEnabled: false,
    soundEnabled: false,
    videoEnabled: false,
    models: ['LightGuard 10', 'Perimeter Glow', 'SecureBeam Smart'],
    mediaType: 'image',
  },
  'Security Drone': {
    category: 'Aerial Surveillance',
    cameraEnabled: true,
    soundEnabled: true,
    videoEnabled: true,
    models: ['AeroGuard X1', 'SkyPatrol 4K', 'ReconWing S'],
    mediaType: 'video',
  },
}

export const ASSET_STORAGE_KEY = 'isnas-assets-created'

export const readStoredAssets = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(ASSET_STORAGE_KEY)
    const parsedValue = rawValue ? JSON.parse(rawValue) : []

    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export const writeStoredAssets = (assets) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ASSET_STORAGE_KEY, JSON.stringify(assets))
}

export const createInitialAssetForm = () => ({
  name: '',
  type: ASSET_TYPES[0],
  brand: BRANDS[0],
  model: '',
  serialNumber: '',
  location: LOCATIONS[0].name,
  status: STATUSES[0],
  cameraEnabled: true,
  soundEnabled: false,
  videoEnabled: true,
})

const resolveLocation = (index) => LOCATIONS[index % LOCATIONS.length]

export const createSeedAssets = () => {
  return Array.from({ length: 54 }, (_, index) => {
    const type = ASSET_TYPES[index % ASSET_TYPES.length]
    const brand = BRANDS[index % BRANDS.length]
    const location = resolveLocation(index)
    const status = index % 9 === 0 ? 'Decommissioned' : index % 7 === 0 ? 'Under Maintenance' : index % 5 === 0 ? 'Standby' : index % 4 === 0 ? 'Deployed' : 'Active'
    const profile = TYPE_PROFILES[type]
    const model = profile.models[index % profile.models.length]
    const installedDate = new Date(2022 + (index % 3), (index * 2) % 12, ((index * 4) % 27) + 1)
    const lastServiceDate = new Date(installedDate)
    lastServiceDate.setMonth(lastServiceDate.getMonth() + 6 + (index % 5))
    const deploymentDate = new Date(installedDate)
    deploymentDate.setDate(deploymentDate.getDate() + 3 + (index % 9))
    const deploymentHistory = [
      {
        date: installedDate.toISOString(),
        event: 'Installed',
        location: location.name,
        status: 'Active',
        notes: 'Initial commissioning recorded in the registry.',
      },
      {
        date: deploymentDate.toISOString(),
        event: status === 'Decommissioned' ? 'Retired' : status === 'Under Maintenance' ? 'Maintenance check' : 'Deployment',
        location: location.name,
        status,
        notes: status === 'Decommissioned' ? 'Asset retired from operational use.' : 'Asset assigned to current operational point.',
      },
    ]

    if (lastServiceDate.getTime() > installedDate.getTime()) {
      deploymentHistory.push({
        date: lastServiceDate.toISOString(),
        event: 'Service visit',
        location: location.name,
        status: 'Under Maintenance',
        notes: 'Preventive maintenance completed and logged.',
      })
    }

    return {
      id: `AST-${(index + 1).toString().padStart(4, '0')}`,
      name: `${brand.split(' ')[0]} ${type.split(' ').slice(0, 2).join(' ')} ${index + 1}`,
      type,
      brand,
      model,
      serialNumber: `SN-${2025 + index}-${(76000 + index * 37)}`,
      location: location.name,
      currentLocation: location.name,
      currentCoordinates: location.coordinates,
      status,
      cameraEnabled: profile.cameraEnabled,
      soundEnabled: profile.soundEnabled || index % 4 === 0,
      videoEnabled: profile.videoEnabled || index % 3 === 0,
      installedDate,
      lastServiceDate,
      zone: `${profile.category} Zone ${((index % 4) + 1).toString()}`,
      firmwareVersion: `v${2 + (index % 4)}.${(index * 3) % 10}.${(index * 7) % 10}`,
      ipAddress: `10.24.${(index % 8) + 10}.${(index * 11) % 254 || 1}`,
      mediaType: profile.mediaType,
      deploymentHistory,
    }
  })
}
