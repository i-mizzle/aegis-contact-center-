import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RadioGroup from '../../form/RadioGroup';
import TextField from '../../form/TextField';
import TextareaField from '../../form/TextareaField';
import SelectField from '../../form/SelectField';
import FormButton from '../../form/FormButton';
import AutocompleteSelect from '../../form/AutocompleteSelect';

const modeOptions = [
  {
    label: 'Provide incident details',
    description: 'You will be presented with the form to enter the incident, address, and caller details manually.',
    value: 'manual',
  },
  {
    label: 'Record from call',
    description: 'The incident will be created from the connected call while the system locates the caller and fetches registration data.',
    value: 'call',
  },
]

const incidentTypes = [
  { title: 'Robbery', value: 'robbery' },
  { title: 'Fire', value: 'fire' },
  { title: 'Theft', value: 'theft' },
  { title: 'Domestic disturbance', value: 'domestic' },
]

const severityOptions = [
  { title: 'Critical', value: 'critical' },
  { title: 'High', value: 'high' },
  { title: 'Medium', value: 'medium' },
  { title: 'Low', value: 'low' },
]

const activeIncidentChoices = ['inc-abuja-001', 'inc-abuja-002', 'inc-abuja-003', 'inc-abuja-004']

const callSimulationSteps = [
  {
    id: 'location',
    label: 'Locating call',
    description: 'Located - Aminu Kano Crescent, Wuse 2, Abuja',
  },
  {
    id: 'registration',
    label: 'Fetching phone registration',
    description: 'Aisha Sule | +234 803 442 1199 | aisha.sule@example.com | NIN: 22334455678',
  },
  {
    id: 'transcription',
    label: 'Transcribing live call',
    description: 'Caller reports an armed robbery in progress near a pharmacy and says the suspects are fleeing eastbound.',
  },
]

const transcriptSeed = [
  'Operator: Contact center, please stay on the line. I am connecting to your location.',
  'Caller: I am near a pharmacy and the suspects are still in the area.',
  'Operator: Understood. Keep calm and describe what you can see from where you are now.',
  'Caller: One suspect is carrying a bag and another is crossing toward the main road.',
]

const emptyManualForm = {
  incidentTitle: '',
  incidentType: '',
  severity: '',
  address: '',
  landmark: '',
  callerName: '',
  callerPhone: '',
  callerEmail: '',
  nin: '',
  incidentSummary: '',
  dispatchNotes: '',
}

const emptyCallForm = {
  callId: '',
  locatedAddress: '',
  callerName: '',
  callerPhone: '',
  callerEmail: '',
  nin: '',
  transcriptNotes: '',
}

const initialTranscriptPrompt = 'Waiting for the live transcript to begin...'

const nonEnglishSourceLanguages = [
  'Hausa',
  'Yoruba',
  'Igbo',
  'Fulfulde',
  'Pidgin',
  'Kanuri',
]

const buildTranscriptSourceNotice = () => {
  const isRecordedInEnglish = Math.random() < 0.35

  if (isRecordedInEnglish) {
    return {
      text: 'Call recorded in English',
      tone: 'neutral',
    }
  }

  const randomLanguage = nonEnglishSourceLanguages[Math.floor(Math.random() * nonEnglishSourceLanguages.length)]

  return {
    text: `Translating from ${randomLanguage}`,
    tone: 'translation',
  }
}

