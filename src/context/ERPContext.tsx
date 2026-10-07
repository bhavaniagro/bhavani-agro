import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CompanyProfile,
  Customer,
  Supplier,
  RawMaterial,
  FinishedProduct,
  BOM,
  Lead,
  SalesOrder,
  PurchaseOrder,
  GRN,
  QCInspection,
  ProductionOrder,
  ProductionBatch,
  DispatchChallan,
  VehicleMaster,
  SalesInvoice,
  PaymentTransaction,
  ExpenseRecord,
  Machinery,
  Employee,
  ErpDocument,
  ErpAlert,
  UserRole
} from '../types/erp';
import {
  initialCompanyProfile,
  initialCustomers,
  initialSuppliers,
  initialFinishedProducts,
  initialRawMaterials,
  initialBOMs
} from '../data/seedData';
import {
  initialLeads,
  initialSalesOrders,
  initialPurchaseOrders,
  initialGRNs,
  initialQCInspections,
  initialProductionOrders,
  initialProductionBatches,
  initialVehicles,
  initialDispatches,
  initialInvoices,
  initialExpenses,
  initialMachinery,
  initialEmployees,
  initialDocuments,
  initialAlerts
} from '../data/seedTransactions';
//add this line by me for
// Firebase customer service
// Handles customer data operations with Firestore.
import {
  createCustomer,
  getCustomers,
} from '../services/customers/customer.service';


export type ERPModule =
  | 'Dashboard'
  | 'CRM & Sales'
  | 'Purchase'
  | 'Raw Material'
  | 'Production'
  | 'Quality Control'
  | 'Finished Goods'
  | 'Inventory'
  | 'Dispatch & Logistics'
  | 'Customers'
  | 'Suppliers'
  | 'Finance & Accounts'
  | 'Expenses'
  | 'Employees'
  | 'Maintenance'
  | 'Documents'
  | 'Reports & Analytics'
  | 'Settings';

interface PrintableDoc {
  type: 'invoice' | 'challan' | 'qc_cert';
  data: any;
}

interface ERPContextType {
  activeModule: ERPModule;
  setActiveModule: (module: ERPModule) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;

  // Master & Transaction States
  company: CompanyProfile;
  setCompany: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  customers: Customer[];
  suppliers: Supplier[];
  rawMaterials: RawMaterial[];
  products: FinishedProduct[];
  boms: BOM[];
  leads: Lead[];
  salesOrders: SalesOrder[];
  purchaseOrders: PurchaseOrder[];
  grns: GRN[];
  qcInspections: QCInspection[];
  productionOrders: ProductionOrder[];
  productionBatches: ProductionBatch[];
  vehicles: VehicleMaster[];
  dispatches: DispatchChallan[];
  invoices: SalesInvoice[];
  payments: PaymentTransaction[];
  expenses: ExpenseRecord[];
  machinery: Machinery[];
  employees: Employee[];
  documents: ErpDocument[];
  alerts: ErpAlert[];

