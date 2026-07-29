import React, { useMemo, useState } from 'react'
import ModalDialog from '../../../components/layouts/ModalDialog'
import SlideOutModal from '../../../components/layouts/SlideOutModal'
import NewPayment from '../../../components/elements/workflows/payments/NewPayment'

const Payments = () => {
  const programmeCatalog = useMemo(() => {
    return [
      {
        id: 'PRG-001',
        name: 'Flood Relief Programme',
        budgetName: 'Assistance Budget 1',
        budgetAmount: 340000000,
        coverageAreas: ['Lagos', 'Rivers', 'FCT'],
        defaultProvider: 'Paystack',
        bankingPartner: 'Zenith Bank',
        settlementPartner: 'Interswitch',
        walletProvider: 'Opay',
        telecomProvider: 'MTN',
        voucherIssuer: 'National Relief Trust',
      },
      {
        id: 'PRG-002',
        name: 'Food Security Support',
        budgetName: 'Assistance Budget 2',
        budgetAmount: 280000000,
        coverageAreas: ['Kano', 'Kaduna', 'Borno'],
        defaultProvider: 'Flutterwave',
        bankingPartner: 'Access Bank',
        settlementPartner: 'Flutterwave',
        walletProvider: 'PalmPay',
        telecomProvider: 'Airtel',
        voucherIssuer: 'Emergency Support Office',
      },
      {
        id: 'PRG-003',
        name: 'Medical Emergency Grant',
        budgetName: 'Assistance Budget 3',
        budgetAmount: 420000000,
        coverageAreas: ['Benue', 'Plateau', 'Kogi'],
        defaultProvider: 'Remita',
        bankingPartner: 'First Bank',
        settlementPartner: 'Remita',
        walletProvider: 'Moniepoint',
        telecomProvider: 'Glo',
        voucherIssuer: 'Humanitarian Cash Desk',
      },
      {
        id: 'PRG-004',
        name: 'Displacement Assistance Fund',
        budgetName: 'Assistance Budget 4',
        budgetAmount: 510000000,
        coverageAreas: ['Anambra', 'Ogun', 'Yobe'],
        defaultProvider: 'Paystack',
        bankingPartner: 'UBA',
        settlementPartner: 'Monnify',
        walletProvider: 'Kuda',
        telecomProvider: '9mobile',
        voucherIssuer: 'National Relief Trust',
      },
      {
        id: 'PRG-005',
        name: 'Household Stabilization Grant',
        budgetName: 'Assistance Budget 5',
        budgetAmount: 360000000,
        coverageAreas: ['Lagos', 'Kano', 'Kaduna', 'Rivers'],
        defaultProvider: 'Interswitch',
        bankingPartner: 'Fidelity Bank',
        settlementPartner: 'Interswitch',
        walletProvider: 'Paga',
        telecomProvider: 'MTN',
        voucherIssuer: 'Emergency Support Office',
      },
      {
        id: 'PRG-006',
        name: 'Community Recovery Support',
        budgetName: 'Assistance Budget 6',
        budgetAmount: 490000000,
        coverageAreas: ['FCT', 'Plateau', 'Benue'],
        defaultProvider: 'Flutterwave',
        bankingPartner: 'GTBank',
        settlementPartner: 'Flutterwave',
        walletProvider: 'Opay',
        telecomProvider: 'Airtel',
        voucherIssuer: 'Humanitarian Cash Desk',
      },
    ]
  }, [])

  const buildChannelDetail = (channel, index, recipient, programme, settlementPartner, states) => {
    const paymentMonth = String((index % 12) + 1).padStart(2, '0')
    const paymentYear = 2026

    if (channel === 'Bank Transfer') {
      return {
        provider: settlementPartner,
        transferType: 'NIP Immediate Transfer',
        bankName: programme.bankingPartner,
        accountName: `${recipient} Relief Account`,
        accountNumber: `0${(7812000000 + index * 137).toString().slice(0, 10)}`,
        sortCode: `${(100000 + index * 31).toString().slice(0, 6)}`,
        branch: `${programme.bankingPartner} - Central Branch`,
        routingRef: `RT-${(index + 1).toString().padStart(5, '0')}`,
        narration: `Assistance payout for ${programme.name}`,
        phoneNumber: `080${(30000000 + index * 171).toString().slice(0, 8)}`,
      }
    }

    if (channel === 'NQR') {
      return {
        provider: settlementPartner,
        nqrReference: `NQR-${paymentYear}${paymentMonth}-${(index + 1).toString().padStart(4, '0')}`,
        merchantName: `${programme.name} Collections`,
        merchantId: `MRC-${(index + 1).toString().padStart(5, '0')}`,
        terminalId: `TERM-${(7000 + index * 9).toString().padStart(6, '0')}`,
        settlementBank: programme.bankingPartner,
        settlementAccount: `01${(990000000 + index * 91).toString().slice(0, 8)}`,
        customerCode: `CUST-${(index + 1).toString().padStart(6, '0')}`,
        scanChannel: 'In-app QR scan',
      }
    }

    if (channel === 'Wallet') {
      return {
        provider: programme.walletProvider,
        walletId: `WLT-${(index + 1).toString().padStart(7, '0')}`,
        walletName: `${recipient.split(' ')[0]} Wallet`,
        phoneNumber: `080${(70000000 + index * 213).toString().slice(0, 8)}`,
        accountHandle: `@${recipient.split(' ')[0].toLowerCase()}${index + 1}`,
        fundingSource: 'Programme Wallet Pool',
        walletReference: `WREF-${(index + 1).toString().padStart(6, '0')}`,
      }
    }

    if (channel === 'USSD') {
      return {
        provider: programme.telecomProvider,
        phoneNumber: `080${(90000000 + index * 311).toString().slice(0, 8)}`,
        shortcode: '*347*18#',
        sessionId: `USSDS-${paymentYear}${paymentMonth}${(index + 1).toString().padStart(3, '0')}`,
        beneficiaryCode: `BEN-${(index + 1).toString().padStart(5, '0')}`,
        agentName: index % 2 === 0 ? 'Field Collection Agent 1' : 'Field Collection Agent 2',
        pinVerified: index % 3 !== 0,
      }
    }

    return {
      provider: programme.voucherIssuer,
      voucherCode: `VCH-${paymentYear}${paymentMonth}-${(index + 1).toString().padStart(5, '0')}`,
      serialNumber: `SER-${(index + 1).toString().padStart(8, '0')}`,
      pinMasked: `****-${(1000 + index * 19).toString().slice(0, 4)}`,
      redeemLocation: `${states[index % states.length]} Redemption Desk`,
      expiryDate: new Date(2026, (index * 3) % 12, ((index * 4) % 27) + 1),
      redemptionChannel: 'Offline support desk',
    }
  }

  const initialPayments = useMemo(() => {
    const recipients = [
      'Aisha Mohammed',
      'Musa Ibrahim',
      'Chinwe Okafor',
      'Sadiq Bello',
      'Maryam Abdullahi',
      'Tunde Akinyemi',
      'Fatima Lawal',
      'Ifeanyi Nwosu',
      'Zainab Yusuf',
      'Umar Garba',
      'Amina Jibrin',
      'Victor Eze',
    ]
    const channels = ['Bank Transfer', 'NQR', 'Wallet', 'USSD', 'Voucher']
    const statuses = ['Disbursed', 'Pending', 'Failed', 'Reconciled']
    const states = ['Lagos', 'Kano', 'Kaduna', 'Borno', 'Benue', 'Rivers', 'FCT', 'Plateau']

    return Array.from({ length: 24 }, (_, index) => {
      const programme = programmeCatalog[index % programmeCatalog.length]
      const amount = 180000 + ((index * 37500) % 920000)
      const status = statuses[index % statuses.length]
      const recipient = recipients[index % recipients.length]
      const channel = channels[(index + 1) % channels.length]
      const dateDisbursed = new Date(2026, (index * 2) % 12, ((index * 3) % 27) + 1)
      const provider = programme.defaultProvider
      const paymentMonth = String((index % 12) + 1).padStart(2, '0')
      const paymentYear = 2026
      const channelDetail = buildChannelDetail(channel, index, recipient, programme, provider, states)

      return {
        id: `TXN-${(index + 1).toString().padStart(6, '0')}`,
        recipient,
        status,
        channel,
        budget: programme.budgetName,
        programme: programme.name,
        programmeId: programme.id,
        programmeBudgetAmount: programme.budgetAmount,
        programmeCoverageAreas: programme.coverageAreas,
        dateDisbursed,
        amount,
        provider,
        channelDetail,
        approvalRef: `APR-${paymentYear}${paymentMonth}-${(index + 1).toString().padStart(5, '0')}`,
        batchRef: `BATCH-${paymentYear}${paymentMonth}-${(index % 4 + 1).toString().padStart(3, '0')}`,
        reconciledAt: status === 'Reconciled' ? new Date(2026, (index * 2) % 12, ((index * 4) % 27) + 1) : null,
        failureReason: status === 'Failed'
          ? ['Invalid account details', 'Receiver unreachable', 'Voucher expired', 'Wallet limit exceeded'][index % 4]
          : null,
      }
    })
  }, [programmeCatalog])

  const [payments, setPayments] = useState(() => initialPayments)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isNewDisbursementOpen, setIsNewDisbursementOpen] = useState(false)
  const [activeBatchRef, setActiveBatchRef] = useState('')
  const [activeBatchProgramme, setActiveBatchProgramme] = useState('')

  const stats = useMemo(() => {
    const totalPayments = payments.length
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const disbursedPayments = payments.filter((payment) => payment.status === 'Disbursed').length
    const pendingPayments = payments.filter((payment) => payment.status === 'Pending').length
    const failedPayments = payments.filter((payment) => payment.status === 'Failed').length

    return {
      totalPayments,
      totalAmount,
      disbursedPayments,
      pendingPayments,
      failedPayments,
    }
  }, [payments])

  const visiblePayments = useMemo(() => {
    if (!activeBatchRef) {
      return payments
    }

    return payments.filter((payment) => payment.batchRef === activeBatchRef)
  }, [activeBatchRef, payments])

  const formatCurrency = (value) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value)

  const formatDate = (value) => new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(value)

  const formatDateTime = (value) => new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value)

  const statusTone = {
    Disbursed: 'bg-emerald/15 text-emerald',
    Pending: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Failed: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
    Reconciled: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
  }

  const channelTone = {
    'Bank Transfer': 'bg-emerald/15 text-emerald',
    NQR: 'bg-sky-500/15 text-sky-600 dark:text-sky-300',
    Wallet: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
    USSD: 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    Voucher: 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
  }

  const detailField = (label, value) => (
    <div className="rounded-lg bg-stone-100 px-3 py-2 dark:bg-stone-800/20">
      <p className="text-xs text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-stone-900 dark:text-stone-100">{value}</p>
    </div>
  )

  const handleBeginDisbursements = ({ programme, batchRef, payments: pendingPayments }) => {
    setPayments((current) => [...pendingPayments, ...current])
    setActiveBatchRef(batchRef)
    setActiveBatchProgramme(programme?.name || '')
    setSelectedPayment(null)
    setIsNewDisbursementOpen(false)
  }

  const activeBatchLabel = activeBatchRef
    ? activeBatchProgramme || visiblePayments[0]?.programme || 'Simulated batch'
    : ''

  return (
    <section className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total Payments</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{stats.totalPayments}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total Amount</p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900 dark:text-stone-100">{formatCurrency(stats.totalAmount)}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Disbursed</p>
          <h3 className="mt-2 text-xl font-semibold text-emerald">{stats.disbursedPayments}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Pending</p>
          <h3 className="mt-2 text-xl font-semibold text-amber-600 dark:text-amber-300">{stats.pendingPayments}</h3>
        </article>
        <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
          <p className="text-xs text-stone-500 dark:text-stone-400">Failed</p>
          <h3 className="mt-2 text-xl font-semibold text-rose-600 dark:text-rose-300">{stats.failedPayments}</h3>
        </article>
      </div>

      <article className="rounded-lg border border-stone-200 bg-white p-4 dark:border-stone-900/50 dark:bg-stone-900/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Payments</h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">Transaction records with recipient, channel, budget, programme, date disbursed, and amount.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeBatchRef && (
              <button
                type="button"
                onClick={() => {
                  setActiveBatchRef('')
                  setActiveBatchProgramme('')
                }}
                className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
              >
                Show all payments
              </button>
            )}
            <button
              type="button"
              className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-900/40"
            >
              Export data
            </button>
            <button
              type="button"
              onClick={() => setIsNewDisbursementOpen(true)}
              className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-white dark:text-black! transition hover:bg-emerald/90"
            >
              New disbursement
            </button>
          </div>
        </div>

        {activeBatchRef && (
          <div className="mt-4 rounded-lg border border-emerald/20 bg-emerald/10 px-4 py-3 text-sm text-emerald dark:border-emerald/20 dark:bg-emerald/10 dark:text-emerald">
            Viewing simulated pending disbursements for {activeBatchLabel}.
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500 dark:border-stone-700 dark:text-stone-400">
                <th className="px-2 py-2">Transaction Ref</th>
                <th className="px-2 py-2">Recipient</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Channel</th>
                <th className="px-2 py-2">Budget</th>
                <th className="px-2 py-2">Programme</th>
                <th className="px-2 py-2">Date Disbursed</th>
                <th className="px-2 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {visiblePayments.map((payment) => (
                <tr
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment)}
                  className="cursor-pointer border-b border-stone-100 transition hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/20"
                >
                  <td className="px-2 py-3 font-medium text-stone-900 dark:text-stone-100">{payment.id}</td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{payment.recipient}</td>
                  <td className="px-2 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusTone[payment.status]}`}>{payment.status}</span>
                  </td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{payment.channel}</td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{payment.budget}</td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{payment.programme}</td>
                  <td className="px-2 py-3 text-stone-600 dark:text-stone-300">{formatDate(payment.dateDisbursed)}</td>
                  <td className="px-2 py-3 font-medium text-stone-800 dark:text-stone-200">{formatCurrency(payment.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <ModalDialog
        shown={isNewDisbursementOpen}
        closeFunction={() => setIsNewDisbursementOpen(false)}
        dialogTitle="New disbursement"
        maxWidthClass="max-w-xl"
      >
        <NewPayment
          programmes={programmeCatalog}
          onBeginDisbursements={handleBeginDisbursements}
        />
      </ModalDialog>

      <SlideOutModal
        isOpen={Boolean(selectedPayment)}
        closeFunction={() => setSelectedPayment(null)}
        title={selectedPayment?.recipient || 'Payment Details'}
        subTitle={selectedPayment ? `${selectedPayment.id} • ${selectedPayment.programme}` : ''}
      >
        {selectedPayment && (
          <div className="space-y-4 pb-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {detailField('Transaction Ref', selectedPayment.id)}
              {detailField('Status', <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusTone[selectedPayment.status]}`}>{selectedPayment.status}</span>)}
              {detailField('Recipient', selectedPayment.recipient)}
              {detailField('Payment Channel', <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${channelTone[selectedPayment.channel]}`}>{selectedPayment.channel}</span>)}
              {detailField('Budget', selectedPayment.budget)}
              {detailField('Programme', selectedPayment.programme)}
              {detailField('Programme Funding', formatCurrency(selectedPayment.programmeBudgetAmount || 0))}
              {detailField('Coverage Areas', selectedPayment.programmeCoverageAreas?.join(', ') || 'N/A')}
              {detailField('Date Disbursed', formatDateTime(selectedPayment.dateDisbursed))}
              {detailField('Amount', formatCurrency(selectedPayment.amount))}
              {detailField('Approval Ref', selectedPayment.approvalRef)}
              {detailField('Batch Ref', selectedPayment.batchRef)}
              {detailField('Provider', selectedPayment.provider)}
              {detailField('Settlement State', selectedPayment.reconciledAt ? 'Reconciled' : 'Awaiting reconciliation')}
            </div>

            <div className="rounded-lg border border-stone-200 bg-stone-50 p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
              <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Disbursement Summary</h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {detailField('Wallet / Bank Exposure', selectedPayment.channel === 'Bank Transfer' ? `${selectedPayment.channelDetail.bankName} • ${selectedPayment.channelDetail.accountName}` : selectedPayment.channelDetail.provider)}
                {detailField('Phone Number', selectedPayment.channelDetail.phoneNumber || 'N/A')}
                {detailField('Narration / Reference', selectedPayment.channelDetail.narration || selectedPayment.channelDetail.nqrReference || selectedPayment.channelDetail.walletReference || selectedPayment.channelDetail.sessionId || selectedPayment.channelDetail.voucherCode)}
                {detailField('Settlement Partner', selectedPayment.channelDetail.provider)}
              </div>
            </div>

            {selectedPayment.channel === 'Bank Transfer' && (
              <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
                <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Bank Transfer Details</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {detailField('Bank Name', selectedPayment.channelDetail.bankName)}
                  {detailField('Account Name', selectedPayment.channelDetail.accountName)}
                  {detailField('Account Number', selectedPayment.channelDetail.accountNumber)}
                  {detailField('Sort Code', selectedPayment.channelDetail.sortCode)}
                  {detailField('Branch', selectedPayment.channelDetail.branch)}
                  {detailField('Transfer Type', selectedPayment.channelDetail.transferType)}
                  {detailField('Routing Ref', selectedPayment.channelDetail.routingRef)}
                  {detailField('Beneficiary Phone', selectedPayment.channelDetail.phoneNumber)}
                </div>
              </div>
            )}

            {selectedPayment.channel === 'NQR' && (
              <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
                <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">NQR Details</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {detailField('Merchant Name', selectedPayment.channelDetail.merchantName)}
                  {detailField('Merchant ID', selectedPayment.channelDetail.merchantId)}
                  {detailField('Terminal ID', selectedPayment.channelDetail.terminalId)}
                  {detailField('NQR Reference', selectedPayment.channelDetail.nqrReference)}
                  {detailField('Settlement Bank', selectedPayment.channelDetail.settlementBank)}
                  {detailField('Settlement Account', selectedPayment.channelDetail.settlementAccount)}
                  {detailField('Customer Code', selectedPayment.channelDetail.customerCode)}
                  {detailField('Scan Channel', selectedPayment.channelDetail.scanChannel)}
                </div>
              </div>
            )}

            {selectedPayment.channel === 'Wallet' && (
              <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
                <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Wallet Details</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {detailField('Wallet Provider', selectedPayment.channelDetail.provider)}
                  {detailField('Wallet Name', selectedPayment.channelDetail.walletName)}
                  {detailField('Wallet ID', selectedPayment.channelDetail.walletId)}
                  {detailField('Wallet Handle', selectedPayment.channelDetail.accountHandle)}
                  {detailField('Phone Number', selectedPayment.channelDetail.phoneNumber)}
                  {detailField('Funding Source', selectedPayment.channelDetail.fundingSource)}
                  {detailField('Wallet Reference', selectedPayment.channelDetail.walletReference)}
                  {detailField('Beneficiary Phone', selectedPayment.channelDetail.phoneNumber)}
                </div>
              </div>
            )}

            {selectedPayment.channel === 'USSD' && (
              <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
                <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">USSD Details</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {detailField('Telecom Provider', selectedPayment.channelDetail.provider)}
                  {detailField('Phone Number', selectedPayment.channelDetail.phoneNumber)}
                  {detailField('USSD Shortcode', selectedPayment.channelDetail.shortcode)}
                  {detailField('Session ID', selectedPayment.channelDetail.sessionId)}
                  {detailField('Beneficiary Code', selectedPayment.channelDetail.beneficiaryCode)}
                  {detailField('Agent Name', selectedPayment.channelDetail.agentName)}
                  {detailField('PIN Verified', selectedPayment.channelDetail.pinVerified ? 'Yes' : 'No')}
                  {detailField('Channel', 'USSD cashout support')}
                </div>
              </div>
            )}

            {selectedPayment.channel === 'Voucher' && (
              <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
                <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Voucher Details</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {detailField('Voucher Issuer', selectedPayment.channelDetail.provider)}
                  {detailField('Voucher Code', selectedPayment.channelDetail.voucherCode)}
                  {detailField('Serial Number', selectedPayment.channelDetail.serialNumber)}
                  {detailField('Masked PIN', selectedPayment.channelDetail.pinMasked)}
                  {detailField('Redeem Location', selectedPayment.channelDetail.redeemLocation)}
                  {detailField('Redemption Channel', selectedPayment.channelDetail.redemptionChannel)}
                  {detailField('Voucher Expiry', formatDate(selectedPayment.channelDetail.expiryDate))}
                  {detailField('Verification', 'Offline voucher verification desk')}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-stone-200 bg-white p-3 dark:border-stone-700/50 dark:bg-stone-900/20">
              <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-100">Reconciliation Trail</h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {detailField('Reconciled At', selectedPayment.reconciledAt ? formatDateTime(selectedPayment.reconciledAt) : 'Not reconciled yet')}
                {detailField('Failure Reason', selectedPayment.failureReason || 'None')}
                {detailField('Disbursement Channel', selectedPayment.channel)}
                {detailField('Amount Released', formatCurrency(selectedPayment.amount))}
              </div>
            </div>
          </div>
        )}
      </SlideOutModal>
    </section>
  )
}

export default Payments