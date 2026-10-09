import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const QuickAddModal: React.FC = () => {
  const { 
    isQuickAddOpen, 
    setIsQuickAddOpen, 
    quickAddType, 
    setQuickAddType,
    customers,
    suppliers,
    products,
    rawMaterials,
    addLead,
    addCustomer,
    addSalesOrder,
    addPurchaseOrder,
    addGRN,
    addExpense
  } = useERP();

  const [activeType, setActiveType] = useState<string>(quickAddType || 'Sales Order');

  // Form states
  const [soCustomer, setSoCustomer] = useState(customers[0]?.id || '');
  const [soProduct, setSoProduct] = useState(products[0]?.id || '');
  const [soQuantity, setSoQuantity] = useState(25);
  const [soRate, setSoRate] = useState(6200);

  const [poSupplier, setPoSupplier] = useState(suppliers[0]?.id || '');
  const [poMaterial, setPoMaterial] = useState(rawMaterials[0]?.id || '');
  const [poQuantity, setPoQuantity] = useState(40);
  const [poRate, setPoRate] = useState(2200);

  const [expCategory, setExpCategory] = useState<any>('Electricity & Power');
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expVendor, setExpVendor] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expPaidFrom, setExpPaidFrom] = useState('SBI Current Account');

  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadMobile, setLeadMobile] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadLocation, setLeadLocation] = useState('');
  const [leadProduct, setLeadProduct] = useState('');

  const [custName, setCustName] = useState('');
  const [custCompany, setCustCompany] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [custCity, setCustCity] = useState('');

  if (!isQuickAddOpen) return null;

  const currentType = quickAddType || activeType;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentType === 'Sales Order') {
      const cust = customers.find(c => c.id === soCustomer) || customers[0];
      const prod = products.find(p => p.id === soProduct) || products[0];
      if (!cust || !prod) return;
      const total = soQuantity * (soRate || prod.sellingPricePerMT) * 1.05;

      addSalesOrder({
        customerId: cust.id,
        customerName: cust.customerName,
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        productId: prod.id,
        productName: prod.productName,
        quantityMT: Number(soQuantity),
        ratePerMT: Number(soRate || prod.sellingPricePerMT),
        discountPercent: 0,
        taxPercent: 5,
        totalAmount: total,
        paymentTerms: cust.paymentTerms,
        shippingAddress: cust.shippingAddress,
        status: 'Confirmed',
        notes: 'Entered via Quick Add'
      });
    } else if (currentType === 'Purchase Order') {
      const supp = suppliers.find(s => s.id === poSupplier) || suppliers[0];
      const mat = rawMaterials.find(m => m.id === poMaterial) || rawMaterials[0];
      if (!supp || !mat) return;
      const total = poQuantity * (poRate || mat.averageCost) * 1.05;

      addPurchaseOrder({
        supplierId: supp.id,
        supplierName: supp.supplierName,
        orderDate: new Date().toISOString().split('T')[0],
        expectedDelivery: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
        materialId: mat.id,
        materialName: mat.materialName,
        quantity: Number(poQuantity),
        unit: mat.unit,
        rate: Number(poRate || mat.averageCost),
        taxPercent: 5,
        freightCost: 5000,
        totalAmount: total + 5000,
        paymentTerms: supp.paymentTerms,
        notes: 'Entered via Quick Add'
      });
    } else if (currentType === 'Expense') {
      addExpense({
        category: expCategory,
        date: new Date().toISOString().split('T')[0],
        amount: Number(expAmount || 0),
        paidFromAccount: expPaidFrom || 'SBI Current Account',
        vendorName: expVendor,
        description: expDesc,
        invoiceOrVoucherNo: `VCH-${Math.floor(1000 + Math.random() * 9000)}`
      });
    } else if (currentType === 'Lead') {
      addLead({
        leadName: leadName,
        company: leadCompany,
        contactPerson: leadName,
        mobile: leadMobile,
        email: leadEmail,
        location: leadLocation,
        productInterested: leadProduct || (products[0]?.productName || ''),
        expectedQuantityMT: 10,
        leadSource: 'Direct Enquiry',
        estimatedValue: 0,
        followUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        salesperson: 'Sales Executive',
        status: 'New'
      });
    } else if (currentType === 'Customer') {
      addCustomer({
        customerName: custName,
        companyName: custCompany || custName,
        contactPerson: custName,
        mobile: custMobile,
        email: '',
        billingAddress: custCity,
        shippingAddress: custCity,
        gstin: '',
        state: custCity.split(',')[1]?.trim() || 'Gujarat',
        creditLimit: 1000000,
        paymentTerms: 'Net 30 Days',
        customerType: 'Dealer',
        assignedSalesperson: 'Sales Executive'
      });
    }

    setIsQuickAddOpen(false);
  };

  const actionTypes = [
    'Sales Order',
    'Purchase Order',
    'Expense',
    'Lead',
    'Customer'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="font-bold text-sm text-neutral-900 flex items-center gap-2">
            <span>Quick Create:</span>
            <span className="text-emerald-700 font-semibold">{currentType}</span>
          </div>
          <button 
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1 text-neutral-400 hover:text-neutral-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab pills */}
        {!quickAddType && (
          <div className="px-4 py-2 border-b border-neutral-100 flex items-center gap-1.5 overflow-x-auto bg-neutral-50/50">
            {actionTypes.map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeType === t 
                    ? 'bg-neutral-900 text-white font-medium' 
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {currentType === 'Sales Order' && (
            <>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Select Customer</label>
                <select
                  value={soCustomer}
                  onChange={(e) => setSoCustomer(e.target.value)}
                  className="w-full border border-neutral-300 rounded p-2 bg-white"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.customerName} ({c.state})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Finished Product</label>
                  <select
                    value={soProduct}
                    onChange={(e) => {
                      setSoProduct(e.target.value);
                      const prod = products.find(p => p.id === e.target.value);
                      if (prod) setSoRate(prod.sellingPricePerMT);
                    }}
                    className="w-full border border-neutral-300 rounded p-2 bg-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.productName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Quantity (MT)</label>
                  <input
                    type="number"
                    min="1"
                    value={soQuantity}
                    onChange={(e) => setSoQuantity(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Selling Rate (₹ / MT)</label>
                  <input
                    type="number"
                    value={soRate}
                    onChange={(e) => setSoRate(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="text-[11px] text-neutral-500">Est. Total with 5% GST:</div>
                  <div className="font-bold text-sm text-neutral-900 font-mono mt-0.5">
                    ₹{((soQuantity * soRate) * 1.05).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </>
          )}

          {currentType === 'Purchase Order' && (
            <>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Select Supplier</label>
                <select
                  value={poSupplier}
                  onChange={(e) => setPoSupplier(e.target.value)}
                  className="w-full border border-neutral-300 rounded p-2 bg-white"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.supplierName} ({s.address.split(',')[1] || 'Mine'})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Raw Material</label>
                  <select
                    value={poMaterial}
                    onChange={(e) => {
                      setPoMaterial(e.target.value);
                      const m = rawMaterials.find(rm => rm.id === e.target.value);
                      if (m) setPoRate(m.averageCost);
                    }}
                    className="w-full border border-neutral-300 rounded p-2 bg-white"
                  >
                    {rawMaterials.map(m => (
                      <option key={m.id} value={m.id}>{m.materialName} ({m.unit})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={poQuantity}
                    onChange={(e) => setPoQuantity(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Purchase Rate (₹)</label>
                  <input
                    type="number"
                    value={poRate}
                    onChange={(e) => setPoRate(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="text-[11px] text-neutral-500">Est. Total:</div>
                  <div className="font-bold text-sm text-neutral-900 font-mono mt-0.5">
                    ₹{((poQuantity * poRate) * 1.05 + 5000).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </>
          )}

          {currentType === 'Expense' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Expense Category</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 bg-white"
                  >
                    <option value="Electricity & Power">Electricity &amp; Power</option>
                    <option value="Fuel & Diesel (DG/Boiler)">Fuel &amp; Diesel (DG/Boiler)</option>
                    <option value="Labour & Wages">Labour &amp; Wages</option>
                    <option value="Freight & Transport">Freight &amp; Transport</option>
                    <option value="Machinery Repairs & Spares">Machinery Repairs &amp; Spares</option>
                    <option value="Packaging Materials">Packaging Materials</option>
                    <option value="Factory Rent">Factory Rent</option>
                    <option value="Staff Salaries">Staff Salaries</option>
                    <option value="Office & Admin">Office &amp; Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Vendor / Payee</label>
                  <input
                    type="text"
                    value={expVendor}
                    onChange={(e) => setExpVendor(e.target.value)}
                    placeholder="e.g. PGVCL / IOCL Petrol Pump"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Paid From Account</label>
                  <input
                    type="text"
                    value={expPaidFrom}
                    onChange={(e) => setExpPaidFrom(e.target.value)}
                    placeholder="e.g. SBI Industrial Current A/c"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Description / Bill Notes</label>
                <textarea
                  rows={2}
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Details of expense..."
                  className="w-full border border-neutral-300 rounded p-2"
                />
              </div>
            </>
          )}

          {currentType === 'Lead' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Lead Contact Name</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Anand Sharma"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    placeholder="e.g. Gujarat Crop Sciences"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Mobile</label>
                  <input
                    type="text"
                    value={leadMobile}
                    onChange={(e) => setLeadMobile(e.target.value)}
                    placeholder="+91 98250 12345"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Product Interested</label>
                  <select
                    value={leadProduct}
                    onChange={(e) => setLeadProduct(e.target.value)}
                    className="w-full border border-neutral-300 rounded p-2 bg-white"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.productName}>{p.productName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {currentType === 'Customer' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Customer / Agency Name</label>
                  <input
                    type="text"
                    required
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Shree Ram Agro Center"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Company / Firm Name</label>
                  <input
                    type="text"
                    value={custCompany}
                    onChange={(e) => setCustCompany(e.target.value)}
                    placeholder="e.g. Shree Ram Agro Center LLP"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Mobile</label>
                  <input
                    type="text"
                    value={custMobile}
                    onChange={(e) => setCustMobile(e.target.value)}
                    placeholder="+91 98250 99881"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">City / Location</label>
                  <input
                    type="text"
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    placeholder="Rajkot, Gujarat"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
              className="px-3 py-1.5 border border-neutral-300 hover:bg-neutral-100 rounded text-neutral-700 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save &amp; Create</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
