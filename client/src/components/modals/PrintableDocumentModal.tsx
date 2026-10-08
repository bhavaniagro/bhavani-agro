import React from 'react';
import { X, Printer, Download, Share2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const PrintableDocumentModal: React.FC = () => {
  const { printableDoc, setPrintableDoc, company } = useERP();

  if (!printableDoc) return null;

  const { type, data } = printableDoc;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-300 w-full max-w-3xl my-8 overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="p-3 bg-neutral-900 text-white flex items-center justify-between no-print">
          <div className="font-semibold text-xs flex items-center gap-2">
            <span className="uppercase tracking-wider text-emerald-400">Document Preview:</span>
            <span>
              {type === 'invoice' ? `GST Tax Invoice #${data.invoiceNumber}` :
               type === 'challan' ? `Delivery Challan #${data.dispatchNumber}` :
               `QC Test Analysis Report #${data.batchNumber || data.referenceId}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setPrintableDoc(null)}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div id="printable-document" className="p-8 bg-white text-neutral-900 text-xs font-sans leading-relaxed">
          {/* Header */}
          <div className="border-b-2 border-neutral-800 pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
                  {company.name}
                </h1>
                <div className="text-[11px] text-neutral-600 font-medium">{company.formation} · Mfr &amp; Exporter</div>
                <div className="text-[11px] text-neutral-600">{company.address}, {company.city} - {company.pincode}, {company.state}</div>
                <div className="text-[11px] text-neutral-600">Email: {company.email} · Phone: {company.phone}</div>
                <div className="text-[11px] font-mono font-bold text-neutral-900 mt-1">GSTIN: {company.gstin}</div>
              </div>
              <div className="text-right">
                <div className="inline-block border-2 border-neutral-900 px-3 py-1 font-bold text-sm tracking-wider uppercase bg-neutral-50">
                  {type === 'invoice' ? 'TAX INVOICE' : type === 'challan' ? 'DELIVERY CHALLAN' : 'QUALITY TEST CERTIFICATE'}
                </div>
                <div className="text-[11px] text-neutral-600 mt-2">Original for Recipient</div>
              </div>
            </div>
          </div>

          {/* INVOICE VIEW */}
          {type === 'invoice' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border border-neutral-300 p-3 rounded">
                <div>
                  <div className="font-bold text-neutral-900">Billed To (Customer):</div>
                  <div className="font-semibold text-neutral-800 mt-0.5">{data.customerName}</div>
                  <div className="text-neutral-600">{data.billingAddress}</div>
                  <div className="font-mono text-neutral-800 mt-1 font-semibold">GSTIN: {data.gstin}</div>
                  <div className="text-neutral-600 text-[11px]">Payment Terms: {data.paymentTerms}</div>
                </div>
                <div className="border-l border-neutral-200 pl-4 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Invoice No:</span>
                    <span className="font-mono font-bold text-neutral-900">{data.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Invoice Date:</span>
                    <span className="font-mono">{data.invoiceDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Due Date:</span>
                    <span className="font-mono font-medium text-neutral-800">{data.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Sales Order Ref:</span>
                    <span className="font-mono">{data.salesOrderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Place of Supply:</span>
                    <span className="font-medium text-neutral-900">{data.shippingAddress?.split(',').pop() || 'Gujarat'}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse border border-neutral-300 text-left">
                <thead>
                  <tr className="bg-neutral-100 font-bold border-b border-neutral-300">
                    <th className="p-2 border-r border-neutral-300">#</th>
                    <th className="p-2 border-r border-neutral-300">Description of Goods</th>
                    <th className="p-2 border-r border-neutral-300">HSN</th>
                    <th className="p-2 border-r border-neutral-300 text-right">Qty (MT)</th>
                    <th className="p-2 border-r border-neutral-300 text-right">Rate (₹)</th>
                    <th className="p-2 border-r border-neutral-300 text-right">Taxable (₹)</th>
                    <th className="p-2 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="p-2 border-r border-neutral-300 font-mono">1</td>
                    <td className="p-2 border-r border-neutral-300 font-medium">
                      {data.productName}
                      <div className="text-[10px] text-neutral-500">Packed in 50kg HDPE Woven Bags with Inner Liner</div>
                    </td>
                    <td className="p-2 border-r border-neutral-300 font-mono">{data.hsnCode || '25081010'}</td>
                    <td className="p-2 border-r border-neutral-300 text-right font-mono tabular-nums">{data.quantityMT} MT</td>
                    <td className="p-2 border-r border-neutral-300 text-right font-mono tabular-nums">₹{data.ratePerMT?.toLocaleString('en-IN')}</td>
                    <td className="p-2 border-r border-neutral-300 text-right font-mono tabular-nums">₹{data.taxableValue?.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right font-mono tabular-nums font-bold">₹{data.totalInvoiceAmount?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>

              {/* Tax Breakup & Bank Details */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border border-neutral-200 p-2.5 rounded text-[11px]">
                  <div className="font-bold text-neutral-900 mb-1">Company Bank Details for RTGS / NEFT:</div>
                  <div>Bank: <span className="font-medium">{company.bankName}</span></div>
                  <div>A/c No: <span className="font-mono font-bold">{company.accountNo}</span></div>
                  <div>IFSC: <span className="font-mono font-bold">{company.ifscCode}</span></div>
                  <div>Branch: <span>{company.branch}</span></div>
                </div>

                <div className="border border-neutral-200 p-2.5 rounded space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Taxable Value:</span>
                    <span className="font-mono">₹{data.taxableValue?.toLocaleString('en-IN')}</span>
                  </div>
                  {data.cgstAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">CGST (2.5%):</span>
                      <span className="font-mono">₹{data.cgstAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {data.sgstAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">SGST (2.5%):</span>
                      <span className="font-mono">₹{data.sgstAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {data.igstAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">IGST (5%):</span>
                      <span className="font-mono">₹{data.igstAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-neutral-300 text-neutral-900">
                    <span>Grand Total (INR):</span>
                    <span className="font-mono">₹{data.totalInvoiceAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHALLAN VIEW */}
          {type === 'challan' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border border-neutral-300 p-3 rounded">
                <div>
                  <div className="font-bold text-neutral-900">Consignee (Deliver To):</div>
                  <div className="font-semibold text-neutral-800 mt-0.5">{data.customerName}</div>
                  <div className="text-neutral-600">{data.destination}</div>
                  <div className="font-mono text-neutral-800 mt-1">E-Way Bill: {data.eWayBillNumber}</div>
                </div>
                <div className="border-l border-neutral-200 pl-4 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Challan No:</span>
                    <span className="font-mono font-bold text-neutral-900">{data.dispatchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Dispatch Date:</span>
                    <span className="font-mono">{data.dispatchDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Vehicle No:</span>
                    <span className="font-mono font-bold text-emerald-800">{data.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Driver &amp; Mobile:</span>
                    <span>{data.driverName} ({data.driverMobile})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Transporter:</span>
                    <span className="font-medium">{data.transporterName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">LR / Bilty No:</span>
                    <span className="font-mono">{data.lrNumber}</span>
                  </div>
                </div>
              </div>

              <table className="w-full border-collapse border border-neutral-300 text-left">
                <thead>
                  <tr className="bg-neutral-100 font-bold border-b border-neutral-300">
                    <th className="p-2 border-r border-neutral-300">#</th>
                    <th className="p-2 border-r border-neutral-300">Item Description</th>
                    <th className="p-2 border-r border-neutral-300">Batch Lot No</th>
                    <th className="p-2 border-r border-neutral-300 text-right">No. of Bags</th>
                    <th className="p-2 text-right">Net Weight (MT)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="p-2 border-r border-neutral-300 font-mono">1</td>
                    <td className="p-2 border-r border-neutral-300 font-medium">{data.productName}</td>
                    <td className="p-2 border-r border-neutral-300 font-mono text-emerald-800">{data.batchNumber}</td>
                    <td className="p-2 border-r border-neutral-300 text-right font-mono tabular-nums">{data.bagsCount || 400} Bags</td>
                    <td className="p-2 text-right font-mono tabular-nums font-bold">{data.quantityMT} MT</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* QC CERTIFICATE VIEW */}
          {type === 'qc_cert' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 border border-neutral-300 p-3 rounded">
                <div>
                  <div className="font-bold text-neutral-900">Product / Sample Details:</div>
                  <div className="font-semibold text-neutral-800 mt-0.5">{data.productName}</div>
                  <div className="text-neutral-600 font-mono">Batch Lot No: {data.batchNumber}</div>
                  <div className="text-neutral-600">Mfg Date: {data.productionDate || data.manufacturingDate}</div>
                  <div className="text-neutral-600">Quantity Tested: {data.quantityProducedMT || data.quantity} MT</div>
                </div>
                <div className="border-l border-neutral-200 pl-4 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Testing Lab:</span>
                    <span className="font-medium">Bhavani Central Quality Control Lab</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Certification Standard:</span>
                    <span>IS 12624 / FCO 1985</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">QC Status:</span>
                    <span className="font-bold text-emerald-700 uppercase">{data.qcStatus || 'Approved'}</span>
                  </div>
                </div>
              </div>

              <table className="w-full border-collapse border border-neutral-300 text-left">
                <thead>
                  <tr className="bg-neutral-100 font-bold border-b border-neutral-300">
                    <th className="p-2 border-r border-neutral-300">Quality Parameter</th>
                    <th className="p-2 border-r border-neutral-300">Standard Specification</th>
                    <th className="p-2 border-r border-neutral-300">Observed Test Value</th>
                    <th className="p-2 text-center">Result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="p-2 border-r border-neutral-300 font-medium">Granule Size Analysis (16-30 Mesh)</td>
                    <td className="p-2 border-r border-neutral-300">Min 90% retained</td>
                    <td className="p-2 border-r border-neutral-300 font-mono">94.2% retained</td>
                    <td className="p-2 text-center font-bold text-emerald-700">PASS</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="p-2 border-r border-neutral-300 font-medium">Free Swelling Volume (ml / 2g)</td>
                    <td className="p-2 border-r border-neutral-300">Min 24 ml</td>
                    <td className="p-2 border-r border-neutral-300 font-mono">28.0 ml</td>
                    <td className="p-2 text-center font-bold text-emerald-700">PASS</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="p-2 border-r border-neutral-300 font-medium">Moisture Content %</td>
                    <td className="p-2 border-r border-neutral-300">Max 8.0% w/w</td>
                    <td className="p-2 border-r border-neutral-300 font-mono">6.5% w/w</td>
                    <td className="p-2 text-center font-bold text-emerald-700">PASS</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="p-2 border-r border-neutral-300 font-medium">Liquid Absorption Capacity</td>
                    <td className="p-2 border-r border-neutral-300">Min 18% w/w</td>
                    <td className="p-2 border-r border-neutral-300 font-mono">22.4% w/w</td>
                    <td className="p-2 text-center font-bold text-emerald-700">PASS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-12 grid grid-cols-2 gap-8 text-[11px]">
            <div>
              <div className="h-8 border-b border-dashed border-neutral-400 w-48 mb-1"></div>
              <div className="font-semibold text-neutral-800">Receiver / Driver Signature</div>
              <div className="text-neutral-500">Material verified in good condition</div>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="h-8 border-b border-dashed border-neutral-400 w-48 mb-1"></div>
              <div className="font-bold text-neutral-900">For, {company.name}</div>
              <div className="text-neutral-600">Authorized Signatory</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
