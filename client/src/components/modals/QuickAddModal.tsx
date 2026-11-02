import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, AlertTriangle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { LeadFormFields, LeadFormState, validateLeadForm } from '../crm/LeadFormFields';
import { useModalDismiss } from '../../hooks/useModalDismiss';
import { CustomSelect } from '../common/CustomSelect';

export const QuickAddModal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isQuickAddOpen, 
    setIsQuickAddOpen, 
    quickAddType, 
    setQuickAddType,
    customers,
    suppliers,
    products,
    rawMaterials,
    salesOrders,
    getCustomerCredit,
    addLead,
    addCustomer,
    addSalesOrder,
    addPurchaseOrder,
    addGRN,
    addExpense,
    setActiveModule
  } = useERP();

  const { contentRef, handleMouseDown, handleClick } = useModalDismiss(
    isQuickAddOpen,
    () => setIsQuickAddOpen(false)
  );

  const [activeType, setActiveType] = useState<string>(quickAddType || 'Sales Order');
  const [creditError, setCreditError] = useState<string | null>(null);

  // Form states
  const [soCustomer, setSoCustomer] = useState('');
  const [soProduct, setSoProduct] = useState('');
  const [soQuantity, setSoQuantity] = useState<number | ''>('');
  const [soRate, setSoRate] = useState<number | ''>('');

  const selectedSoCustomer = customers.find(c => c.id === soCustomer) || null;
  const selectedSoProduct = products.find(p => p.id === soProduct) || null;
  const estOrderTotal = Number(soQuantity || 0) * Number(soRate || selectedSoProduct?.sellingPricePerMT || 0) * 1.05;

  const currentCredit = useMemo(() => {
    return selectedSoCustomer ? getCustomerCredit(selectedSoCustomer) : { creditLimit: 0, usedCredit: 0, availableCredit: 0, orderCount: 0 };
  }, [selectedSoCustomer, salesOrders, getCustomerCredit]);

  const isCreditExceeded = selectedSoCustomer ? (Number(selectedSoCustomer?.creditLimit) || 0) > 0 && estOrderTotal > currentCredit.availableCredit : false;

  // Clear credit error on input change or modal toggle
  useEffect(() => {
    setCreditError(null);
  }, [soCustomer, soProduct, soQuantity, soRate, isQuickAddOpen]);

  const [poSupplier, setPoSupplier] = useState('');
  const [poMaterial, setPoMaterial] = useState('');
  const [poQuantity, setPoQuantity] = useState<number | ''>('');
  const [poRate, setPoRate] = useState<number | ''>('');

  const [expCategory, setExpCategory] = useState<any>('');
  const [expAmount, setExpAmount] = useState<number | ''>('');
  const [expVendor, setExpVendor] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expPaidFrom, setExpPaidFrom] = useState('');

  const getInitialLeadState = (): LeadFormState => ({
    leadName: '',
    company: '',
    contactPerson: '',
    mobile: '',
    email: '',
    address: '',
    location: '',
    productInterested: '',
    expectedQuantityMT: '',
    estimatedValue: '',
    followUpDate: '',
    followUpTime: '',
    salesperson: '',
    leadSource: '',
    status: 'New',
    notes: '',
    lostReason: ''
  });

  const [leadFormData, setLeadFormData] = useState<LeadFormState>(getInitialLeadState);
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});

  const [custName, setCustName] = useState('');
  const [custCompany, setCustCompany] = useState('');
  const [custMobile, setCustMobile] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custCity, setCustCity] = useState('');
  const [custGstin, setCustGstin] = useState('');
  const [custBillingAddress, setCustBillingAddress] = useState('');
  const [custShippingAddress, setCustShippingAddress] = useState('');
  const [custState, setCustState] = useState('');
  const [custType, setCustType] = useState<any>('Dealer');
  const [custSalesperson, setCustSalesperson] = useState('');
  const [custCreditLimit, setCustCreditLimit] = useState<number | ''>('');
  const [custPaymentTerms, setCustPaymentTerms] = useState('Net 30 Days');

  const resetFormState = () => {
    setSoCustomer('');
    setSoProduct('');
    setSoQuantity('');
    setSoRate('');
    setPoSupplier('');
    setPoMaterial('');
    setPoQuantity('');
    setPoRate('');
    setExpCategory('');
    setExpAmount('');
    setExpVendor('');
    setExpDesc('');
    setExpPaidFrom('');
    setLeadFormData(getInitialLeadState());
    setLeadErrors({});
    setCustName('');
    setCustCompany('');
    setCustMobile('');
    setCustEmail('');
    setCustCity('');
    setCustGstin('');
    setCustBillingAddress('');
    setCustShippingAddress('');
    setCustState('');
    setCustType('Dealer');
    setCustSalesperson('');
    setCustCreditLimit('');
    setCustPaymentTerms('Net 30 Days');
    setCreditError(null);
  };

  // Reset all forms when modal opens or quickAddType changes
  useEffect(() => {
    if (isQuickAddOpen) {
      resetFormState();
    }
  }, [isQuickAddOpen]);

  useEffect(() => {
    if (quickAddType) {
      setActiveType(quickAddType);
    }
  }, [quickAddType]);

  if (!isQuickAddOpen) return null;

  const currentType = quickAddType || activeType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreditError(null);

    try {
      if (currentType === 'Sales Order') {
        const cust = selectedSoCustomer;
        const prod = selectedSoProduct;
        if (!cust) {
          setCreditError('Please select a customer for the sales order.');
          return;
        }
        if (!prod) {
          setCreditError('Please select a finished product for the sales order.');
          return;
        }
        if (!soQuantity || Number(soQuantity) <= 0) {
          setCreditError('Please enter a valid quantity in MT.');
          return;
        }
        const total = estOrderTotal;

        if (Number(cust.creditLimit) > 0 && total > currentCredit.availableCredit) {
          const errMsg = `Order Rejected: Credit limit exceeded for ${cust.customerName}. Available credit limit is ₹${currentCredit.availableCredit.toLocaleString('en-IN')}, but order amount is ₹${total.toLocaleString('en-IN')}. (Total Credit Limit: ₹${currentCredit.creditLimit.toLocaleString('en-IN')}, Already Utilized: ₹${currentCredit.usedCredit.toLocaleString('en-IN')}).`;
          setCreditError(errMsg);
          return;
        }

        const savedOrder = await addSalesOrder({
          customerId: cust.id,
          customerName: cust.customerName,
          orderDate: new Date().toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          productId: prod.id,
          productName: prod.productName,
          hsnCode: prod.hsnCode,
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

        resetFormState();
        setIsQuickAddOpen(false);

        if (savedOrder.stockAvailable) {
          setActiveModule('Dispatch & Logistics');
          navigate('/dispatch');
        } else {
          setActiveModule('Production');
          navigate('/production');
        }
        return;
      } else if (currentType === 'Purchase Order') {
        const supp = suppliers.find(s => s.id === poSupplier);
        const mat = rawMaterials.find(m => m.id === poMaterial);
        if (!supp) {
          alert('Please select a supplier for the purchase order.');
          return;
        }
        if (!mat) {
          alert('Please select a raw material.');
          return;
        }
        if (!poQuantity || Number(poQuantity) <= 0) {
          alert('Please enter a valid quantity.');
          return;
        }
        const unitRate = Number(poRate || mat.averageCost || 0);
        const total = Number(poQuantity) * unitRate * 1.05;

        await addPurchaseOrder({
          supplierId: supp.id,
          supplierName: supp.supplierName,
          orderDate: new Date().toISOString().split('T')[0],
          expectedDelivery: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
          materialId: mat.id,
          materialName: mat.materialName,
          quantity: Number(poQuantity),
          unit: mat.unit,
          rate: unitRate,
          taxPercent: 5,
          freightCost: 5000,
          totalAmount: total + 5000,
          paymentTerms: supp.paymentTerms,
          notes: 'Entered via Quick Add'
        });
      } else if (currentType === 'Expense') {
        if (!expCategory) {
          alert('Please select an expense category.');
          return;
        }
        if (!expAmount || Number(expAmount) <= 0) {
          alert('Please enter an expense amount.');
          return;
        }
        await addExpense({
          category: expCategory,
          date: new Date().toISOString().split('T')[0],
          amount: Number(expAmount || 0),
          paidFromAccount: expPaidFrom || 'SBI Industrial Current A/c',
          vendorName: expVendor,
          description: expDesc,
          invoiceOrVoucherNo: `VCH-${Math.floor(1000 + Math.random() * 9000)}`
        });
      } else if (currentType === 'Lead') {
        const errs = validateLeadForm(leadFormData);
        if (Object.keys(errs).length > 0) {
          setLeadErrors(errs);
          return;
        }

        await addLead({
          leadName: leadFormData.leadName.trim(),
          company: leadFormData.company.trim(),
          contactPerson: leadFormData.contactPerson.trim() || leadFormData.leadName.trim(),
          mobile: leadFormData.mobile.trim(),
          email: leadFormData.email.trim(),
          address: leadFormData.address.trim() || leadFormData.location.trim(),
          location: leadFormData.location.trim() || leadFormData.address.trim(),
          productInterested: leadFormData.productInterested.trim(),
          expectedQuantityMT: Number(leadFormData.expectedQuantityMT || 0),
          estimatedValue: Number(leadFormData.estimatedValue || 0),
          leadSource: leadFormData.leadSource || 'Direct Enquiry',
          followUpDate: leadFormData.followUpDate,
          followUpTime: leadFormData.followUpTime,
          salesperson: leadFormData.salesperson || 'Sales Executive',
          status: leadFormData.status || 'New',
          notes: leadFormData.notes,
          lostReason: leadFormData.lostReason
        });
      } else if (currentType === 'Customer') {
        if (!custName.trim()) {
          alert('Please enter a customer name.');
          return;
        }
        const fullBilling = custBillingAddress || (custCity ? `${custCity}, ${custState}` : '');
        const fullShipping = custShippingAddress || fullBilling;
        await addCustomer({
          customerName: custName,
          companyName: custCompany || custName,
          contactPerson: custName,
          mobile: custMobile,
          email: custEmail,
          billingAddress: fullBilling,
          shippingAddress: fullShipping,
          gstin: custGstin,
          state: custState || 'Gujarat',
          creditLimit: Number(custCreditLimit || 1000000),
          paymentTerms: custPaymentTerms || 'Net 30 Days',
          customerType: custType || 'Dealer',
          assignedSalesperson: custSalesperson || 'Sales Executive'
        });
      }

      resetFormState();
      setIsQuickAddOpen(false);
    } catch (err) {
      console.error("Quick add error:", err);
      // Keep state so user can retry
    }
  };

  const actionTypes = [
    'Sales Order',
    'Purchase Order',
    'Expense',
    'Lead',
    'Customer'
  ];

  return (
    <div
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <div
        ref={contentRef}
        className={`bg-white rounded-xl shadow-2xl border border-neutral-200 w-full overflow-hidden flex flex-col max-h-[90vh] ${
          currentType === 'Lead' ? 'max-w-2xl' : 'max-w-xl'
        }`}
      >
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
                onClick={() => {
                  setActiveType(t);
                  resetFormState();
                }}
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[calc(90vh-130px)]">
          {creditError && (
            <div className="p-3 bg-rose-50 border-2 border-rose-400 rounded-lg text-rose-900 text-xs flex items-start justify-between gap-2 shadow-xs animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-rose-800">🚫 ORDER REJECTED: CREDIT LIMIT EXCEEDED</div>
                  <div className="text-[11px] leading-relaxed text-rose-950 font-medium">{creditError}</div>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setCreditError(null)} 
                className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentType === 'Sales Order' && (
            <>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Select Customer</label>
                <CustomSelect
                  value={soCustomer}
                  onChange={setSoCustomer}
                  placeholder="Select Customer"
                  options={customers.map(c => ({ value: c.id, label: `${c.customerName} (${c.state})` }))}
                />
              </div>

              {/* Customer Credit Limit Live Badge / Warning */}
              {selectedSoCustomer && Number(selectedSoCustomer.creditLimit) > 0 && (
                <div className={`p-3 rounded-lg border text-xs transition-colors ${
                  isCreditExceeded ? 'bg-rose-50 border-rose-300' : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-neutral-700">Credit Limit Status:</span>
                    <span className={`font-mono font-bold ${isCreditExceeded ? 'text-rose-700' : 'text-emerald-700'}`}>
                      Available: ₹{currentCredit.availableCredit.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
                    <span>Total Limit: ₹{currentCredit.creditLimit.toLocaleString('en-IN')}</span>
                    <span>Utilized: ₹{currentCredit.usedCredit.toLocaleString('en-IN')} ({currentCredit.orderCount} active orders)</span>
                  </div>

                  {isCreditExceeded ? (
                    <div className="mt-2 p-2 bg-rose-100 border border-rose-300 rounded text-rose-900 font-semibold text-[11px] flex items-start gap-1.5 animate-in fade-in">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        ⛔ <strong>ORDER WILL BE REJECTED:</strong> This order (₹{estOrderTotal.toLocaleString('en-IN')}) exceeds available credit (₹{currentCredit.availableCredit.toLocaleString('en-IN')}) by ₹{(estOrderTotal - currentCredit.availableCredit).toLocaleString('en-IN')}.
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1.5 text-[11px] text-emerald-700 font-medium flex items-center justify-between border-t border-neutral-200/60 pt-1">
                      <span>Remaining after this order:</span>
                      <span className="font-mono font-bold">₹{Math.max(0, currentCredit.availableCredit - estOrderTotal).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Finished Product</label>
                <CustomSelect
                  value={soProduct}
                  onChange={(val) => {
                    setSoProduct(val);
                    const prod = products.find(p => p.id === val);
                    if (prod) setSoRate(prod.sellingPricePerMT);
                  }}
                  placeholder="Select Finished Product"
                  options={products.map(p => ({ value: p.id, label: p.productName }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">HSN Code</label>
                  <input
                    type="text"
                    value={selectedSoProduct?.hsnCode || ''}
                    readOnly
                    disabled
                    placeholder="Auto-fetched HSN"
                    className="w-full border border-neutral-200 rounded p-2 bg-neutral-100 text-neutral-600 font-mono cursor-not-allowed select-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Quantity (MT)</label>
                  <input
                    type="number"
                    min="1"
                    value={soQuantity}
                    onChange={(e) => setSoQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 25"
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
                    onChange={(e) => setSoRate(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 6200"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="text-[11px] text-neutral-500">Est. Total with 5% GST:</div>
                  <div className="font-bold text-sm text-neutral-900 font-mono mt-0.5">
                    ₹{((Number(soQuantity || 0) * Number(soRate || 0)) * 1.05).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </>
          )}

          {currentType === 'Purchase Order' && (
            <>
              <div>
                <label className="block text-neutral-700 font-medium mb-1">Select Supplier</label>
                <CustomSelect
                  value={poSupplier}
                  onChange={setPoSupplier}
                  placeholder="Select Supplier"
                  options={suppliers.map(s => ({ value: s.id, label: `${s.supplierName} (${s.address.split(',')[1] || 'Mine'})` }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Raw Material</label>
                  <CustomSelect
                    value={poMaterial}
                    onChange={(val) => {
                      setPoMaterial(val);
                      const m = rawMaterials.find(rm => rm.id === val);
                      if (m) setPoRate(m.averageCost);
                    }}
                    placeholder="Select Raw Material"
                    options={rawMaterials.map(m => ({ value: m.id, label: `${m.materialName} (${m.unit})` }))}
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={poQuantity}
                    onChange={(e) => setPoQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 40"
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
                    onChange={(e) => setPoRate(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 2200"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="text-[11px] text-neutral-500">Est. Total:</div>
                  <div className="font-bold text-sm text-neutral-900 font-mono mt-0.5">
                    ₹{(poQuantity && poRate ? ((Number(poQuantity) * Number(poRate)) * 1.05 + 5000) : 0).toLocaleString('en-IN')}
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
                  <CustomSelect
                    value={expCategory}
                    onChange={setExpCategory}
                    placeholder="Select Expense Category"
                    options={[
                      'Electricity & Power',
                      'Fuel & Diesel (DG/Boiler)',
                      'Labour & Wages',
                      'Freight & Transport',
                      'Machinery Repairs & Spares',
                      'Packaging Materials',
                      'Factory Rent',
                      'Staff Salaries',
                      'Office & Admin'
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 5000"
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
                  <label className="block text-neutral-700 font-medium mb-1">Paid From</label>
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
            <LeadFormFields
              formData={leadFormData}
              setFormData={setLeadFormData}
              errors={leadErrors}
              setErrors={setLeadErrors}
              products={products}
              isEdit={false}
            />
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
              <div className="grid grid-cols-3 gap-3">
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
                  <label className="block text-neutral-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="contact@firm.com"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">GSTIN</label>
                  <input
                    type="text"
                    value={custGstin}
                    onChange={(e) => setCustGstin(e.target.value)}
                    placeholder="24AAAAA0000A1Z5"
                    className="w-full border border-neutral-300 rounded p-2 font-mono uppercase"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={custCity}
                    onChange={(e) => setCustCity(e.target.value)}
                    placeholder="Rajkot"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={custState}
                    onChange={(e) => setCustState(e.target.value)}
                    placeholder="Gujarat"
                    className="w-full border border-neutral-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-medium mb-1">Customer Type</label>
                  <CustomSelect
                    value={custType}
                    onChange={setCustType}
                    options={['Dealer', 'Supplier', 'Vendor', 'End User', 'Fertilizer']}
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Credit Limit (₹)</label>
                <input
                  type="number"
                  value={custCreditLimit}
                  onChange={(e) => setCustCreditLimit(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 1000000"
                  className="w-full border border-neutral-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Full Billing Address</label>
                <textarea
                  rows={2}
                  value={custBillingAddress}
                  onChange={(e) => setCustBillingAddress(e.target.value)}
                  placeholder="Plot #, GIDC Estate, City, State, Pincode"
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-medium mb-1">Shipping Address</label>
                <textarea
                  rows={2}
                  value={custShippingAddress}
                  onChange={(e) => setCustShippingAddress(e.target.value)}
                  placeholder="Destination warehouse or factory address"
                  className="w-full border border-neutral-300 rounded p-2 text-xs"
                />
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
