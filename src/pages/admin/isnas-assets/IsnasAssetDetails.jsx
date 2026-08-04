import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ModalDialog from '../../../components/layouts/ModalDialog'
import CameraIcon from '../../../components/elements/icons/CameraIcon'
import AudioIcon from '../../../components/elements/icons/AudioIcon'
import VideoIcon from '../../../components/elements/icons/VideoIcon'
import {
  TYPE_PROFILES,
  createSeedAssets,
  readStoredAssets,
  writeStoredAssets,
} from './isnasAssetData'
import { useTheme } from '../../../context/ThemeContext'

const MAP_ZOOM = 18

const buildAssetIcon = (status) => {
  const tone = {
    Active: '#10b981',
    Deployed: '#0ea5e9',
    Standby: '#78716c',
    'Under Maintenance': '#f59e0b',
    Decommissioned: '#ef4444',
  }[status] || '#10b981'

  return L.divIcon({
    className: 'asset-marker',
    html: `<div style="width:18px;height:18px;border-radius:999px;background:${tone};border:3px solid white;box-shadow:0 0 0 6px rgba(255,255,255,0.2);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

const createMediaSource = (asset) => {
  const profile = TYPE_PROFILES[asset.type] || {}
  const mediaType = asset.mediaType || profile.mediaType || 'image'

  if (mediaType === 'video') {
    return {
      mediaType,
      title: `${asset.name} live video stream`,
      source: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      poster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    }
  }

  if (mediaType === 'audio') {
    return {
      mediaType,
      title: `${asset.name} live audio feed`,
      source: 'https://interactive-examples.mdn.mozilla.net/media/examples/t-rex-roar.mp3',
    }
  }

  return {
    mediaType: 'image',
    title: `${asset.name} still capture`,
    source: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
  }
}

const formatDate = (value) => {
  if (!value) {
    return 'N/A'
  }

  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

const formatTimelineDate = (value) => new Intl.DateTimeFormat('en-NG', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(value))

const IsnasAssetDetails = () => {
  const { assetId } = useParams()
  const { isDarkMode } = useTheme()
  const [showStreamModal, setShowStreamModal] = useState(false)
  const [assetState, setAssetState] = useState(null)

  const assetRecord = useMemo(() => {
    const seedAssets = createSeedAssets()
    const storedAssets = readStoredAssets()
    const storedAssetMap = new Map(storedAssets.map((asset) => [asset.id, asset]))
    const mergedAssets = seedAssets.map((asset) => storedAssetMap.get(asset.id) || asset)
    const customAssets = storedAssets.filter((asset) => !seedAssets.some((seedAsset) => seedAsset.id === asset.id))

    return [...customAssets, ...mergedAssets].find((asset) => asset.id === assetId) || null
  }, [assetId])

  useEffect(() => {
    setAssetState(assetRecord)
  }, [assetRecord])

  const asset = assetState || assetRecord
  const media = asset ? createMediaSource(asset) : null

  const statusTone = {
    Active: 'bg-emerald/15 text-emerald',
    Deployed: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    Standby: 'bg-stone-300/40 text-stone-700 dark:bg-stone-700/50 dark:text-stone-200',
    'Under Maintenance': 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Decommissioned: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
  }

  const capabilityTone = (value) => (value ? 'bg-emerald/15 text-emerald dark:text-light-green' : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300')

  const deploymentHistory = useMemo(() => {
    if (asset?.deploymentHistory?.length) {
      return asset.deploymentHistory
    }

    return [
      {
        date: asset?.installedDate,
        event: 'Installed',
        location: asset?.currentLocation,
        status: 'Active',
        notes: 'Initial commissioning recorded in the registry.',
      },
      {
        date: asset?.deployedAt || asset?.installedDate,
        event: asset?.status === 'Deployed' ? 'Deployed' : 'Current location assigned',
        location: asset?.currentLocation,
        status: asset?.status,
        notes: asset?.status === 'Deployed' ? 'Asset is currently deployed at this site.' : 'Asset is registered at its present site.',
      },
      ...(asset?.lastServiceDate ? [{
        date: asset.lastServiceDate,
        event: 'Service visit',
        location: asset?.currentLocation,
        status: 'Under Maintenance',
        notes: 'Preventive maintenance completed and logged.',
      }] : []),
    ].filter((entry) => entry.date)
  }, [asset])

  const deployAsset = () => {
    if (!asset || asset.status === 'Deployed') {
      return
    }

    const updatedAsset = {
      ...asset,
      status: 'Deployed',
      deployedAt: new Date().toISOString(),
      deploymentHistory: [
        ...(asset.deploymentHistory || []),
        {
          date: new Date().toISOString(),
          event: 'Deployed',
          location: asset.currentLocation,
          status: 'Deployed',
          notes: 'Deployment triggered from the asset details page.',
        },
      ],
    }

    const storedAssets = readStoredAssets()
    const nextStoredAssets = [
      updatedAsset,
      ...storedAssets.filter((existingAsset) => existingAsset.id !== updatedAsset.id),
    ]

    writeStoredAssets(nextStoredAssets)
    setAssetState(updatedAsset)
  }

  if (!asset) {
    return (
      <section className="space-y-4 rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Asset not found</p>
        <p className="text-sm text-stone-600 dark:text-stone-300">The selected asset could not be resolved from the registry.</p>
        <Link to="/admin/isnas-assets" className="inline-flex rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald/90 dark:bg-light-green dark:text-stone-900">
          Back to assets
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-emerald dark:text-light-green">ISNAS Assets</p>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">{asset.name}</h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            Detailed record for the security device, including location, capabilities, service data, and live media stream access.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/isnas-assets"
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
          >
            Back to assets
          </Link>
          <button
            type="button"
            onClick={() => setShowStreamModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald/90 dark:bg-light-green dark:text-stone-900"
          >
            {media?.mediaType === 'audio' ? <AudioIcon className="h-4 w-4" /> : media?.mediaType === 'video' ? <VideoIcon className="h-4 w-4" /> : <CameraIcon className="h-4 w-4" />}
            Stream {media?.mediaType || 'media'}
          </button>
          <button
            type="button"
            onClick={deployAsset}
            disabled={asset.status === 'Deployed'}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition enabled:hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:text-stone-200 dark:enabled:hover:bg-stone-900/40"
          >
            {asset.status === 'Deployed' ? 'Already deployed' : 'Deploy asset'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Asset ID</p>
          <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">{asset.id}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Current status</p>
          <h3 className={`mt-2 inline-flex rounded-full px-2 py-1 text-sm font-semibold ${statusTone[asset.status] || statusTone.Active}`}>{asset.status}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Current location</p>
          <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100">{asset.currentLocation}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Media type</p>
          <h3 className="mt-2 text-lg font-semibold text-stone-900 dark:text-stone-100 capitalize">{media?.mediaType}</h3>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4">
          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Current location map</h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">Leaflet pinpoint for the device’s present deployment position.</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusTone[asset.status] || statusTone.Active}`}>{asset.status}</span>
            </div>

            <div className="h-105 overflow-hidden rounded-xl border border-stone-200 dark:border-stone-700/60">
              <MapContainer center={asset.currentCoordinates} zoom={MAP_ZOOM} className="h-full w-full">
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                  url={
                    isDarkMode
                      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                  }
                />
                <Marker position={asset.currentCoordinates} icon={buildAssetIcon(asset.status)}>
                  <Popup minWidth={220}>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{asset.name}</p>
                      <p className="text-xs text-stone-500">{asset.currentLocation}</p>
                      <p className="mt-1 text-xs text-stone-700">{asset.type} • {asset.brand}</p>
                    </div>
                  </Popup>
                </Marker>
                <Circle
                  center={asset.currentCoordinates}
                  radius={120}
                  pathOptions={{
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.08,
                    weight: 1,
                  }}
                />
              </MapContainer>
            </div>
          </article>

          <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Deployment history</h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">Timeline of installation, deployment, and maintenance events for this asset.</p>
              </div>
              <span className="rounded-full bg-emerald/15 px-2 py-1 text-xs font-semibold text-emerald dark:text-light-green">{deploymentHistory.length} events</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                    <th className="px-2 py-2">Date</th>
                    <th className="px-2 py-2">Event</th>
                    <th className="px-2 py-2">Location</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {deploymentHistory.map((entry, index) => (
                    <tr key={`${entry.event}-${index}`} className="border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20">
                      <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{formatTimelineDate(entry.date)}</td>
                      <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{entry.event}</td>
                      <td className="px-2 py-3 text-stone-700 dark:text-stone-200">{entry.location}</td>
                      <td className="px-2 py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[entry.status] || statusTone.Active}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{entry.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>

        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <h2 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Asset details</h2>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Everything available from the current registry entry.</p>

          <div className="mt-4 grid gap-3">
            <div className="rounded-lg border border-stone-200 p-3 dark:border-stone-800">
              <p className="text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">Type / category</p>
              <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{asset.type}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{TYPE_PROFILES[asset.type]?.category || 'Asset'}</p>
            </div>
            <div className="rounded-lg border border-stone-200 p-3 dark:border-stone-800">
              <p className="text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">Brand / model</p>
              <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{asset.brand}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{asset.model}</p>
            </div>
            <div className="rounded-lg border border-stone-200 p-3 dark:border-stone-800">
              <p className="text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">Serial / IP</p>
              <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{asset.serialNumber}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{asset.ipAddress}</p>
            </div>
            <div className="rounded-lg border border-stone-200 p-3 dark:border-stone-800">
              <p className="text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">Zone / location</p>
              <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{asset.zone}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{asset.currentLocation}</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className={`rounded-lg px-3 py-3 text-center text-xs font-semibold ${capabilityTone(asset.cameraEnabled)}`}>
                <CameraIcon className="mx-auto mb-1 h-4 w-4" />
                Camera
              </div>
              <div className={`rounded-lg px-3 py-3 text-center text-xs font-semibold ${capabilityTone(asset.soundEnabled)}`}>
                <AudioIcon className="mx-auto mb-1 h-4 w-4" />
                Sound
              </div>
              <div className={`rounded-lg px-3 py-3 text-center text-xs font-semibold ${capabilityTone(asset.videoEnabled)}`}>
                <VideoIcon className="mx-auto mb-1 h-4 w-4" />
                Video
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-stone-200 p-3 dark:border-stone-800">
                <p className="text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">Installed</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{formatDate(asset.installedDate)}</p>
              </div>
              <div className="rounded-lg border border-stone-200 p-3 dark:border-stone-800">
                <p className="text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">Last service</p>
                <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{formatDate(asset.lastServiceDate)}</p>
              </div>
            </div>
            <div className="rounded-lg border border-stone-200 p-3 dark:border-stone-800">
              <p className="text-[11px] uppercase tracking-wide text-stone-500 dark:text-stone-400">Firmware</p>
              <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{asset.firmwareVersion}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{asset.mediaType?.toUpperCase()} media supported</p>
            </div>
          </div>
        </article>
      </div>

      <ModalDialog
        shown={showStreamModal}
        closeFunction={() => setShowStreamModal(false)}
        dialogTitle={`${asset.name} stream`}
        maxWidthClass="max-w-4xl"
      >
        <div className="space-y-4">
          <p className="text-sm text-stone-600 dark:text-stone-300">Streaming {media?.mediaType} feed for the asset’s current capability profile.</p>

          {media?.mediaType === 'video' && (
            <video controls autoPlay muted playsInline className="w-full rounded-xl border border-stone-200 bg-black dark:border-stone-800" poster={media.poster}>
              <source src={media.source} type="video/mp4" />
            </video>
          )}

          {media?.mediaType === 'audio' && (
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900/30">
              <p className="mb-3 text-sm font-semibold text-stone-900 dark:text-stone-100">Audio stream active</p>
              <audio controls autoPlay className="w-full">
                <source src={media.source} type="audio/mpeg" />
              </audio>
            </div>
          )}

          {media?.mediaType === 'image' && (
            <div className="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800">
              <img src={media.source} alt={media.title} className="h-auto w-full object-cover" />
            </div>
          )}
        </div>
      </ModalDialog>
    </section>
  )
}

export default IsnasAssetDetails