const RecordNewIncident = ({ isOpen = false }) => {
  const navigate = useNavigate()
  const timersRef = useRef([])

  const [selectedMode, setSelectedMode] = useState(null)
  const [manualForm, setManualForm] = useState(emptyManualForm)
  const [callForm, setCallForm] = useState(emptyCallForm)
  const [callStageIndex, setCallStageIndex] = useState(0)
  const [isLocationComplete, setIsLocationComplete] = useState(false)
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false)
  const [isCallRunning, setIsCallRunning] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcriptLines, setTranscriptLines] = useState([])
  const [statusText, setStatusText] = useState('')
  const [transcriptSourceNotice, setTranscriptSourceNotice] = useState(buildTranscriptSourceNotice)

  const selectedActiveIncidentId = activeIncidentChoices[0]

  useEffect(() => {
    if (selectedMode && selectedMode.value !== 'call') {
      return undefined
    }

    setCallStageIndex(0)
    setIsLocationComplete(false)
    setIsRegistrationComplete(false)
    setTranscriptLines([])
    setIsCallRunning(true)
    setIsRecording(false)
    setStatusText('')
    setCallForm({ ...emptyCallForm })

    timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
    timersRef.current = []

    const locationTimer = window.setTimeout(() => {
      setCallStageIndex(1)
      setIsLocationComplete(true)
      setCallForm((current) => ({
        ...current,
        callId: 'CALL-2041-19',
        locatedAddress: 'Aminu Kano Crescent, Wuse 2, Abuja',
      }))
    }, 3000)

    const registrationTimer = window.setTimeout(() => {
      setCallStageIndex(2)
      setIsRegistrationComplete(true)
      setCallForm((current) => ({
        ...current,
        callerName: 'Aisha Sule',
        callerPhone: '+234 803 442 1199',
        callerEmail: 'aisha.sule@example.com',
        nin: '22334455678',
      }))
    }, 5200)

    const transcriptStarterTimer = window.setTimeout(() => {
      setIsCallRunning(false)
      transcriptSeed.forEach((line, index) => {
        const lineTimer = window.setTimeout(() => {
          setTranscriptLines((current) => [...current, line])
          setCallForm((current) => ({
            ...current,
            transcriptNotes: `${current.transcriptNotes}${current.transcriptNotes ? '\n' : ''}${line}`,
          }))
        }, index * 650)

        timersRef.current.push(lineTimer)
      })
    }, 7200)

    timersRef.current.push(locationTimer, registrationTimer, transcriptStarterTimer)

    return () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      timersRef.current = []
    }
  }, [selectedMode?.value])

  useEffect(() => () => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
  }, [])

  useEffect(() => {
    if (isOpen) {
      setTranscriptSourceNotice(buildTranscriptSourceNotice())
    }
  }, [isOpen])

  const handleManualSubmit = () => {
    setStatusText('Incident record staged. Redirecting to the active incident details page.')
    navigate(`/admin/incidents/${selectedActiveIncidentId}`)
  }

  const handleCallSubmit = () => {
    setIsRecording(true)
    setStatusText('Live call incident captured. Redirecting to the active incident details page.')

    window.setTimeout(() => {
      navigate(`/admin/incidents/${selectedActiveIncidentId}`)
    }, 650)
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="bg-white dark:bg-stone-950/80">
        <div className="mb-8 flex flex-col gap-3 border-b border-stone-200 pb-6 dark:border-stone-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-space text-xs font-medium uppercase tracking-[0.24em] text-emerald-700 dark:text-light-green">Incident intake</p>
            <h1 className="mt-2 font-space text-xl font-semibold text-stone-900 dark:text-stone-100">Record a new incident</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600 dark:text-stone-300">
              Choose whether to enter the incident manually or capture it from a connected call. The page follows the incidents layout and keeps the workflow focused.
            </p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-600/30 dark:bg-red-600/10 dark:text-red-400">
            Active destination: {selectedActiveIncidentId}
          </div>
        </div>

        <div className="space-y-6">
          <RadioGroup
            items={modeOptions}
            returnSelected={(item) => setSelectedMode(item)}
            inputLabel="How would you like to record this incident?"
            requiredField
            preSelectedIndex={null}
            inline={false}
          />

          {selectedMode !== null && <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5 dark:border-stone-800 dark:bg-stone-900/20">
            {selectedMode.value === 'manual' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-space text-xl font-semibold text-stone-900 dark:text-stone-100">Provide incident details</h2>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
                    Fill out the fields below so the incident can be recorded with the caller and location information already captured.
                  </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <TextField
                    fieldId="incident-title"
                    inputLabel="Incident title"
                    inputPlaceholder="Armed robbery in progress"
                    returnFieldValue={(value) => setManualForm((current) => ({ ...current, incidentTitle: value }))}
                    preloadValue={manualForm.incidentTitle}
                  />
                  <AutocompleteSelect
                    key={`manual-incident-type-${manualForm.incidentType}`}
                    inputLabel="Incident type"
                    selectOptions={incidentTypes}
                    titleField="title"
                    returnFieldValue={(value) => setManualForm((current) => ({ ...current, incidentType: value.value }))}
                    preSelected={manualForm.incidentType}
                    preSelectedLabel="value"
                    disableAutocomplete
                  />
                  <AutocompleteSelect
                    key={`manual-severity-${manualForm.severity}`}
                    inputLabel="Severity"
                    selectOptions={severityOptions}
                    titleField="title"
                    returnFieldValue={(value) => setManualForm((current) => ({ ...current, severity: value.value }))}
                    preSelected={manualForm.severity}
                    preSelectedLabel="value"
                  />
                  <TextField
                    fieldId="incident-address"
                    inputLabel="Incident address"
                    inputPlaceholder="Aminu Kano Crescent, Wuse 2, Abuja"
                    returnFieldValue={(value) => setManualForm((current) => ({ ...current, address: value }))}
                    preloadValue={manualForm.address}
                  />
                  <TextField
                    fieldId="incident-landmark"
                    inputLabel="Nearest landmark"
                    inputPlaceholder="Opposite the pharmacy and filling station"
                    returnFieldValue={(value) => setManualForm((current) => ({ ...current, landmark: value }))}
                    preloadValue={manualForm.landmark}
                  />
                  <TextField
                    fieldId="caller-name"
                    inputLabel="Caller name"
                    inputPlaceholder="Aisha Sule"
                    returnFieldValue={(value) => setManualForm((current) => ({ ...current, callerName: value }))}
                    preloadValue={manualForm.callerName}
                  />
                  <TextField
                    fieldId="caller-phone"
                    inputLabel="Caller phone"
                    inputPlaceholder="+234 803 442 1199"
                    returnFieldValue={(value) => setManualForm((current) => ({ ...current, callerPhone: value }))}
                    preloadValue={manualForm.callerPhone}
                  />
                  <TextField
                    fieldId="caller-email"
                    inputLabel="Caller email"
                    inputPlaceholder="aisha.sule@example.com"
                    returnFieldValue={(value) => setManualForm((current) => ({ ...current, callerEmail: value }))}
                    preloadValue={manualForm.callerEmail}
                  />
                  <TextField
                    fieldId="caller-nin"
                    inputLabel="Caller NIN"
                    inputPlaceholder="22334455678"
                    returnFieldValue={(value) => setManualForm((current) => ({ ...current, nin: value }))}
                    preloadValue={manualForm.nin}
                  />
                  <div className="lg:col-span-2">
                    <TextareaField
                      key={`manual-summary-${manualForm.incidentSummary.length}`}
                      fieldId="incident-summary"
                      inputLabel="Incident summary"
                      inputPlaceholder="Describe what was reported, what is happening, and anything the dispatcher should know."
                      returnFieldValue={(value) => setManualForm((current) => ({ ...current, incidentSummary: value }))}
                      preloadValue={manualForm.incidentSummary}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <TextareaField
                      key={`manual-notes-${manualForm.dispatchNotes.length}`}
                      fieldId="dispatch-notes"
                      inputLabel="Dispatch notes"
                      inputPlaceholder="Add any extra instruction for the response team."
                      returnFieldValue={(value) => setManualForm((current) => ({ ...current, dispatchNotes: value }))}
                      preloadValue={manualForm.dispatchNotes}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <div className="sm:w-56">
                    <FormButton buttonLabel="Record incident" buttonAction={handleManualSubmit} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="font-space text-xl font-semibold text-stone-900 dark:text-stone-100">Record from call</h2>
                  <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
                    The system will locate the call, fetch the phone registration data, and transcribe the conversation as it comes in.
                  </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-5">
                  <div className="space-y-4 lg:col-span-2">
                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/60">
                      <p className="mb-4 font-space text-base font-semibold text-stone-900 dark:text-stone-100">Call simulation</p>
                      <div className="space-y-3">
                        {callSimulationSteps.map((step, index) => {
                          const isActive = index === callStageIndex
                          const isDone = index < callStageIndex
                          const stepDescription = step.id === 'location'
                            ? isLocationComplete
                              ? 'Located - Aminu Kano Crescent, Wuse 2, Abuja'
                              : 'Locating caller position...'
                            : step.id === 'registration'
                              ? isRegistrationComplete
                                ? 'Aisha Sule | +234 803 442 1199 | aisha.sule@example.com | NIN: 22334455678'
                                : 'Fetching phone registration details...'
                              : step.description

                          return (
                            <div key={step.id} className={`rounded-xl border px-4 py-3 transition ${isActive ? 'border-emerald-400 bg-emerald-50 dark:border-light-green dark:bg-light-green/10' : 'border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40'}`}>
                              <div className="flex items-center justify-between gap-4">
                                <p className="font-space text-sm font-semibold text-stone-900 dark:text-stone-100">{step.label}</p>
                                <span className={`text-xs font-medium ${isDone ? 'text-emerald-700 dark:text-light-green' : isActive ? 'text-stone-900 dark:text-stone-100' : 'text-stone-500 dark:text-stone-400'}`}>
                                  {isDone ? 'done' : isActive ? 'running' : 'queued'}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-300">{stepDescription}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/60">
                      <p className="font-space text-base font-semibold text-stone-900 dark:text-stone-100">Extracted caller details</p>
                      <div className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-300">
                        <div className="rounded-xl bg-stone-50 px-4 py-3 dark:bg-stone-900/40"><span className="font-medium text-stone-900 dark:text-stone-100">Name:</span> {isRegistrationComplete ? callForm.callerName : 'Waiting...'}</div>
                        <div className="rounded-xl bg-stone-50 px-4 py-3 dark:bg-stone-900/40"><span className="font-medium text-stone-900 dark:text-stone-100">Phone:</span> {isRegistrationComplete ? callForm.callerPhone : 'Waiting...'}</div>
                        <div className="rounded-xl bg-stone-50 px-4 py-3 dark:bg-stone-900/40"><span className="font-medium text-stone-900 dark:text-stone-100">Email:</span> {isRegistrationComplete ? callForm.callerEmail : 'Waiting...'}</div>
                        <div className="rounded-xl bg-stone-50 px-4 py-3 dark:bg-stone-900/40"><span className="font-medium text-stone-900 dark:text-stone-100">NIN:</span> {isRegistrationComplete ? callForm.nin : 'Waiting...'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 lg:col-span-3">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <TextField
                        key={`call-id-${callForm.callId}`}
                        fieldId="call-id"
                        inputLabel="Call reference"
                        inputPlaceholder="CALL-2041-19"
                        returnFieldValue={(value) => setCallForm((current) => ({ ...current, callId: value }))}
                        preloadValue={callForm.callId}
                        disabled
                      />
                      <TextField
                        key={`located-address-${callForm.locatedAddress}`}
                        fieldId="located-address"
                        inputLabel="Located address"
                        inputPlaceholder="Aminu Kano Crescent, Wuse 2, Abuja"
                        returnFieldValue={(value) => setCallForm((current) => ({ ...current, locatedAddress: value }))}
                        preloadValue={isLocationComplete ? callForm.locatedAddress : ''}
                        disabled
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <TextField
                        key={`detected-name-${callForm.callerName}`}
                        fieldId="detected-caller-name"
                        inputLabel="Caller name"
                        inputPlaceholder="Aisha Sule"
                        returnFieldValue={(value) => setCallForm((current) => ({ ...current, callerName: value }))}
                        preloadValue={isRegistrationComplete ? callForm.callerName : ''}
                        disabled
                      />
                      <TextField
                        key={`detected-phone-${callForm.callerPhone}`}
                        fieldId="detected-caller-phone"
                        inputLabel="Caller phone"
                        inputPlaceholder="+234 803 442 1199"
                        returnFieldValue={(value) => setCallForm((current) => ({ ...current, callerPhone: value }))}
                        preloadValue={isRegistrationComplete ? callForm.callerPhone : ''}
                        disabled
                      />
                      <TextField
                        key={`detected-email-${callForm.callerEmail}`}
                        fieldId="detected-caller-email"
                        inputLabel="Caller email"
                        inputPlaceholder="aisha.sule@example.com"
                        returnFieldValue={(value) => setCallForm((current) => ({ ...current, callerEmail: value }))}
                        preloadValue={isRegistrationComplete ? callForm.callerEmail : ''}
                        disabled
                      />
                      <TextField
                        key={`detected-nin-${callForm.nin}`}
                        fieldId="detected-caller-nin"
                        inputLabel="Caller NIN"
                        inputPlaceholder="22334455678"
                        returnFieldValue={(value) => setCallForm((current) => ({ ...current, nin: value }))}
                        preloadValue={isRegistrationComplete ? callForm.nin : ''}
                        disabled
                      />
                    </div>

                    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-950/60">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="font-space text-sm font-semibold text-stone-900 dark:text-stone-100">Live transcript</p>
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${transcriptSourceNotice.tone === 'translation' ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/60 dark:bg-amber-500/10 dark:text-amber-300' : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/60 dark:bg-emerald-500/10 dark:text-emerald-300'}`}>
                          {transcriptSourceNotice.text}
                        </span>
                      </div>
                      <TextareaField
                        key={`live-transcript-${transcriptLines.length}`}
                        fieldId="live-transcript"
                        inputLabel="Transcript stream"
                        inputPlaceholder="Transcript appears here as the call is being captured."
                        returnFieldValue={(value) => setCallForm((current) => ({ ...current, transcriptNotes: value }))}
                        preloadValue={callForm.transcriptNotes}
                        disabled
                      />
                      <div className="mt-4 space-y-2 text-sm text-stone-600 dark:text-stone-300">
                        {transcriptLines.length > 0 ? transcriptLines.map((line, index) => (
                          <p key={`${index}-${line}`} className="rounded-xl bg-stone-50 px-4 py-3 dark:bg-stone-900/40">{line}</p>
                        )) : <p className="rounded-xl bg-stone-50 px-4 py-3 italic dark:bg-stone-900/40">{initialTranscriptPrompt}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-stone-600 dark:text-stone-300">
                    {statusText || 'Once the simulation completes, record the incident to open the active incident details page.'}
                  </p>
                  <div className="sm:w-56">
                    <FormButton buttonLabel={isRecording ? 'Recording...' : 'Record incident'} buttonAction={handleCallSubmit} processing={isRecording} disabled={isCallRunning} />
                  </div>
                </div>
              </div>
            )}
          </div>}
        </div>
      </div>
    </div>
  )
}

export default RecordNewIncident