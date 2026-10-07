import React, { useState } from 'react';
import { 
  Landmark, 
  Receipt, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Plus, 
  Search, 
  Printer,
  ChevronRight
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const FinanceAccountsModule: React.FC = () => {
  const { 
    invoices, 
    payments, 
    suppliers, 
    customers, 
    recordCustomerPayment, 
    setPrintableDoc 
  } = useERP();

  const [activeTab, setActiveTab] = useState<'receivables' | 'payables' | 'payments'>('receivables');
  const [searchTerm, setSearchTerm] = useState('');

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<any>('NEFT/RTGS');
  const [bankRef, setBankRef] = useState('');
  const [reminderSentId, setReminderSentId] = useState<string | null>(null);

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReceivables = invoices.reduce((acc, curr) => acc + curr.balanceAmount, 0);
  const totalPayables = suppliers.reduce((acc, curr) => acc + curr.outstandingBalance, 0);

  // Aging buckets
  const aging0to30 = invoices.filter(i => i.balanceAmount > 0 && i.paymentStatus !== 'Overdue')
    .reduce((acc, curr) => acc + curr.balanceAmount, 0);

  const agingOverdue = invoices.filter(i => i.paymentStatus === 'Overdue')
    .reduce((acc, curr) => acc + curr.balanceAmount, 0);

  const handleOpenPayment = (inv: any) => {
    setSelectedInvoice(inv);
    setPaymentAmount(inv.balanceAmount);
    setBankRef(`RTGS-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setShowPaymentModal(true);
  };

  const handleSendReminder = (invId: string, customerName: string) => {
    setReminderSentId(invId);
    setTimeout(() => {
      setReminderSentId(null);
    }, 2500);
  };

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    recordCustomerPayment(selectedInvoice.id, Number(paymentAmount), paymentMode, bankRef);
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Finance, Accounts &amp; Receivables Aging
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
              Working Capital Control
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time customer receivables aging, automated payment reconciliation, and supplier accounts payable.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="text-neutral-500 font-medium">Total Pending Receivables</div>
          <div className="text-xl font-bold font-mono text-neutral-900 mt-1">
            ₹{totalReceivables.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">{invoices.filter(i => i.balanceAmount > 0).length} outstanding invoices</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="text-neutral-500 font-medium">Current (0–30 Days)</div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
            ₹{aging0to30.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">Within standard credit terms</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="text-neutral-500 font-medium">Overdue (60+ Days)</div>
          <div className="text-xl font-bold font-mono text-rose-700 mt-1">
            ₹{agingOverdue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-rose-600 mt-1">Requires immediate follow-up</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <div className="text-neutral-500 font-medium">Pending Supplier Payables</div>
          <div className="text-xl font-bold font-mono text-amber-800 mt-1">
            ₹{totalPayables.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">Mine ores &amp; packaging balance</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
          <button
            onClick={() => setActiveTab('receivables')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'receivables' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Customer Invoices &amp; Aging ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('payables')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'payables' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Supplier Payables ({suppliers.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'payments' ? 'bg-white text-neutral-900 shadow-xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Bank Receipts &amp; Ledger ({payments.length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search invoice #, customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-8 pr-3 py-1 bg-white border border-neutral-200 rounded-md w-60 outline-none text-neutral-800"
          />
        </div>
      </div>

      {/* TAB 1: RECEIVABLES */}
      {activeTab === 'receivables' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                  <th className="p-3">Invoice # &amp; Date</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Product</th>
                  <th className="p-3 text-right">Invoice Amount</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right font-bold text-amber-800">Balance Due</th>
                  <th className="p-3">Due Date &amp; Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      <div className="font-mono font-bold text-neutral-900">{inv.invoiceNumber}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{inv.invoiceDate}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-neutral-900">{inv.customerName}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">GSTIN: {inv.gstin}</div>
                    </td>
                    <td className="p-3 text-neutral-800 font-medium">
                      {inv.productName} ({inv.quantityMT} MT)
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-neutral-900">
                      ₹{inv.totalInvoiceAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums text-emerald-700">
                      ₹{inv.paidAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums font-bold text-sm text-neutral-900">
                      ₹{inv.balanceAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                        inv.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                        inv.paymentStatus === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Due: {inv.dueDate}</div>
                    </td>
                    <td className="p-3 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setPrintableDoc({ type: 'invoice', data: inv })}
                        className="px-2 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[11px] text-neutral-700 font-medium cursor-pointer"
                        title="View & Print GST Invoice"
                      >
                        Print
                      </button>

                      {inv.balanceAmount > 0 ? (
                        <>
                          <button
                            onClick={() => handleSendReminder(inv.id, inv.customerName)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[11px] font-medium cursor-pointer"
                            title="Send payment reminder SMS/WhatsApp"
                          >
                            {reminderSentId === inv.id ? 'Reminder Sent! ✓' : 'Send Reminder'}
                          </button>
                          <button
                            onClick={() => handleOpenPayment(inv)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold cursor-pointer shadow-2xs"
                          >
                            Record Payment
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                          Settled ✓
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAYABLES */}
      {activeTab === 'payables' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Materials Supplied</th>
                <th className="p-3">Credit Terms</th>
                <th className="p-3 text-right">Lifetime Purchases</th>
                <th className="p-3 text-right font-bold text-amber-800">Outstanding Payable</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-neutral-50/50">
                  <td className="p-3 font-semibold text-neutral-900">{s.supplierName}</td>
                  <td className="p-3 text-neutral-600">{s.materialSupplied.join(', ')}</td>
                  <td className="p-3 text-neutral-700">{s.creditPeriodDays} Days ({s.paymentTerms})</td>
                  <td className="p-3 text-right font-mono tabular-nums">
                    ₹{s.totalPurchases.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-sm text-neutral-900">
                    ₹{s.outstandingBalance.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => alert(`Initiate RTGS payout of ₹${s.outstandingBalance.toLocaleString('en-IN')} to ${s.bankName} A/c ${s.accountNo}`)}
                      className="px-2.5 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-[11px] font-medium text-neutral-700 cursor-pointer"
                    >
                      Make Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: PAYMENTS RECEIVED */}
      {activeTab === 'payments' && (
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-600">
                <th className="p-3">Txn Voucher #</th>
                <th className="p-3">Party Name</th>
                <th className="p-3">Invoice Reference</th>
                <th className="p-3">Date</th>
                <th className="p-3">Payment Mode &amp; UTR</th>
                <th className="p-3 text-right font-bold">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-neutral-50/50">
                  <td className="p-3 font-mono font-bold text-neutral-900">{p.transactionNumber}</td>
                  <td className="p-3 font-semibold text-neutral-900">{p.partyName}</td>
                  <td className="p-3 font-mono text-neutral-600">{p.referenceInvoiceNumber}</td>
                  <td className="p-3 text-neutral-600">{p.paymentDate}</td>
                  <td className="p-3 font-mono text-neutral-700">
                    {p.paymentMode} ({p.bankReference})
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-bold text-emerald-700 text-sm">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-neutral-400 italic">
                    No payment vouchers recorded yet. Click "Record Payment" on any pending invoice.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-md p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 mb-1">
              Record Customer Receipt for {selectedInvoice.invoiceNumber}
            </h3>
            <p className="text-[11px] text-neutral-500 mb-4">
              Customer: {selectedInvoice.customerName} · Balance: ₹{selectedInvoice.balanceAmount.toLocaleString('en-IN')}
            </p>

            <form onSubmit={submitPayment} className="space-y-3">
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Payment Amount Received (₹)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full border border-neutral-300 rounded p-2 font-mono font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 bg-white"
                  >
                    <option value="NEFT/RTGS">NEFT / RTGS</option>
                    <option value="Cheque">Cheque Deposit</option>
                    <option value="Cash">Cash Deposit</option>
                    <option value="UPI">UPI Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Bank Reference / UTR</label>
                  <input
                    type="text"
                    value={bankRef}
                    onChange={(e) => setBankRef(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800">
                <strong>Ledger Impact:</strong> Credits SBI Commercial Current A/c, reduces customer outstanding, and updates profitability.
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3 py-1.5 border border-neutral-300 rounded text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded cursor-pointer shadow-xs"
                >
                  Confirm Receipt Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
