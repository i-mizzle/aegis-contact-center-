import React, { useEffect, useMemo, useState } from 'react'
import AutocompleteSelect from '../../form/AutocompleteSelect'

const NewPayment = ({ programmes, onBeginDisbursements }) => {
  const [selectedProgramme, setSelectedProgramme] = useState(null)
  const [progress, setProgress] = useState(0)
  const [simulationComplete, setSimulationComplete] = useState(false)
  const [identifiedRecipients, setIdentifiedRecipients] = useState([])

  const selectedBudget = selectedProgramme?.budgetName || selectedProgramme?.budget || selectedProgramme?.attachedBudget?.name || 'Not selected'

  const formatCurrency = (value) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value || 0)

  const buildIdentifiedRecipients = (programme) => {
    if (!programme) {
      return []
    }

    const coverageAreas = programme.coverageAreas && programme.coverageAreas.length > 0 ? programme.coverageAreas : ['Lagos']
    const channels = ['Bank Transfer', 'NQR', 'Wallet', 'USSD', 'Voucher']
    const recipientCount = Math.max(6, coverageAreas.length + 3)

    return Array.from({ length: recipientCount }, (_, index) => {
      const area = coverageAreas[index % coverageAreas.length]
      const channel = channels[(programme.id.length + index) % channels.length]
      const amount = Math.round((programme.budgetAmount / recipientCount) * (0.85 + ((index % 4) * 0.04)))

      return {
        id: `${programme.id}-SIM-${(index + 1).toString().padStart(3, '0')}`,
        recipient: `${programme.name.split(' ')[0]} Beneficiary ${index + 1}`,
        area,
        channel,
        amount,
        phoneNumber: `080${(55000000 + index * 241).toString().slice(0, 8)}`,
      }
    })
  }

  useEffect(() => {
    setProgress(0)
    setSimulationComplete(false)
    setIdentifiedRecipients([])

    if (!selectedProgramme) {
      return undefined
    }

    const identified = buildIdentifiedRecipients(selectedProgramme)
    const startedAt = Date.now()

    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextProgress = Math.min((elapsed / 4000) * 100, 100)

      setProgress(nextProgress)

      if (nextProgress >= 100) {
        clearInterval(timer)
        setIdentifiedRecipients(identified)
        setSimulationComplete(true)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [selectedProgramme])

  const summary = useMemo(() => {
    const channels = new Set(identifiedRecipients.map((item) => item.channel))
    const areas = new Set(identifiedRecipients.map((item) => item.area))

    return {
      recipients: identifiedRecipients.length,
      channels: channels.size,
      areas: areas.size,
    }
  }, [identifiedRecipients])

  const handleBegin = () => {
    if (!selectedProgramme || identifiedRecipients.length === 0) {
      return
    }

    const batchRef = `SIM-${selectedProgramme.id}-${Date.now()}`

    const pendingPayments = identifiedRecipients.map((recipient, index) => {
      const channel = recipient.channel
      const paymentYear = new Date().getFullYear()
      const paymentMonth = String(new Date().getMonth() + 1).padStart(2, '0')

      const channelDetail = channel === 'Bank Transfer'
        ? {
            provider: selectedProgramme.defaultProvider || 'Paystack',
            transferType: 'NIP Immediate Transfer',
            bankName: selectedProgramme.bankingPartner || 'Access Bank',
            accountName: `${recipient.recipient} Relief Account`,
            accountNumber: `0${(8100000000 + index * 113).toString().slice(0, 10)}`,
            sortCode: `55${(1000 + index * 7).toString().slice(0, 4)}`,
            branch: `${selectedProgramme.bankingPartner || 'Access Bank'} - Relief Desk`,
            routingRef: `${selectedProgramme.id}-RT-${(index + 1).toString().padStart(4, '0')}`,
            narration: `Pending disbursement for ${selectedProgramme.name}`,
            phoneNumber: recipient.phoneNumber,
          }
        : channel === 'NQR'
          ? {
              provider: selectedProgramme.settlementPartner || 'Interswitch',
              nqrReference: `NQR-${selectedProgramme.id}-${(index + 1).toString().padStart(4, '0')}`,
              merchantName: `${selectedProgramme.name} Relief Merchants`,
              merchantId: `MRC-${selectedProgramme.id}-${(index + 1).toString().padStart(4, '0')}`,
              terminalId: `TERM-${(8200 + index * 11).toString().padStart(6, '0')}`,
              settlementBank: selectedProgramme.bankingPartner || 'Zenith Bank',
              settlementAccount: `01${(88000000 + index * 19).toString().slice(0, 8)}`,
              customerCode: `CUST-${selectedProgramme.id}-${(index + 1).toString().padStart(4, '0')}`,
              scanChannel: 'Generated during simulation',
            }
          : channel === 'Wallet'
            ? {
                provider: selectedProgramme.walletProvider || 'Paga',
                walletId: `WLT-${selectedProgramme.id}-${(index + 1).toString().padStart(4, '0')}`,
                walletName: `${recipient.recipient.split(' ')[0]} Wallet`,
                phoneNumber: recipient.phoneNumber,
                accountHandle: `@${recipient.recipient.split(' ')[0].toLowerCase()}${index + 1}`,
                fundingSource: 'Simulation disbursement pool',
                walletReference: `WREF-${selectedProgramme.id}-${(index + 1).toString().padStart(4, '0')}`,
              }
            : channel === 'USSD'
              ? {
                  provider: selectedProgramme.telecomProvider || 'MTN',
                  phoneNumber: recipient.phoneNumber,
                  shortcode: '*347*18#',
                  sessionId: `USSDS-${selectedProgramme.id}-${(index + 1).toString().padStart(4, '0')}`,
                  beneficiaryCode: `BEN-${selectedProgramme.id}-${(index + 1).toString().padStart(4, '0')}`,
                  agentName: 'Simulation Agent',
                  pinVerified: true,
                }
              : {
                  provider: selectedProgramme.voucherIssuer || 'Emergency Support Office',
                  voucherCode: `VCH-${selectedProgramme.id}-${(index + 1).toString().padStart(4, '0')}`,
                  serialNumber: `SER-${selectedProgramme.id}-${(index + 1).toString().padStart(6, '0')}`,
                  pinMasked: '****-4321',
                  redeemLocation: `${recipient.area} Redemption Desk`,
                  expiryDate: new Date(),
                  redemptionChannel: 'Offline support desk',
                }

      return {
        id: `${selectedProgramme.id}-PEND-${(index + 1).toString().padStart(4, '0')}`,
        recipient: recipient.recipient,
        status: 'Pending',
        channel,
        budget: selectedProgramme.budgetName || selectedProgramme.budget || 'New Disbursement Budget',
        programme: selectedProgramme.name,
        dateDisbursed: new Date(),
        amount: recipient.amount,
        provider: channelDetail.provider,
        channelDetail,
        approvalRef: `APR-${selectedProgramme.id}-${(index + 1).toString().padStart(4, '0')}`,
        batchRef,
        reconciledAt: null,
        failureReason: null,
        area: recipient.area,
        phoneNumber: recipient.phoneNumber,
      }
    })

    onBeginDisbursements({
      programme: selectedProgramme,
      batchRef,
      payments: pendingPayments,
    })
  }

  return (
    <div className="space-y-5">
      <AutocompleteSelect
        selectOptions={programmes}
        inputLabel="Programme"
        placeholderText="Select a programme to start a new disbursement"
        titleField="name"
        returnFieldValue={setSelectedProgramme}
      />

      {selectedProgramme && (
        <div className="space-y-4 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900/20">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-3 dark:bg-stone-950/40">
              <p className="text-xs text-stone-500 dark:text-stone-400">Selected programme</p>
              <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedProgramme.name}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{selectedProgramme.budgetName}</p>
            </div>
            <div className="rounded-lg bg-white p-3 dark:bg-stone-950/40">
              <p className="text-xs text-stone-500 dark:text-stone-400">Funding budget</p>
              <p className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-100">{selectedBudget}</p>
              <p className="text-xs text-stone-500 dark:text-stone-400">{formatCurrency(selectedProgramme.budgetAmount)}</p>
            </div>
          </div>

          {!simulationComplete ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>Identifying recipients for this disbursement</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                <div
                  className="h-full rounded-full bg-emerald transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-white p-3 dark:bg-stone-950/40">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Recipients identified</p>
                  <p className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.recipients}</p>
                </div>
                <div className="rounded-lg bg-white p-3 dark:bg-stone-950/40">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Payment channels</p>
                  <p className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.channels}</p>
                </div>
                <div className="rounded-lg bg-white p-3 dark:bg-stone-950/40">
                  <p className="text-xs text-stone-500 dark:text-stone-400">Areas covered</p>
                  <p className="mt-1 text-xl font-semibold text-stone-900 dark:text-stone-100">{summary.areas}</p>
                </div>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950/40">
                <div className="border-b border-stone-100 px-4 py-3 dark:border-stone-800">
                  <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Identified recipients</h4>
                </div>
                <div className="max-h-56 overflow-y-auto px-4 py-3">
                  <div className="space-y-2">
                    {identifiedRecipients.map((recipient) => (
                      <div key={recipient.id} className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 px-3 py-2 text-sm dark:bg-stone-900/30">
                        <div>
                          <p className="font-medium text-stone-900 dark:text-stone-100">{recipient.recipient}</p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">{recipient.area} • {recipient.phoneNumber}</p>
                        </div>
                        <span className="rounded-full bg-stone-200 px-2 py-1 text-xs font-semibold text-stone-700 dark:bg-stone-800 dark:text-stone-200">
                          {recipient.channel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBegin}
                className="inline-flex items-center justify-center rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald/90"
              >
                Begin disbursements
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NewPayment