  // Global Dialog States
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  quickAddType: string | null;
  setQuickAddType: (type: string | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  printableDoc: PrintableDoc | null;
  setPrintableDoc: (doc: PrintableDoc | null) => void;
  isDemoRunnerOpen: boolean;
  setIsDemoRunnerOpen: (open: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;

  // Actions & Automations
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  convertLeadToCustomer: (leadId: string) => void;
  addCustomer: (cust: Omit<Customer, 'id' | 'code' | 'totalSales' | 'outstandingBalance' | 'createdAt'>) => void;
  addSalesOrder: (so: Omit<SalesOrder, 'id' | 'orderNumber' | 'stockAvailable'>) => void;
  createProductionOrderFromSO: (salesOrderId: string) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status'>) => void;
  addGRN: (grn: Omit<GRN, 'id' | 'grnNumber' | 'qcStatus' | 'enteredInventory'>) => void;
  approveQC: (qcId: string) => void;
  rejectQC: (qcId: string, reason: string) => void;
  startProductionOrder: (poId: string) => void;
  completeProductionOrder: (poId: string, outputMT: number, remarks?: string) => void;
  createDispatchChallan: (dispatch: Omit<DispatchChallan, 'id' | 'dispatchNumber' | 'status'>) => void;
  updateDispatchStatus: (dispatchId: string, status: DispatchChallan['status']) => void;
  generateInvoiceFromDispatch: (dispatchId: string) => void;
  recordCustomerPayment: (invoiceId: string, amount: number, mode: 'NEFT/RTGS' | 'Cheque' | 'Cash' | 'UPI', reference: string) => void;
  addExpense: (expense: Omit<ExpenseRecord, 'id' | 'expenseNumber' | 'status'>) => void;
  addRawMaterial: (rm: Omit<RawMaterial, 'id' | 'currentStock' | 'totalPurchases' | 'totalConsumption' | 'reservedStock'>) => void;
  markAlertRead: (alertId: string) => void;
  resetAllData: () => void;
  runDemoStepAction: (step: number) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ERPModule>('Dashboard');
  const [activeRole, setActiveRole] = useState<UserRole>('Owner / Admin');

  // Load from LocalStorage if exists
  const loadStored = <T,>(key: string, defaultVal: T): T => {
    try {
      const stored = localStorage.getItem(`bhavani_erp_${key}`);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [company, setCompany] = useState<CompanyProfile>(() => loadStored('company', initialCompanyProfile));
  const [customers, setCustomers] = useState<Customer[]>(() => loadStored('customers', initialCustomers));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadStored('suppliers', initialSuppliers));
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => loadStored('rawMaterials', initialRawMaterials));
  const [products, setProducts] = useState<FinishedProduct[]>(() => loadStored('products', initialFinishedProducts));
  const [boms, setBOMs] = useState<BOM[]>(() => loadStored('boms', initialBOMs));
  const [leads, setLeads] = useState<Lead[]>(() => loadStored('leads', initialLeads));
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => loadStored('salesOrders', initialSalesOrders));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => loadStored('purchaseOrders', initialPurchaseOrders));
  const [grns, setGRNs] = useState<GRN[]>(() => loadStored('grns', initialGRNs));
  const [qcInspections, setQCInspections] = useState<QCInspection[]>(() => loadStored('qcInspections', initialQCInspections));
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() => loadStored('productionOrders', initialProductionOrders));
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>(() => loadStored('productionBatches', initialProductionBatches));
  const [vehicles, setVehicles] = useState<VehicleMaster[]>(() => loadStored('vehicles', initialVehicles));
  const [dispatches, setDispatches] = useState<DispatchChallan[]>(() => loadStored('dispatches', initialDispatches));
  const [invoices, setInvoices] = useState<SalesInvoice[]>(() => loadStored('invoices', initialInvoices));
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => loadStored('payments', []));
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => loadStored('expenses', initialExpenses));
  const [machinery, setMachinery] = useState<Machinery[]>(() => loadStored('machinery', initialMachinery));
  const [employees, setEmployees] = useState<Employee[]>(() => loadStored('employees', initialEmployees));
  const [documents, setDocuments] = useState<ErpDocument[]>(() => loadStored('documents', initialDocuments));
  const [alerts, setAlerts] = useState<ErpAlert[]>(() => loadStored('alerts', initialAlerts));

  // Load customers from Firebase when the ERP starts
  useEffect(() => {
    const loadCustomersFromFirebase = async () => {
      try {
        const firebaseCustomers = await getCustomers();

        if (firebaseCustomers.length > 0) {
          setCustomers(firebaseCustomers);
        }
      } catch (error) {
        console.error('Failed to load customers from Firebase:', error);
      }
    };

    loadCustomersFromFirebase();
  }, []);
  // Dialog & Modal states
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [printableDoc, setPrintableDoc] = useState<PrintableDoc | null>(null);
  const [isDemoRunnerOpen, setIsDemoRunnerOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bhavani_erp_customers', JSON.stringify(customers));
      localStorage.setItem('bhavani_erp_rawMaterials', JSON.stringify(rawMaterials));
      localStorage.setItem('bhavani_erp_products', JSON.stringify(products));
      localStorage.setItem('bhavani_erp_salesOrders', JSON.stringify(salesOrders));
      localStorage.setItem('bhavani_erp_purchaseOrders', JSON.stringify(purchaseOrders));
      localStorage.setItem('bhavani_erp_productionOrders', JSON.stringify(productionOrders));
      localStorage.setItem('bhavani_erp_productionBatches', JSON.stringify(productionBatches));
      localStorage.setItem('bhavani_erp_dispatches', JSON.stringify(dispatches));
      localStorage.setItem('bhavani_erp_invoices', JSON.stringify(invoices));
      localStorage.setItem('bhavani_erp_expenses', JSON.stringify(expenses));
      localStorage.setItem('bhavani_erp_alerts', JSON.stringify(alerts));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [customers, rawMaterials, products, salesOrders, purchaseOrders, productionOrders, productionBatches, dispatches, invoices, expenses, alerts]);

  // Lead management
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const convertLeadToCustomer = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      code: `CUST-0${customers.length + 1}`,
      customerName: lead.leadName,
      companyName: lead.company,
      contactPerson: lead.contactPerson,
      mobile: lead.mobile,
      email: lead.email,
      billingAddress: `${lead.location}`,
      shippingAddress: `${lead.location}`,
      gstin: '24' + Math.random().toString(36).substring(2, 12).toUpperCase(),
      state: lead.location.split(',')[1]?.trim() || 'Gujarat',
      creditLimit: 2000000,
      paymentTerms: 'Net 30 Days',
      customerType: 'Distributor',
      assignedSalesperson: lead.salesperson,
      totalSales: 0,
      outstandingBalance: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [newCustomer, ...prev]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'Won' } : l));
    setAlerts(prev => [{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `Lead Converted to Customer`,
      description: `${lead.leadName} (${lead.company}) is now active in Customer Master.`,
      timestamp: 'Just now',
      module: 'Customers',
      read: false
    }, ...prev]);
  };

  // const addCustomer = (custData: Omit<Customer, 'id' | 'code' | 'totalSales' | 'outstandingBalance' | 'createdAt'>) => {
  //   const newCust: Customer = {
  //     ...custData,
  //     id: `cust-${Date.now()}`,
  //     code: `CUST-0${customers.length + 1}`,
  //     totalSales: 0,
  //     outstandingBalance: 0,
  //     createdAt: new Date().toISOString().split('T')[0]
  //   };
  //   setCustomers(prev => [newCust, ...prev]);
  // };
  // Create customer and save it to Firebase Firestore
  // Falls back to local state if the Firebase save fails.

  const addCustomer = async (
    custData: Omit<
      Customer,
      'id' | 'code' | 'totalSales' | 'outstandingBalance' | 'createdAt'
    >
  ) => {
    const newCustomer: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      code: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      totalSales: 0,
      outstandingBalance: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      const firebaseCustomerId = await createCustomer(newCustomer);

      const customerWithFirebaseId: Customer = {
        ...newCustomer,
        id: firebaseCustomerId,
      };

      setCustomers((prev) => [customerWithFirebaseId, ...prev]);
    } catch (error) {
      console.error('Failed to save customer to Firebase:', error);

      // Keep the existing demo behavior if Firebase save fails
      setCustomers((prev) => [newCustomer, ...prev]);
    }
  };

  // Automation 1: Sales Order Stock Check
  const addSalesOrder = (soData: Omit<SalesOrder, 'id' | 'orderNumber' | 'stockAvailable'>) => {
    const targetProduct = products.find(p => p.id === soData.productId);
    const availableStock = targetProduct ? targetProduct.currentStockMT - targetProduct.reservedStockMT : 0;
    const isStockAvailable = availableStock >= soData.quantityMT;

    const orderNum = `SO-2609-0${salesOrders.length + 90}`;
    const newOrder: SalesOrder = {
      ...soData,
      id: `so-${Date.now()}`,
      orderNumber: orderNum,
      stockAvailable: isStockAvailable,
      status: isStockAvailable ? 'Ready' : 'Production Required'
    };

    setSalesOrders(prev => [newOrder, ...prev]);

    // Update customer total sales
    setCustomers(prev => prev.map(c => c.id === soData.customerId ? { ...c, totalSales: c.totalSales + soData.totalAmount } : c));

    if (!isStockAvailable) {
      setAlerts(prev => [{
        id: `alt-${Date.now()}`,
        type: 'critical',
        title: `Production Required: ${soData.productName}`,
        description: `Order ${orderNum} for ${soData.quantityMT} MT exceeds free stock (${availableStock.toFixed(1)} MT). Production order planned.`,
        timestamp: 'Just now',
        module: 'Production',
        read: false
      }, ...prev]);
    }
  };

  // Automation 12: Sales Order -> Create Production Order
  const createProductionOrderFromSO = (salesOrderId: string) => {
    const so = salesOrders.find(o => o.id === salesOrderId);
    if (!so) return;

    const matchingBOM = boms.find(b => b.productId === so.productId) || boms[0];

    // Check required materials
    const materialCheck = matchingBOM.items.map(item => {
      const rm = rawMaterials.find(r => r.id === item.rawMaterialId);
      const required = item.quantityPerMT * so.quantityMT;
      const available = rm ? (rm.unit === 'MT' ? rm.currentStock * 1000 : rm.currentStock) : 0;
      return {
        materialId: item.rawMaterialId,
        materialName: item.rawMaterialName,
        requiredQty: required,
        availableQty: available,
        shortageQty: Math.max(0, required - available),
        unit: item.unit
      };
    });

    const hasShortage = materialCheck.some(m => m.shortageQty > 0);
    const poNum = `PO-MFG-0${productionOrders.length + 95}`;

    const newPO: ProductionOrder = {
      id: `po-mfg-${Date.now()}`,
      productionOrderNumber: poNum,
      salesOrderId: so.id,
      productId: so.productId,
      productName: so.productName,
      targetQuantityMT: so.quantityMT,
      bomId: matchingBOM.id,
      plannedStartDate: new Date().toISOString().split('T')[0],
      plannedEndDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      productionLine: 'Granulation Line 1',
      supervisor: 'Bipinchandra Solanki',
      priority: 'High',
      status: 'Planned',
      materialCheck,
      hasMaterialShortage: hasShortage,
      notes: `Generated automatically from Sales Order ${so.orderNumber}.`
    };

    setProductionOrders(prev => [newPO, ...prev]);
    setSalesOrders(prev => prev.map(o => o.id === salesOrderId ? { ...o, productionOrderId: newPO.id } : o));

    setAlerts(prev => [{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `Production Order ${poNum} Created`,
      description: `BOM verified for ${so.quantityMT} MT of ${so.productName}.`,
      timestamp: 'Just now',
      module: 'Production',
      read: false
    }, ...prev]);
  };

  // Automation 2 & 3: Start Production & Material Issue
  const startProductionOrder = (poId: string) => {
    const po = productionOrders.find(p => p.id === poId);
    if (!po) return;

    const bom = boms.find(b => b.id === po.bomId) || boms[0];

    // Deduct raw material stock
    setRawMaterials(prev => prev.map(rm => {
      const neededItem = bom.items.find(i => i.rawMaterialId === rm.id);
      if (!neededItem) return rm;
      const consumedAmount = (neededItem.quantityPerMT * po.targetQuantityMT) / (rm.unit === 'MT' ? 1000 : 1);
      const newStock = Math.max(0, rm.currentStock - consumedAmount);
      return {
        ...rm,
        currentStock: Number(newStock.toFixed(2)),
        totalConsumption: Number((rm.totalConsumption + consumedAmount).toFixed(2))
      };
    }));

    setProductionOrders(prev => prev.map(p => p.id === poId ? { ...p, status: 'In Production' } : p));
  };

  // Automation 4: Complete Production -> Create Batch & Send to QC
  const completeProductionOrder = (poId: string, outputMT: number, remarks = '') => {
    const po = productionOrders.find(p => p.id === poId);
    if (!po) return;

    const batchCode = `BNT-2609-${Math.floor(100 + Math.random() * 900)}`;

    const newBatch: ProductionBatch = {
      id: `batch-${Date.now()}`,
      batchNumber: batchCode,
      productId: po.productId,
      productName: po.productName,
      productionDate: new Date().toISOString().split('T')[0],
      productionOrderId: po.id,
      rawMaterialLots: [
        { lotNumber: 'LOT-RM-BNT-2609-01', materialName: 'Bentonite Lumps', quantityUsed: outputMT * 1010, unit: 'KG' },
        { lotNumber: 'LOT-CHEM-SIL-11', materialName: 'Liquid Silicate', quantityUsed: outputMT * 22, unit: 'KG' }
      ],
      quantityProducedMT: outputMT,
      quantityRemainingMT: outputMT,
      qcStatus: 'Pending',
      storageLocation: 'Finished Warehouse Bay 1',
      manufacturingDate: new Date().toISOString().split('T')[0],
      bestBeforeDate: new Date(Date.now() + 730 * 86400000).toISOString().split('T')[0],
      standardCostPerMT: 4350,
      actualCostPerMT: 4210
    };

    setProductionBatches(prev => [newBatch, ...prev]);

    // Create QC inspection record
    const newQC: QCInspection = {
      id: `qc-${Date.now()}`,
      qcNumber: `QC-2609-0${qcInspections.length + 60}`,
      type: 'Finished Goods',
      referenceId: batchCode,
      itemCode: po.productId,
      itemName: po.productName,
      batchLotNumber: batchCode,
      quantity: outputMT,
      unit: 'MT',
      inspectionDate: new Date().toISOString().split('T')[0],
      inspector: 'Manish Trivedi (QC Chemist)',
      parameters: [
        { parameter: 'Moisture Content %', specification: 'Max 8.0%', observedValue: '6.5%', status: 'Pass' },
        { parameter: 'Grain Size 16-30 Mesh', specification: 'Min 90% retained', observedValue: '94.2%', status: 'Pass' },
        { parameter: 'Swelling Volume ml/2g', specification: 'Min 24 ml', observedValue: '28.0 ml', status: 'Pass' },
        { parameter: 'Bag Weight & Stitching', specification: '50.0 kg ± 0.2 kg', observedValue: '50.1 kg', status: 'Pass' }
      ],
      overallStatus: 'Pending',
      remarks: 'Awaiting lab titration and sieve retention verification.'
    };

    setQCInspections(prev => [newQC, ...prev]);

    setProductionOrders(prev => prev.map(p => p.id === poId ? {
      ...p,
      status: 'QC',
      actualBatchNumber: batchCode,
      outputProducedMT: outputMT
    } : p));
  };

  // Automation 5: QC Approval -> Make Finished Goods Available for Sale
  const approveQC = (qcId: string) => {
    const qc = qcInspections.find(q => q.id === qcId);
    if (!qc) return;

    setQCInspections(prev => prev.map(q => q.id === qcId ? {
      ...q,
      overallStatus: 'Approved',
      parameters: q.parameters.map(p => ({ ...p, status: 'Pass' }))
    } : q));

    // If Finished Goods batch
    if (qc.type === 'Finished Goods') {
      const batch = productionBatches.find(b => b.batchNumber === qc.batchLotNumber);
      if (batch) {
        setProductionBatches(prev => prev.map(b => b.id === batch.id ? { ...b, qcStatus: 'Approved' } : b));

        // Add to finished goods stock
        setProducts(prev => prev.map(p => p.id === batch.productId ? {
          ...p,
          currentStockMT: Number((p.currentStockMT + batch.quantityProducedMT).toFixed(2))
        } : p));

        // Mark associated production order completed
        const po = productionOrders.find(p => p.id === batch.productionOrderId);
        if (po) {
          setProductionOrders(prev => prev.map(p => p.id === po.id ? { ...p, status: 'Completed' } : p));
          // If generated from sales order, mark sales order Ready!
          if (po.salesOrderId) {
            setSalesOrders(prev => prev.map(so => so.id === po.salesOrderId ? { ...so, status: 'Ready', stockAvailable: true } : so));
          }
        }
      }
    } else if (qc.type === 'Incoming Raw Material') {
      // Incoming GRN QC approved
      const grn = grns.find(g => g.internalLotNumber === qc.batchLotNumber || g.grnNumber === qc.referenceId);
      if (grn) {
        setGRNs(prev => prev.map(g => g.id === grn.id ? { ...g, qcStatus: 'Approved', enteredInventory: true } : g));
        // Add to raw material stock
        setRawMaterials(prev => prev.map(rm => rm.id === grn.materialId ? {
          ...rm,
          currentStock: Number((rm.currentStock + grn.acceptedQuantity).toFixed(2)),
          totalPurchases: Number((rm.totalPurchases + grn.acceptedQuantity).toFixed(2))
        } : rm));
      }
    }

    setAlerts(prev => [{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `QC Passed: ${qc.itemName}`,
      description: `Batch ${qc.batchLotNumber} approved. Inventory updated & released.`,
      timestamp: 'Just now',
      module: 'Quality Control',
      read: false
    }, ...prev]);
  };

  const rejectQC = (qcId: string, reason: string) => {
    setQCInspections(prev => prev.map(q => q.id === qcId ? {
      ...q,
      overallStatus: 'Rejected',
      remarks: reason
    } : q));
  };

  // Automation 6: Dispatch -> Deduct Finished Goods Stock
  const createDispatchChallan = (dispatchData: Omit<DispatchChallan, 'id' | 'dispatchNumber' | 'status'>) => {
    const dispNum = `DC-2609-0${dispatches.length + 65}`;
    const newDispatch: DispatchChallan = {
      ...dispatchData,
      id: `disp-${Date.now()}`,
      dispatchNumber: dispNum,
      status: 'Dispatched'
    };

    setDispatches(prev => [newDispatch, ...prev]);

    // Deduct finished goods stock
    const so = salesOrders.find(s => s.id === dispatchData.salesOrderId);
    if (so) {
      setProducts(prev => prev.map(p => p.id === so.productId ? {
        ...p,
        currentStockMT: Math.max(0, Number((p.currentStockMT - dispatchData.quantityMT).toFixed(2)))
      } : p));

      setSalesOrders(prev => prev.map(s => s.id === so.id ? {
        ...s,
        status: 'Dispatched',
        dispatchId: newDispatch.id
      } : s));
    }
  };

  const updateDispatchStatus = (dispatchId: string, status: DispatchChallan['status']) => {
    setDispatches(prev => prev.map(d => d.id === dispatchId ? { ...d, status } : d));
  };

  // Automation 7: Generate Invoice from Dispatch / Sales Order -> Create Receivable
  const generateInvoiceFromDispatch = (dispatchId: string) => {
    const disp = dispatches.find(d => d.id === dispatchId);
    if (!disp) return;

    const cust = customers.find(c => c.id === disp.customerId);
    const so = salesOrders.find(s => s.id === disp.salesOrderId);
    const product = products.find(p => p.productName === disp.productName);

    const rate = so ? so.ratePerMT : (product ? product.sellingPricePerMT : 6200);
    const taxable = disp.quantityMT * rate;
    const gstRate = 0.05;
    const taxAmt = taxable * gstRate;
    const total = taxable + taxAmt;
    const isInterstate = cust ? cust.state !== 'Gujarat' : false;

    const invNum = `INV-2609-0${invoices.length + 85}`;
    const newInvoice: SalesInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      salesOrderId: disp.salesOrderId,
      dispatchId: disp.id,
      customerId: disp.customerId,
      customerName: disp.customerName,
      gstin: cust ? cust.gstin : '24AABCK9921E1Z4',
      billingAddress: cust ? cust.billingAddress : 'Gujarat',
      shippingAddress: disp.destination,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      productName: disp.productName,
      hsnCode: product ? product.hsnCode : '25081010',
      quantityMT: disp.quantityMT,
      ratePerMT: rate,
      discountAmount: 0,
      taxableValue: taxable,
      cgstAmount: isInterstate ? 0 : taxAmt / 2,
      sgstAmount: isInterstate ? 0 : taxAmt / 2,
      igstAmount: isInterstate ? taxAmt : 0,
      totalTax: taxAmt,
      freightAmount: disp.freightAmountRs,
      roundOff: 0,
      totalInvoiceAmount: total,
      paidAmount: 0,
      balanceAmount: total,
      paymentStatus: 'Unpaid',
      paymentTerms: cust ? cust.paymentTerms : 'Net 30 Days'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setDispatches(prev => prev.map(d => d.id === dispatchId ? { ...d, invoiceId: newInvoice.id, invoiceNumber: invNum } : d));

    // Automation 8: Update Customer Outstanding
    setCustomers(prev => prev.map(c => c.id === disp.customerId ? {
      ...c,
      outstandingBalance: c.outstandingBalance + total
    } : c));

    setAlerts(prev => [{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `Invoice ${invNum} Generated`,
      description: `Amount ₹${total.toLocaleString('en-IN')} billed to ${disp.customerName}. Receivable created.`,
      timestamp: 'Just now',
      module: 'Finance & Accounts',
      read: false
    }, ...prev]);
  };

  // Automation 8: Record Payment -> Update Customer Outstanding
  const recordCustomerPayment = (invoiceId: string, amount: number, mode: 'NEFT/RTGS' | 'Cheque' | 'Cash' | 'UPI', reference: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    const newPaid = inv.paidAmount + amount;
    const newBalance = Math.max(0, inv.totalInvoiceAmount - newPaid);
    const newStatus = newBalance === 0 ? 'Paid' : (newPaid > 0 ? 'Partially Paid' : 'Unpaid');

    setInvoices(prev => prev.map(i => i.id === invoiceId ? {
      ...i,
      paidAmount: newPaid,
      balanceAmount: newBalance,
      paymentStatus: newStatus
    } : i));

    // Update customer outstanding balance
    setCustomers(prev => prev.map(c => c.id === inv.customerId ? {
      ...c,
      outstandingBalance: Math.max(0, c.outstandingBalance - amount)
    } : c));

    // Record transaction
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      transactionNumber: `TXN-REC-0${payments.length + 120}`,
      type: 'Customer Receipt',
      partyId: inv.customerId,
      partyName: inv.customerName,
      referenceInvoiceNumber: inv.invoiceNumber,
      paymentDate: new Date().toISOString().split('T')[0],
      amount,
      paymentMode: mode,
      bankReference: reference,
      notes: `Received towards invoice ${inv.invoiceNumber}`
    };
    setPayments(prev => [newTx, ...prev]);

    setAlerts(prev => [{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `Payment Received: ₹${amount.toLocaleString('en-IN')}`,
      description: `Cleared against invoice ${inv.invoiceNumber} from ${inv.customerName}.`,
      timestamp: 'Just now',
      module: 'Finance & Accounts',
      read: false
    }, ...prev]);
  };

  // Purchase Order & GRN
  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status'>) => {
    const poNum = `PO-2609-0${purchaseOrders.length + 50}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now()}`,
      poNumber: poNum,
      status: 'Issued'
    };
    setPurchaseOrders(prev => [newPO, ...prev]);
  };

  // Automation 9 & 10: GRN -> QC & Inventory
  const addGRN = (grnData: Omit<GRN, 'id' | 'grnNumber' | 'qcStatus' | 'enteredInventory'>) => {
    const grnNum = `GRN-2609-0${grns.length + 35}`;
    const newGRN: GRN = {
      ...grnData,
      id: `grn-${Date.now()}`,
      grnNumber: grnNum,
      qcStatus: 'Approved', // Quick auto-approve or test
      enteredInventory: true
    };

    setGRNs(prev => [newGRN, ...prev]);

    // Add accepted quantity to Raw Material Inventory
    setRawMaterials(prev => prev.map(rm => rm.id === grnData.materialId ? {
      ...rm,
      currentStock: Number((rm.currentStock + grnData.acceptedQuantity).toFixed(2)),
      totalPurchases: Number((rm.totalPurchases + grnData.acceptedQuantity).toFixed(2))
    } : rm));

    // Update supplier total purchases and payable
    setSuppliers(prev => prev.map(s => s.id === grnData.supplierId ? {
      ...s,
      totalPurchases: s.totalPurchases + (grnData.acceptedQuantity * 2200),
      outstandingBalance: s.outstandingBalance + (grnData.acceptedQuantity * 2200)
    } : s));
  };

  const addExpense = (expData: Omit<ExpenseRecord, 'id' | 'expenseNumber' | 'status'>) => {
    const expNum = `EXP-2609-0${expenses.length + 10}`;
    const newExp: ExpenseRecord = {
      ...expData,
      id: `exp-${Date.now()}`,
      expenseNumber: expNum,
      status: 'Approved'
    };
    setExpenses(prev => [newExp, ...prev]);
  };

  const addRawMaterial = (rmData: Omit<RawMaterial, 'id' | 'currentStock' | 'totalPurchases' | 'totalConsumption' | 'reservedStock'>) => {
    const newRM: RawMaterial = {
      ...rmData,
      id: `rm-${Date.now()}`,
      currentStock: rmData.openingStock,
      totalPurchases: 0,
      totalConsumption: 0,
      reservedStock: 0
    };
    setRawMaterials(prev => [newRM, ...prev]);
  };

  const markAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  const resetAllData = () => {
    localStorage.clear();
    setCompany(initialCompanyProfile);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setProducts(initialFinishedProducts);
    setRawMaterials(initialRawMaterials);
    setBOMs(initialBOMs);
    setLeads(initialLeads);
    setSalesOrders(initialSalesOrders);
    setPurchaseOrders(initialPurchaseOrders);
    setGRNs(initialGRNs);
    setQCInspections(initialQCInspections);
    setProductionOrders(initialProductionOrders);
    setProductionBatches(initialProductionBatches);
    setVehicles(initialVehicles);
    setDispatches(initialDispatches);
    setInvoices(initialInvoices);
    setPayments([]);
    setExpenses(initialExpenses);
    setMachinery(initialMachinery);
    setEmployees(initialEmployees);
    setDocuments(initialDocuments);
    setAlerts(initialAlerts);
  };

  // Live execution helper for the 21-step interactive demo
  const runDemoStepAction = (step: number) => {
    switch (step) {
      case 1: {
        // Step 1: Create Sales Order for 100 MT Bentonite Granules
        const demoCust = customers[0]; // Kisan Bio-Tech
        const demoProd = products[0]; // Bentonite Granules
        addSalesOrder({
          customerId: demoCust.id,
          customerName: demoCust.customerName,
          orderDate: new Date().toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          productId: demoProd.id,
          productName: demoProd.productName,
          quantityMT: 100,
          ratePerMT: 6200,
          discountPercent: 2,
          taxPercent: 5,
          totalAmount: 637980,
          paymentTerms: 'Net 30 Days',
          shippingAddress: demoCust.shippingAddress,
          status: 'Production Required',
          notes: 'Interactive Demo Order: 100 MT Bentonite Granules for prompt scenario.'
        });
        setDemoStep(2);
        break;
      }
      case 2:
      case 3:
      case 4: {
        // Step 3-4: Create Production Order PO-MFG-DEMO
        const latestSO = salesOrders[0];
        if (latestSO) {
          createProductionOrderFromSO(latestSO.id);
        }
        setDemoStep(5);
        break;
      }
      case 5:
      case 6: {
        // Step 5-6: Material Issue & Start Production
        const latestPO = productionOrders[0];
        if (latestPO) {
          startProductionOrder(latestPO.id);
        }
        setDemoStep(7);
        break;
      }
      case 7:
      case 8: {
        // Step 7-8: Production Entry & Batch BNT-2609-100
        const latestPO = productionOrders[0];
        if (latestPO) {
          completeProductionOrder(latestPO.id, 100.0, 'Demo batch 100 MT granules finished with 97.8% yield');
        }
        setDemoStep(9);
        break;
      }
      case 9:
      case 10: {
        // Step 9-10: QC approval & Add to Finished Goods Available
        const latestQC = qcInspections[0];
        if (latestQC) {
          approveQC(latestQC.id);
        }
        setDemoStep(11);
        break;
      }
      case 11:
      case 12: {
        // Step 11-12: Create Delivery Challan & Dispatch
        const latestSO = salesOrders[0];
        createDispatchChallan({
          salesOrderId: latestSO ? latestSO.id : 'so-1',
          orderNumber: latestSO ? latestSO.orderNumber : 'SO-DEMO',
          customerId: customers[0].id,
          customerName: customers[0].customerName,
          productName: 'Bentonite Granules (16-30 Mesh)',
          batchNumber: productionBatches[0]?.batchNumber || 'BNT-2609-DEMO',
          quantityMT: 100.0,
          bagsCount: 2000,
          vehicleNumber: 'GJ-04-E-8419',
          driverName: 'Ramsinh Gohil',
          driverMobile: '+91 98259 88120',
          transporterName: 'Saurashtra Highway Logistics',
          dispatchDate: new Date().toISOString().split('T')[0],
          destination: 'Sanand Industrial Estate, Ahmedabad, Gujarat',
          eWayBillNumber: '241099881023',
          lrNumber: 'SHL-2609-9941',
          freightAmountRs: 38000,
          freightPaidBy: 'Customer',
          remarks: 'Dispatched 2000 bags (100 MT) in full under delivery challan.'
        });
        setDemoStep(13);
        break;
      }
      case 13:
      case 14: {
        // Step 13-14: Generate GST Invoice
        const latestDisp = dispatches[0];
        if (latestDisp) {
          generateInvoiceFromDispatch(latestDisp.id);
        }
        setDemoStep(15);
        break;
      }
      case 15:
      case 16: {
        // Step 15-16: Record Payment & Clear Outstanding
        const latestInv = invoices[0];
        if (latestInv) {
          recordCustomerPayment(latestInv.id, latestInv.totalInvoiceAmount, 'NEFT/RTGS', 'SBI-RTGS-99081248');
        }
        setDemoStep(17);
        break;
      }
      default:
        setDemoStep(1);
        break;
    }
  };

  return (
    <ERPContext.Provider
      value={{
        activeModule,
        setActiveModule,
        activeRole,
        setActiveRole,
        company,
        setCompany,
        customers,
        suppliers,
        rawMaterials,
        products,
        boms,
        leads,
        salesOrders,
        purchaseOrders,
        grns,
        qcInspections,
        productionOrders,
        productionBatches,
        vehicles,
        dispatches,
        invoices,
        payments,
        expenses,
        machinery,
        employees,
        documents,
        alerts,
        isQuickAddOpen,
        setIsQuickAddOpen,
        quickAddType,
        setQuickAddType,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        printableDoc,
        setPrintableDoc,
        isDemoRunnerOpen,
        setIsDemoRunnerOpen,
        demoStep,
        setDemoStep,
        addLead,
        convertLeadToCustomer,
        addCustomer,
        addSalesOrder,
        createProductionOrderFromSO,
        addPurchaseOrder,
        addGRN,
        approveQC,
        rejectQC,
        startProductionOrder,
        completeProductionOrder,
        createDispatchChallan,
        updateDispatchStatus,
        generateInvoiceFromDispatch,
        recordCustomerPayment,
        addExpense,
        addRawMaterial,
        markAlertRead,
        resetAllData,
        runDemoStepAction
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) throw new Error('useERP must be used within an ERPProvider');
  return context;
};
