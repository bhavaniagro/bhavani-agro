import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Truck, 
  FileText, 
  User, 
  Building 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    searchQuery, 
    setSearchQuery, 
    productionBatches, 
    salesOrders, 
    invoices, 
    customers, 
    suppliers, 
    products, 
    rawMaterials,
    dispatches,
    qcInspections,
    setActiveModule,
    setPrintableDoc
  } = useERP();

  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);

  if (!isSearchOpen) return null;

  const query = searchQuery.trim().toLowerCase();

  // Matched records
  const matchedBatches = productionBatches.filter(b => 
    b.batchNumber.toLowerCase().includes(query) || 
    b.productName.toLowerCase().includes(query)
  );

  const matchedCustomers = customers.filter(c => 
    c.customerName.toLowerCase().includes(query) || 
    c.companyName.toLowerCase().includes(query) ||
    c.code.toLowerCase().includes(query)
  );

  const matchedInvoices = invoices.filter(i => 
    i.invoiceNumber.toLowerCase().includes(query) || 
    i.customerName.toLowerCase().includes(query)
  );

  const matchedOrders = salesOrders.filter(o => 
    o.orderNumber.toLowerCase().includes(query) || 
    o.customerName.toLowerCase().includes(query) ||
    o.productName.toLowerCase().includes(query)
  );

  const matchedDispatches = dispatches.filter(d => 
    d.dispatchNumber.toLowerCase().includes(query) || 
    d.vehicleNumber.toLowerCase().includes(query) ||
    d.eWayBillNumber.toLowerCase().includes(query)
  );

  const activeBatch = selectedBatch || matchedBatches[0];

  // Trace data for activeBatch
  const batchQC = activeBatch ? qcInspections.find(q => q.batchLotNumber === activeBatch.batchNumber) : null;
  const batchDispatches = activeBatch ? dispatches.filter(d => d.batchNumber === activeBatch.batchNumber) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 bg-neutral-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-200 flex items-center gap-3 bg-neutral-50">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Batch (e.g. BNT-2609-088), Customer, Invoice, Vehicle, Product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full text-sm bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-1 bg-neutral-200 hover:bg-neutral-300 rounded text-neutral-700 cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Quick Sample Queries */}
        <div className="px-4 py-2 bg-white border-b border-neutral-100 flex items-center gap-2 overflow-x-auto text-[11px] text-neutral-500">
          <span className="font-medium text-neutral-600">Quick Test:</span>
          {['BNT-2609-088', 'Kisan Bio-Tech', 'INV-2609-081', 'GJ-04-E-8419', 'SO-2609-081'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded text-neutral-700 font-mono"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200 overflow-y-auto flex-1">
          {/* Left Column: Matched Entities */}
          <div className="p-4 space-y-4 overflow-y-auto">
            {/* Batches with Full Traceability Highlight */}
            {matchedBatches.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Production Batches (Full Traceability)
                </div>
                <div className="space-y-1.5">
                  {matchedBatches.map(b => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBatch(b)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        activeBatch?.id === b.id 
                          ? 'border-emerald-500 bg-emerald-50/50' 
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-neutral-900">
                        <span className="font-mono text-emerald-800">{b.batchNumber}</span>
                        <span className="text-[11px] font-mono tabular-nums">{b.quantityProducedMT} MT</span>
                      </div>
                      <div className="text-neutral-600 text-[11px] mt-0.5">{b.productName}</div>
                      <div className="text-[10px] text-neutral-400 mt-1 flex items-center gap-2">
                        <span>Mfg: {b.productionDate}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">QC: {b.qcStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices */}
            {matchedInvoices.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Sales Invoices
                </div>
                <div className="space-y-1.5">
                  {matchedInvoices.map(inv => (
                    <div
                      key={inv.id}
                      onClick={() => {
                        setPrintableDoc({ type: 'invoice', data: inv });
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white text-xs cursor-pointer"
                    >
                      <div className="flex items-center justify-between font-semibold text-neutral-900">
                        <span className="font-mono">{inv.invoiceNumber}</span>
                        <span className="font-mono text-neutral-800">₹{inv.totalInvoiceAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-neutral-600 text-[11px] mt-0.5">{inv.customerName}</div>
                      <div className="text-[10px] text-neutral-400 mt-1 flex items-center justify-between">
                        <span>Date: {inv.invoiceDate}</span>
                        <span className={inv.paymentStatus === 'Paid' ? 'text-emerald-600 font-medium' : 'text-amber-700 font-medium'}>
                          {inv.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customers */}
            {matchedCustomers.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Customers
                </div>
                <div className="space-y-1.5">
                  {matchedCustomers.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setActiveModule('Customers');
                        setIsSearchOpen(false);
                      }}
                      className="p-2.5 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white text-xs cursor-pointer"
                    >
                      <div className="font-semibold text-neutral-900">{c.customerName}</div>
                      <div className="text-neutral-500 text-[11px]">{c.contactPerson} · {c.mobile}</div>
                      <div className="text-[10px] text-neutral-400 mt-1 flex items-center justify-between">
                        <span>GSTIN: {c.gstin}</span>
                        <span className="font-mono text-neutral-700">Bal: ₹{c.outstandingBalance.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matchedBatches.length === 0 && matchedInvoices.length === 0 && matchedCustomers.length === 0 && (
              <div className="text-center py-8 text-neutral-400 text-xs">
                No matching records found for "{searchQuery}". Try a batch number or customer name.
              </div>
            )}
          </div>

          {/* Right Column: Deep End-to-End Traceability Explorer */}
          <div className="p-4 bg-neutral-50/60 overflow-y-auto">
            {activeBatch ? (
              <div className="space-y-4">
                <div className="border-b border-neutral-200 pb-2 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold text-neutral-500 uppercase">Batch Traceability Chain</div>
                    <div className="font-bold text-sm text-neutral-900 font-mono mt-0.5">{activeBatch.batchNumber}</div>
                  </div>
                  <button
                    onClick={() => {
                      setPrintableDoc({ type: 'qc_cert', data: activeBatch });
                      setIsSearchOpen(false);
                    }}
                    className="text-xs px-2.5 py-1 bg-white border border-neutral-200 hover:bg-neutral-100 rounded text-neutral-700 font-medium"
                  >
                    View QC Certificate
                  </button>
                </div>

                {/* Timeline chain */}
                <div className="relative border-l-2 border-emerald-300 ml-3 pl-4 space-y-4 text-xs">
                  {/* Step 1: Raw Materials Inbound */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white" />
                    <div className="font-semibold text-neutral-900">1. Raw Material Lots Consumed</div>
                    <div className="mt-1 space-y-1 bg-white p-2 rounded border border-neutral-200">
                      {activeBatch.rawMaterialLots.map((rm: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="font-mono text-neutral-600">{rm.lotNumber}</span>
                          <span className="text-neutral-800">{rm.materialName}</span>
                          <span className="font-mono text-neutral-500">{rm.quantityUsed} {rm.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Production Execution */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white" />
                    <div className="font-semibold text-neutral-900">2. Production Order &amp; Granulation</div>
                    <div className="text-[11px] text-neutral-600 mt-0.5">
                      Order: <span className="font-mono">{activeBatch.productionOrderId}</span> · Output: <span className="font-mono font-medium">{activeBatch.quantityProducedMT} MT</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      Line 1 Pelletizer · Standard Cost: ₹{activeBatch.standardCostPerMT}/MT · Actual: ₹{activeBatch.actualCostPerMT}/MT
                    </div>
                  </div>

                  {/* Step 3: Quality Control Lab Testing */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white" />
                    <div className="font-semibold text-neutral-900">3. Quality Control Inspection</div>
                    <div className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Lab Approval Status: {activeBatch.qcStatus}</span>
                    </div>
                    {batchQC && (
                      <div className="text-[10px] text-neutral-500 mt-1">
                        Inspector: {batchQC.inspector} · Sieve &amp; Swell Tests Passed
                      </div>
                    )}
                  </div>

                  {/* Step 4: Finished Goods Storage */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white" />
                    <div className="font-semibold text-neutral-900">4. Inventory Storage</div>
                    <div className="text-[11px] text-neutral-600 mt-0.5">
                      Location: <span className="font-medium text-neutral-800">{activeBatch.storageLocation}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      Remaining Free Stock: <span className="font-mono">{activeBatch.quantityRemainingMT} MT</span>
                    </div>
                  </div>

                  {/* Step 5: Customer Dispatches */}
                  <div className="relative">
                    <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white" />
                    <div className="font-semibold text-neutral-900">5. Dispatches &amp; Customer Invoices</div>
                    {batchDispatches.length > 0 ? (
                      <div className="mt-1 space-y-1.5">
                        {batchDispatches.map(d => (
                          <div key={d.id} className="bg-white p-2 rounded border border-neutral-200 text-[11px]">
                            <div className="flex items-center justify-between font-medium">
                              <span className="font-mono">{d.dispatchNumber}</span>
                              <span className="text-neutral-900">{d.customerName}</span>
                            </div>
                            <div className="text-neutral-500 text-[10px] mt-0.5 flex items-center justify-between">
                              <span>Vehicle: {d.vehicleNumber}</span>
                              <span>E-Way: {d.eWayBillNumber}</span>
                            </div>
                            {d.invoiceNumber && (
                              <div className="text-neutral-700 text-[10px] font-mono mt-0.5">
                                Invoice: {d.invoiceNumber}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-neutral-500 italic mt-0.5">
                        In warehouse inventory; ready for upcoming dispatches.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400 text-xs">
                Select a production batch to view full traceability chain from raw material mine lot to customer invoice.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span>Global Search index updated in real-time</span>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-3 py-1 bg-white border border-neutral-300 hover:bg-neutral-50 rounded text-neutral-700 text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
