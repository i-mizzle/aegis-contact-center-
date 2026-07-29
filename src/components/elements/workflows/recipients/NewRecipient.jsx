import React, { useMemo, useState } from 'react'
import TextField from '../../form/TextField'
import RadioGroup from '../../form/RadioGroup'
import TextFieldTagCloud from '../../form/TextFieldTagCloud'

const NewRecipient = ({ programmes, onAddRecipient }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [location, setLocation] = useState('')
  const [channel, setChannel] = useState(null)
  const [channelProvider, setChannelProvider] = useState('')
  const [eligiblePrograms, setEligiblePrograms] = useState([])

  const channelOptions = useMemo(() => ([
    { label: 'Bank Transfer', description: 'Direct transfer to a bank account' },
    { label: 'Wallet', description: 'Digital wallet payout' },
    { label: 'USSD', description: 'Cashout through mobile USSD' },
    { label: 'NQR', description: 'QR-based collection channel' },
    { label: 'Voucher', description: 'Offline voucher redemption' },
  ]), [])

  const providerOptions = useMemo(() => {
    const options = {
      'Bank Transfer': ['Zenith Bank', 'Access Bank', 'First Bank', 'GTBank', 'UBA', 'Fidelity Bank'],
      Wallet: ['Opay', 'PalmPay', 'Moniepoint', 'Kuda', 'Paga'],
      USSD: ['MTN', 'Airtel', 'Glo', '9mobile'],
      NQR: ['Interswitch', 'Flutterwave', 'Paystack', 'Monnify'],
      Voucher: ['National Relief Trust', 'Emergency Support Office', 'Humanitarian Cash Desk'],
    }

    return channel ? options[channel.label] || [] : []
  }, [channel])

  const handleAddRecipient = () => {
    if (!name || !email || !phoneNumber || !location || !channel || !channelProvider || eligiblePrograms.length === 0) {
      return
    }

    onAddRecipient({
      name,
      email,
      phoneNumber,
      location,
      channel: channel.label,
      channelProvider,
      eligiblePrograms,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField inputLabel="Name" inputPlaceholder="Recipient name" returnFieldValue={setName} />
        <TextField inputLabel="Email" inputPlaceholder="Recipient email" returnFieldValue={setEmail} />
        <TextField inputLabel="Phone number" inputPlaceholder="Recipient phone number" returnFieldValue={setPhoneNumber} />
        <TextField inputLabel="Location" inputPlaceholder="Recipient location" returnFieldValue={setLocation} />
      </div>

      <RadioGroup
        inputLabel="Channel"
        items={channelOptions}
        returnSelected={setChannel}
      />

      {channel && providerOptions.length > 0 && (
        <div>
          <label className="mb-1 block text-sm text-gray-500 dark:text-gray-300">Channel provider</label>
          <select
            value={channelProvider}
            onChange={(event) => setChannelProvider(event.target.value)}
            className="w-full rounded border border-transparent bg-black/10 px-4 py-3 text-sm transition focus:border-gray-800 focus:bg-white focus:outline-none dark:bg-black/20 dark:focus:border-stone-700 dark:focus:bg-stone-950"
          >
            <option value="">Select a provider</option>
            {providerOptions.map((provider) => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>
      )}

      <TextFieldTagCloud
        inputLabel="Eligible programs"
        fieldId="eligible-programs"
        inputPlaceholder="Type a program and press enter"
        returnFieldValue={setEligiblePrograms}
        preloadValue={programmes?.slice(0, 0)}
        maxTags={20}
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddRecipient}
          className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald/90"
        >
          Add recipient
        </button>
      </div>
    </div>
  )
}

export default NewRecipient