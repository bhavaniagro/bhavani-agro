import React, { createContext, useContext, useState, useEffect } from 'react';
import { MODULE_PATHS, PATH_TO_MODULE } from '../config/routes';
import { sortByLatest } from '../utils/sortUtils';
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
  StockMovement,
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
  getCustomersFromApi,
  createCustomerFromApi,
  updateCustomerFromApi,
  deleteCustomerFromApi,
} from "../services/api/customerApi.service";

import {
  createLeadFromApi,
  getLeadsFromApi,
  updateLeadFromApi,
  deleteLeadFromApi,
} from "../services/api/leadApi.service";
import {
  getSuppliersFromApi,
  createSupplierFromApi,
  updateSupplierFromApi,
  deleteSupplierFromApi,
} from "../services/api/supplierApi.service";
import {
  getRawMaterialsFromApi,
  createRawMaterialFromApi,
  updateRawMaterialFromApi,
  deleteRawMaterialFromApi,
} from "../services/api/rawMaterialApi.service";
import {
  getProductsFromApi,
  createProductFromApi,
  updateProductFromApi,
  deleteProductFromApi,
} from "../services/api/productApi.service";
import {
  getSalesOrdersFromApi,
  createSalesOrderFromApi,
  updateSalesOrderFromApi,
  deleteSalesOrderFromApi,
} from "../services/api/salesOrderApi.service";
import {
  getPurchaseOrdersFromApi,
  createPurchaseOrderFromApi,
  updatePurchaseOrderFromApi,
  deletePurchaseOrderFromApi,
} from "../services/api/purchaseOrderApi.service";
import {
  getGRNsFromApi,
  createGRNFromApi,
  updateGRNFromApi,
  deleteGRNFromApi,
} from "../services/api/grnApi.service";
import {
  fetchProductionOrdersFromApi,
  createProductionOrderInApi,
  updateProductionOrderInApi,
  deleteProductionOrderFromApi,
} from "../services/api/productionOrderApi.service";
import {
  fetchProductionBatchesFromApi,
  createProductionBatchInApi,
  updateProductionBatchInApi,
  deleteProductionBatchFromApi,
} from "../services/api/productionBatchApi.service";
import {
  fetchQCInspectionsFromApi,
  createQCInspectionInApi,
  updateQCInspectionInApi,
  deleteQCInspectionFromApi,
} from "../services/api/qcInspectionApi.service";
import {
  fetchBOMsFromApi,
  createBOMInApi,
  updateBOMInApi,
  deleteBOMFromApi,
} from "../services/api/bomApi.service";
import {
  fetchStockMovementsFromApi,
  createStockMovementInApi,
  updateStockMovementInApi,
  deleteStockMovementFromApi,
} from "../services/api/stockMovementApi.service";
import {
  fetchDispatchesFromApi,
  createDispatchInApi,
  updateDispatchInApi,
  deleteDispatchFromApi,
} from "../services/api/dispatchApi.service";
import {
  fetchVehiclesFromApi,
  createVehicleInApi,
  updateVehicleInApi,
  deleteVehicleFromApi,
} from "../services/api/vehicleApi.service";
import {
  fetchSalesInvoicesFromApi,
  createSalesInvoiceInApi,
  updateSalesInvoiceInApi,
  deleteSalesInvoiceFromApi,
} from "../services/api/salesInvoiceApi.service";
import {
  fetchPaymentsFromApi,
  createPaymentInApi,
  updatePaymentInApi,
  deletePaymentFromApi,
} from "../services/api/paymentApi.service";
import {
  fetchExpensesFromApi,
  createExpenseInApi,
  updateExpenseInApi,
  deleteExpenseFromApi,
} from "../services/api/expenseApi.service";
import {
  fetchEmployeesFromApi,
  createEmployeeInApi,
  updateEmployeeInApi,
  deleteEmployeeFromApi,
} from "../services/api/employeeApi.service";
import {
  fetchMachineryFromApi,
  createMachineryInApi,
  updateMachineryInApi,
  deleteMachineryFromApi,
} from "../services/api/machineryApi.service";
import {
  fetchDocumentsFromApi,
  createDocumentInApi,
  updateDocumentInApi,
  deleteDocumentFromApi,
} from "../services/api/documentApi.service";
import {
  fetchCompanyProfileFromApi,
  updateCompanyProfileInApi,
} from "../services/api/companyApi.service";
import { ToastMessage } from '../components/common/Toast';

import {
  loadCollection,
  saveCollection,
  saveDocument,
} from '../services/firestore/erpFirestore.service';


import {
  persistCustomer,
  persistSalesOrder,
  persistPurchaseOrder,
  persistGRN,
  persistQCInspection,
  persistProductionOrder,
  persistProductionBatch,
  persistFinishedProduct,
  persistRawMaterial,
  persistDispatch,
  persistInvoice,
  persistPayment,
  persistExpense,
} from '../services/firestore/erpPersistence.service';

export type ERPModule =
  | 'Dashboard'
  | 'CRM & Sales'
  | 'Purchase'
  | 'Raw Material'
  | 'Production'
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
  type: 'invoice' | 'challan' | 'qc_cert' | 'batch_cert';
  data: any;
}

export interface CustomerCreditSummary {
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
  utilizationPercent: number;
  orderCount: number;
  activeOrders: SalesOrder[];
}

export const getCustomerCreditSummary = (
  customer: Customer | null | undefined,
  salesOrders: SalesOrder[]
): CustomerCreditSummary => {
  if (!customer) {
    return {
      creditLimit: 0,
      usedCredit: 0,
      availableCredit: 0,
      utilizationPercent: 0,
      orderCount: 0,
      activeOrders: []
    };
  }

  const activeOrders = (salesOrders || []).filter(so => {
    if (so.status === 'Cancelled' || so.status === 'Rejected') return false;
    if (so.customerId && (so.customerId === customer.id || so.customerId === customer.code)) return true;
    if (so.customerName && customer.customerName && so.customerName.toLowerCase().trim() === customer.customerName.toLowerCase().trim()) return true;
    return false;
  });

  const usedCredit = activeOrders.reduce((sum, so) => sum + (Number(so.totalAmount) || 0), 0);
  const creditLimit = Number(customer.creditLimit) || 0;
  const availableCredit = creditLimit > 0 ? Math.max(0, creditLimit - usedCredit) : 0;
  const utilizationPercent = creditLimit > 0 ? Math.min(100, Math.round((usedCredit / creditLimit) * 100)) : 0;

  return {
    creditLimit,
    usedCredit,
    availableCredit,
    utilizationPercent,
    orderCount: activeOrders.length,
    activeOrders
  };
};

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
  stockMovements: StockMovement[];

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

  // Toast Notifications
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
  refreshAllData: () => Promise<void>;

  // Actions & Automations
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => Promise<Lead>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  convertLeadToCustomer: (leadId: string) => void;
  addCustomer: (cust: Omit<Customer, 'id' | 'code' | 'totalSales' | 'outstandingBalance' | 'createdAt'>) => Promise<Customer>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addSupplier: (supp: Omit<Supplier, 'id' | 'code' | 'totalPurchases' | 'outstandingBalance'>) => Promise<Supplier>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  updateRawMaterial: (id: string, data: Partial<RawMaterial>) => Promise<void>;
  deleteRawMaterial: (id: string) => Promise<void>;
  addProduct: (prod: Omit<FinishedProduct, 'id'> & { currentStockMT?: number; reservedStockMT?: number }) => Promise<void>;
  updateProduct: (id: string, data: Partial<FinishedProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSalesOrder: (so: Omit<SalesOrder, 'id' | 'orderNumber' | 'stockAvailable'>) => Promise<SalesOrder>;
  updateSalesOrder: (id: string, data: Partial<SalesOrder>) => Promise<void>;
  deleteSalesOrder: (id: string) => Promise<void>;
  createProductionOrderFromSO: (salesOrderId: string) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status'>) => Promise<PurchaseOrder>;
  updatePurchaseOrder: (id: string, data: Partial<PurchaseOrder>) => Promise<void>;
  deletePurchaseOrder: (id: string) => Promise<void>;
  addGRN: (grn: Omit<GRN, 'id' | 'grnNumber' | 'qcStatus' | 'enteredInventory'>) => void;
  updateGRN: (id: string, data: Partial<GRN>) => Promise<void>;
  deleteGRN: (id: string) => Promise<void>;
  updateProductionOrder: (id: string, data: Partial<ProductionOrder>) => Promise<void>;
  deleteProductionOrder: (id: string) => Promise<void>;
  updateProductionBatch: (id: string, data: Partial<ProductionBatch>) => Promise<void>;
  deleteProductionBatch: (id: string) => Promise<void>;
  updateQCInspection: (id: string, data: Partial<QCInspection>) => Promise<void>;
  deleteQCInspection: (id: string) => Promise<void>;
  addBOM: (bom: Omit<BOM, 'id'>) => Promise<BOM>;
  updateBOM: (id: string, data: Partial<BOM>) => Promise<void>;
  deleteBOM: (id: string) => Promise<void>;
  updateStockMovement: (id: string, data: Partial<StockMovement>) => Promise<void>;
  deleteStockMovement: (id: string) => Promise<void>;
  approveQC: (qcId: string) => void;
  rejectQC: (qcId: string, reason: string) => void;
  approveProductionBatch: (batchId: string) => void;
  startProductionOrder: (poId: string) => void;
  completeProductionOrder: (poId: string, outputMT: number, remarks?: string) => void;
  createDispatchChallan: (dispatch: Omit<DispatchChallan, 'id' | 'dispatchNumber' | 'status'>) => void;
  updateDispatchStatus: (dispatchId: string, status: DispatchChallan['status']) => void;
  updateDispatch: (id: string, data: Partial<DispatchChallan>) => Promise<void>;
  deleteDispatch: (id: string) => Promise<void>;
  addVehicle: (vehicle: Omit<VehicleMaster, 'id'>) => Promise<void>;
  updateVehicle: (id: string, data: Partial<VehicleMaster>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  generateInvoiceFromDispatch: (dispatchId: string) => void;
  updateSalesInvoice: (id: string, data: Partial<SalesInvoice>) => Promise<void>;
  deleteSalesInvoice: (id: string) => Promise<void>;
  recordCustomerPayment: (invoiceId: string, amount: number, mode: 'NEFT/RTGS' | 'Cheque' | 'Cash' | 'UPI', reference: string) => void;
  updatePayment: (id: string, data: Partial<PaymentTransaction>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  addExpense: (expense: Omit<ExpenseRecord, 'id' | 'expenseNumber' | 'status'>) => Promise<ExpenseRecord>;
  updateExpense: (id: string, data: Partial<ExpenseRecord>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  addMachinery: (machinery: Omit<Machinery, 'id'>) => Promise<void>;
  updateMachinery: (id: string, data: Partial<Machinery>) => Promise<void>;
  deleteMachinery: (id: string) => Promise<void>;
  addDocument: (document: Omit<ErpDocument, 'id'>) => Promise<void>;
  updateDocument: (id: string, data: Partial<ErpDocument>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateCompanyProfile: (data: Partial<CompanyProfile>) => Promise<void>;
  addRawMaterial: (rm: Omit<RawMaterial, 'id' | 'currentStock' | 'totalPurchases' | 'totalConsumption' | 'reservedStock'>) => void;
  markAlertRead: (alertId: string) => void;
  resetAllData: () => void;
  runDemoStepAction: (step: number) => void;
  getCustomerCredit: (customer: Customer | null | undefined) => CustomerCreditSummary;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModuleState] = useState<ERPModule>(() => {
    if (typeof window !== 'undefined') {
      const initial = PATH_TO_MODULE[window.location.pathname];
      if (initial) return initial;
    }
    return 'Dashboard';
  });

  const setActiveModule = (module: ERPModule) => {
    setActiveModuleState(module);
    const targetPath = MODULE_PATHS[module];
    if (targetPath && typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const module = PATH_TO_MODULE[currentPath];
        if (module) {
          setActiveModuleState(module);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [activeRole, setActiveRole] = useState<UserRole>('Owner / Admin');

  const defaultCompanyProfile: CompanyProfile = {
    id: 'profile',
    name: 'Bhavani Agro & Minerals',
    formation: 'Sole Proprietorship',
    established: '1985',
    gstin: '24AAAAA0000A1Z5',
    pan: 'AAAAA0000A',
    address: 'Plot 42-45, GIDC Metoda Industrial Estate',
    city: 'Rajkot',
    state: 'Gujarat',
    pincode: '360021',
    bankName: 'State Bank of India, Main Branch Rajkot',
    accountNo: '38291048571',
    ifscCode: 'SBIN0001234'
  };

  const CACHE_PREFIX = 'bhavani_erp_v2_';

  function loadCached<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as T;
        if (parsed && typeof parsed === 'object') return parsed as T;
      }
    } catch (e) {
      console.warn(`[ERPContext] Cache read error for ${key}:`, e);
    }
    return fallback;
  }

  function saveCached(key: string, data: any): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      // quota or storage disabled
    }
  }

  function mergeDelta<T extends { id: string }>(existing: T[], delta?: T[] | null): T[] {
    if (!delta || !Array.isArray(delta) || delta.length === 0) return existing;
    const deltaMap = new Map(delta.map(d => [d.id, d]));
    const updated = existing.map(item => deltaMap.has(item.id) ? { ...item, ...deltaMap.get(item.id)! } : item);
    const existingIds = new Set(existing.map(e => e.id));
    const newItems = delta.filter(d => !existingIds.has(d.id));
    return sortByLatest([...newItems, ...updated]);
  }

  const [company, setCompany] = useState<CompanyProfile>(() => loadCached('company', defaultCompanyProfile));
  const [customers, setCustomers] = useState<Customer[]>(() => loadCached('customers', sortByLatest(initialCustomers)));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadCached('suppliers', sortByLatest(initialSuppliers)));
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => loadCached('rawMaterials', sortByLatest(initialRawMaterials)));
  const [products, setProducts] = useState<FinishedProduct[]>(() => loadCached('products', sortByLatest(initialFinishedProducts)));
  const [boms, setBOMs] = useState<BOM[]>(() => loadCached('boms', sortByLatest(initialBOMs)));
  const [leads, setLeads] = useState<Lead[]>(() => loadCached('leads', sortByLatest(initialLeads)));
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(() => loadCached('salesOrders', sortByLatest(initialSalesOrders)));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => loadCached('purchaseOrders', sortByLatest(initialPurchaseOrders)));
  const [grns, setGRNs] = useState<GRN[]>(() => loadCached('grns', sortByLatest(initialGRNs)));
  const [qcInspections, setQCInspections] = useState<QCInspection[]>(() => loadCached('qcInspections', sortByLatest(initialQCInspections)));
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(() => loadCached('productionOrders', sortByLatest(initialProductionOrders)));
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>(() => loadCached('productionBatches', sortByLatest(initialProductionBatches)));
  const [vehicles, setVehicles] = useState<VehicleMaster[]>(() => loadCached('vehicles', sortByLatest(initialVehicles)));
  const [dispatches, setDispatches] = useState<DispatchChallan[]>(() => loadCached('dispatches', sortByLatest(initialDispatches)));
  const [invoices, setInvoices] = useState<SalesInvoice[]>(() => loadCached('invoices', sortByLatest(initialInvoices)));
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => loadCached('payments', []));
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => loadCached('expenses', sortByLatest(initialExpenses)));
  const [machinery, setMachinery] = useState<Machinery[]>(() => loadCached('machinery', sortByLatest(initialMachinery)));
  const [employees, setEmployees] = useState<Employee[]>(() => loadCached('employees', sortByLatest(initialEmployees)));
  const [documents, setDocuments] = useState<ErpDocument[]>(() => loadCached('documents', sortByLatest(initialDocuments)));
  const [alerts, setAlerts] = useState<ErpAlert[]>(() => loadCached('alerts', sortByLatest(initialAlerts)));
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => loadCached('stockMovements', []));

  // Sync state changes to localStorage
  useEffect(() => { saveCached('customers', customers); }, [customers]);
  useEffect(() => { saveCached('leads', leads); }, [leads]);
  useEffect(() => { saveCached('suppliers', suppliers); }, [suppliers]);
  useEffect(() => { saveCached('rawMaterials', rawMaterials); }, [rawMaterials]);
  useEffect(() => { saveCached('products', products); }, [products]);
  useEffect(() => { saveCached('salesOrders', salesOrders); }, [salesOrders]);
  useEffect(() => { saveCached('purchaseOrders', purchaseOrders); }, [purchaseOrders]);
  useEffect(() => { saveCached('grns', grns); }, [grns]);
  useEffect(() => { saveCached('qcInspections', qcInspections); }, [qcInspections]);
  useEffect(() => { saveCached('productionOrders', productionOrders); }, [productionOrders]);
  useEffect(() => { saveCached('productionBatches', productionBatches); }, [productionBatches]);
  useEffect(() => { saveCached('boms', boms); }, [boms]);
  useEffect(() => { saveCached('stockMovements', stockMovements); }, [stockMovements]);
  useEffect(() => { saveCached('dispatches', dispatches); }, [dispatches]);
  useEffect(() => { saveCached('vehicles', vehicles); }, [vehicles]);
  useEffect(() => { saveCached('invoices', invoices); }, [invoices]);
  useEffect(() => { saveCached('payments', payments); }, [payments]);
  useEffect(() => { saveCached('expenses', expenses); }, [expenses]);
  useEffect(() => { saveCached('employees', employees); }, [employees]);
  useEffect(() => { saveCached('machinery', machinery); }, [machinery]);
  useEffect(() => { saveCached('documents', documents); }, [documents]);
  useEffect(() => { saveCached('company', company); }, [company]);

  // Cross-tab real-time sync notification
  const notifyChange = () => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('bhavani_erp_realtime_sync');
        bc.postMessage({ type: 'DATA_CHANGED', timestamp: Date.now() });
        bc.close();
      } catch (e) {
        // BroadcastChannel optional fallback
      }
    }
  };

  const lastSyncTimestampRef = useRef<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem(`${CACHE_PREFIX}last_sync_timestamp`) : null
  );
  const isSyncingRef = useRef(false);

  // Real-time synchronization: supports both full initial fetch and lightweight delta updates
  const syncRealtimeData = async (isDelta = false) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      const since = isDelta && lastSyncTimestampRef.current ? lastSyncTimestampRef.current : undefined;
      const syncStartTime = new Date().toISOString();

      const [
        custs, lds, supps, rms, prods, sos, pos, grnList, qcs, pOrders, pBatches, bomsList,
        movs, disps, vehs, invs, pmts, exps, emps, machs, docs, comp
      ] = await Promise.allSettled([
        getCustomersFromApi(since),
        getLeadsFromApi(since),
        getSuppliersFromApi(since),
        getRawMaterialsFromApi(since),
        getProductsFromApi(since),
        getSalesOrdersFromApi(since),
        getPurchaseOrdersFromApi(since),
        getGRNsFromApi(since),
        fetchQCInspectionsFromApi(since),
        fetchProductionOrdersFromApi(since),
        fetchProductionBatchesFromApi(since),
        fetchBOMsFromApi(since),
        fetchStockMovementsFromApi(since),
        fetchDispatchesFromApi(since),
        fetchVehiclesFromApi(since),
        fetchSalesInvoicesFromApi(since),
        fetchPaymentsFromApi(since),
        fetchExpensesFromApi(since),
        fetchEmployeesFromApi(since),
        fetchMachineryFromApi(since),
        fetchDocumentsFromApi(since),
        fetchCompanyProfileFromApi(),
      ]);

      if (isDelta) {
        // Delta mode: only merge non-empty delta items
        if (custs.status === 'fulfilled' && custs.value && custs.value.length > 0) setCustomers(prev => mergeDelta(prev, custs.value));
        if (lds.status === 'fulfilled' && lds.value && lds.value.length > 0) setLeads(prev => mergeDelta(prev, lds.value));
        if (supps.status === 'fulfilled' && supps.value && supps.value.length > 0) setSuppliers(prev => mergeDelta(prev, supps.value));
        if (rms.status === 'fulfilled' && rms.value && rms.value.length > 0) setRawMaterials(prev => mergeDelta(prev, rms.value));
        if (prods.status === 'fulfilled' && prods.value && prods.value.length > 0) {
          const normalized = prods.value.map(p => ({
            ...p,
            currentStockMT: typeof p.currentStockMT === 'number' ? p.currentStockMT : (Number(p.currentStockMT) || 0),
            reservedStockMT: typeof p.reservedStockMT === 'number' ? p.reservedStockMT : (Number(p.reservedStockMT) || 0),
          }));
          setProducts(prev => mergeDelta(prev, normalized));
        }
        if (sos.status === 'fulfilled' && sos.value && sos.value.length > 0) setSalesOrders(prev => mergeDelta(prev, sos.value));
        if (pos.status === 'fulfilled' && pos.value && pos.value.length > 0) setPurchaseOrders(prev => mergeDelta(prev, pos.value));
        if (grnList.status === 'fulfilled' && grnList.value && grnList.value.length > 0) setGRNs(prev => mergeDelta(prev, grnList.value));
        if (qcs.status === 'fulfilled' && qcs.value && qcs.value.length > 0) setQCInspections(prev => mergeDelta(prev, qcs.value));
        if (pOrders.status === 'fulfilled' && pOrders.value && pOrders.value.length > 0) setProductionOrders(prev => mergeDelta(prev, pOrders.value));
        if (pBatches.status === 'fulfilled' && pBatches.value && pBatches.value.length > 0) setProductionBatches(prev => mergeDelta(prev, pBatches.value));
        if (bomsList.status === 'fulfilled' && bomsList.value && bomsList.value.length > 0) setBOMs(prev => mergeDelta(prev, bomsList.value));
        if (movs.status === 'fulfilled' && movs.value && movs.value.length > 0) setStockMovements(prev => mergeDelta(prev, movs.value));
        if (disps.status === 'fulfilled' && disps.value && disps.value.length > 0) setDispatches(prev => mergeDelta(prev, disps.value));
        if (vehs.status === 'fulfilled' && vehs.value && vehs.value.length > 0) setVehicles(prev => mergeDelta(prev, vehs.value));
        if (invs.status === 'fulfilled' && invs.value && invs.value.length > 0) setInvoices(prev => mergeDelta(prev, invs.value));
        if (pmts.status === 'fulfilled' && pmts.value && pmts.value.length > 0) setPayments(prev => mergeDelta(prev, pmts.value));
        if (exps.status === 'fulfilled' && exps.value && exps.value.length > 0) setExpenses(prev => mergeDelta(prev, exps.value));
        if (emps.status === 'fulfilled' && emps.value && emps.value.length > 0) setEmployees(prev => mergeDelta(prev, emps.value));
        if (machs.status === 'fulfilled' && machs.value && machs.value.length > 0) setMachinery(prev => mergeDelta(prev, machs.value));
        if (docs.status === 'fulfilled' && docs.value && docs.value.length > 0) setDocuments(prev => mergeDelta(prev, docs.value));
        if (comp.status === 'fulfilled' && comp.value) setCompany(comp.value);
      } else {
        // Full initial sync
        if (custs.status === 'fulfilled' && custs.value) setCustomers(sortByLatest(custs.value));
        if (lds.status === 'fulfilled' && lds.value) setLeads(sortByLatest(lds.value));
        if (supps.status === 'fulfilled' && supps.value) setSuppliers(sortByLatest(supps.value));
        if (rms.status === 'fulfilled' && rms.value) setRawMaterials(sortByLatest(rms.value));
        if (prods.status === 'fulfilled' && prods.value) {
          const normalized = prods.value.map(p => ({
            ...p,
            currentStockMT: typeof p.currentStockMT === 'number' ? p.currentStockMT : (Number(p.currentStockMT) || 0),
            reservedStockMT: typeof p.reservedStockMT === 'number' ? p.reservedStockMT : (Number(p.reservedStockMT) || 0),
          }));
          setProducts(sortByLatest(normalized));
        }
        if (sos.status === 'fulfilled' && sos.value) setSalesOrders(sortByLatest(sos.value));
        if (pos.status === 'fulfilled' && pos.value) setPurchaseOrders(sortByLatest(pos.value));
        if (grnList.status === 'fulfilled' && grnList.value) setGRNs(sortByLatest(grnList.value));
        if (qcs.status === 'fulfilled' && qcs.value) setQCInspections(sortByLatest(qcs.value));
        if (pOrders.status === 'fulfilled' && pOrders.value) setProductionOrders(sortByLatest(pOrders.value));
        if (pBatches.status === 'fulfilled' && pBatches.value) setProductionBatches(sortByLatest(pBatches.value));
        if (bomsList.status === 'fulfilled' && bomsList.value) setBOMs(sortByLatest(bomsList.value));
        if (movs.status === 'fulfilled' && movs.value) setStockMovements(sortByLatest(movs.value));
        if (disps.status === 'fulfilled' && disps.value) setDispatches(sortByLatest(disps.value));
        if (vehs.status === 'fulfilled' && vehs.value) setVehicles(sortByLatest(vehs.value));
        if (invs.status === 'fulfilled' && invs.value) setInvoices(sortByLatest(invs.value));
        if (pmts.status === 'fulfilled' && pmts.value) setPayments(sortByLatest(pmts.value));
        if (exps.status === 'fulfilled' && exps.value) setExpenses(sortByLatest(exps.value));
        if (emps.status === 'fulfilled' && emps.value) setEmployees(sortByLatest(emps.value));
        if (machs.status === 'fulfilled' && machs.value) setMachinery(sortByLatest(machs.value));
        if (docs.status === 'fulfilled' && docs.value) setDocuments(sortByLatest(docs.value));
        if (comp.status === 'fulfilled' && comp.value) setCompany(comp.value);
      }

      lastSyncTimestampRef.current = syncStartTime;
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${CACHE_PREFIX}last_sync_timestamp`, syncStartTime);
        localStorage.setItem(`${CACHE_PREFIX}has_synced`, 'true');
      }
    } catch (err) {
      console.error("Realtime sync error:", err);
    } finally {
      isSyncingRef.current = false;
    }
  };

  // Real-time synchronization listeners (smart initial, window focus, interval, broadcast)
  useEffect(() => {
    const hasSynced = typeof window !== 'undefined' && localStorage.getItem(`${CACHE_PREFIX}has_synced`) === 'true';

    if (!hasSynced) {
      // First time visitor: full sync once
      syncRealtimeData(false);
    } else {
      // Returning visitor or page refresh: delta sync only!
      syncRealtimeData(true);
    }

    // Cross-tab real-time sync channel: instant delta sync when another tab updates data
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('bhavani_erp_realtime_sync');
        channel.onmessage = (event) => {
          if (event.data?.type === 'DATA_CHANGED') {
            syncRealtimeData(true);
          }
        };
      } catch (e) {
        console.error("BroadcastChannel init failed:", e);
      }
    }

    // Gentle tab focus sync (only if > 45s since last sync, and only delta!)
    let lastFocusSync = Date.now();
    const handleFocus = () => {
      if (Date.now() - lastFocusSync > 45000) {
        lastFocusSync = Date.now();
        syncRealtimeData(true);
      }
    };
    window.addEventListener('focus', handleFocus);

    // Smart background interval sync (every 60 seconds instead of 8s, and only delta!)
    const interval = setInterval(() => {
      syncRealtimeData(true);
    }, 60000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
      if (channel) channel.close();
    };
  }, []);

  // Toast Notification state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Dialog & Modal states
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [printableDoc, setPrintableDoc] = useState<PrintableDoc | null>(null);
  const [isDemoRunnerOpen, setIsDemoRunnerOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(1);



  // Lead management
  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> => {
    try {
      const apiLead = await createLeadFromApi(leadData);
      setLeads(prev => sortByLatest([apiLead, ...prev]));
      showToast("Lead created successfully", "success");
      notifyChange();
      return apiLead;
    } catch (error: any) {
      console.error("Failed to save lead through API:", error);
      showToast(error?.message || "Unable to create lead", "error");
      throw error;
    }
  };

  const updateLead = async (id: string, data: Partial<Lead>): Promise<void> => {
    try {
      const updated = await updateLeadFromApi(id, data);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated, ...data } : l)));
      showToast("Lead updated successfully", "success");
      notifyChange();
    } catch (error: any) {
      console.error("Failed to update lead:", error);
      showToast(error?.message || "Unable to update lead", "error");
      throw error;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      await deleteLeadFromApi(id);
      showToast("Lead deleted successfully", "success");
      notifyChange();
    } catch (error) {
      console.error("Failed to delete lead:", error);
      showToast("Unable to delete lead", "error");
    }
  };

  const convertLeadToCustomer = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    
    await addCustomer({
      customerName: lead.leadName,
      companyName: lead.company,
      contactPerson: lead.contactPerson,
      mobile: lead.mobile,
      email: lead.email,
      billingAddress: lead.location,
      shippingAddress: lead.location,
      gstin: '24' + Math.random().toString(36).substring(2, 12).toUpperCase(),
      state: lead.location.split(',')[1]?.trim() || 'Gujarat',
      creditLimit: 2000000,
      paymentTerms: 'Net 30 Days',
      customerType: 'Dealer',
      assignedSalesperson: lead.salesperson,
    });

    await updateLead(leadId, { status: 'Won' });

    showToast(`Lead converted to customer: ${lead.leadName}`, 'success');

    setAlerts(prev => sortByLatest([{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `Lead Converted to Customer`,
      description: `${lead.leadName} (${lead.company}) is now active in Customer Master.`,
      timestamp: 'Just now',
      module: 'Customers',
      read: false
    }, ...prev]));
    notifyChange();
  };

  const addCustomer = async (
    custData: Omit<
      Customer,
      'id' | 'code' | 'totalSales' | 'outstandingBalance' | 'createdAt'
    >
  ): Promise<Customer> => {
    const customerCode = `CUST-${String(customers.length + 1).padStart(3, '0')}`;

    const customerData = {
      ...custData,
      code: customerCode,
      totalSales: 0,
      outstandingBalance: 0,
    };

    try {
      const apiCustomer = await createCustomerFromApi(customerData);
      const newCustomer: Customer = apiCustomer;
      setCustomers((prev) => sortByLatest([newCustomer, ...prev]));
      showToast("Customer created successfully", "success");
      notifyChange();
      return newCustomer;
    } catch (error) {
      console.error('Failed to save customer to Firebase:', error);
      showToast("Unable to create customer", "error");
      throw error;
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    try {
      setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
      await updateCustomerFromApi(id, data);
      showToast("Customer updated successfully", "success");
      notifyChange();
    } catch (error) {
      console.error("Failed to update customer:", error);
      showToast("Unable to update customer", "error");
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      await deleteCustomerFromApi(id);
      showToast("Customer deleted successfully", "success");
      notifyChange();
    } catch (error) {
      console.error("Failed to delete customer:", error);
      showToast("Unable to delete customer", "error");
    }
  };

  // Automation 12: Sales Order -> Create Production Order
  const createProductionOrderFromSOObj = (so: SalesOrder) => {
    const matchingBOM = boms.find(b => b.productId === so.productId) || boms[0];

    // Check required materials
    const materialCheck = (matchingBOM?.items || []).map(item => {
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
      bomId: matchingBOM ? matchingBOM.id : 'bom-1',
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

    setProductionOrders(prev => sortByLatest([newPO, ...prev]));

    persistProductionOrder(newPO).catch((error) => {
      console.error('Failed to save production order to Firebase:', error);
    });

    setSalesOrders(prev => prev.map(o => o.id === so.id ? { ...o, productionOrderId: newPO.id } : o));

    setAlerts(prev => sortByLatest([{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `Production Order ${poNum} Created`,
      description: `BOM verified for ${so.quantityMT} MT of ${so.productName}.`,
      timestamp: 'Just now',
      module: 'Production',
      read: false
    }, ...prev]));
    notifyChange();
  };

  const createProductionOrderFromSO = (salesOrderId: string) => {
    const so = salesOrders.find(o => o.id === salesOrderId);
    if (so) createProductionOrderFromSOObj(so);
  };

  // Automation 1: Sales Order Stock Check & Credit Limit Validation
  const addSalesOrder = async (soData: Omit<SalesOrder, 'id' | 'orderNumber' | 'stockAvailable'>): Promise<SalesOrder> => {
    // 1. Credit Limit Verification
    const targetCustomer = customers.find(c => 
      c.id === soData.customerId || 
      (c.customerName && soData.customerName && c.customerName.toLowerCase().trim() === soData.customerName.toLowerCase().trim())
    );

    if (targetCustomer && Number(targetCustomer.creditLimit) > 0) {
      const creditInfo = getCustomerCreditSummary(targetCustomer, salesOrders);

      if (soData.totalAmount > creditInfo.availableCredit) {
        const errorMsg = `Order Rejected: Credit limit exceeded for ${targetCustomer.customerName}. Available credit limit is ₹${creditInfo.availableCredit.toLocaleString('en-IN')}, but order amount is ₹${soData.totalAmount.toLocaleString('en-IN')}. (Total Credit Limit: ₹${creditInfo.creditLimit.toLocaleString('en-IN')}, Already Utilized: ₹${creditInfo.usedCredit.toLocaleString('en-IN')}).`;

        showToast(errorMsg, "error");
        setAlerts(prev => [{
          id: `alt-${Date.now()}`,
          type: 'critical',
          title: `Sales Order Rejected: Credit Limit Exceeded`,
          description: errorMsg,
          timestamp: 'Just now',
          module: 'CRM & Sales',
          read: false
        }, ...prev]);

        throw new Error(errorMsg);
      }
    }

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

    try {
      const apiOrder = await createSalesOrderFromApi(newOrder);
      const savedOrder = apiOrder || newOrder;
      setSalesOrders(prev => sortByLatest([savedOrder, ...prev]));
      showToast("Sales Order created successfully", "success");
      notifyChange();

      // Update customer total sales
      setCustomers(prev => prev.map(c => c.id === soData.customerId ? { ...c, totalSales: c.totalSales + soData.totalAmount } : c));

      if (!isStockAvailable) {
        createProductionOrderFromSOObj(savedOrder);
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
      return savedOrder;
    } catch (err) {
      console.error("Failed to save sales order to API:", err);
      showToast("Unable to create sales order", "error");
      throw err;
    }
  };

  const updateSalesOrder = async (id: string, data: Partial<SalesOrder>) => {
    try {
      setSalesOrders(prev => prev.map(so => so.id === id ? { ...so, ...data } : so));
      await updateSalesOrderFromApi(id, data);
      showToast("Sales Order updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update sales order:", err);
      showToast("Unable to update sales order", "error");
    }
  };

  const deleteSalesOrder = async (id: string) => {
    try {
      setSalesOrders(prev => prev.filter(so => so.id !== id));
      await deleteSalesOrderFromApi(id);
      showToast("Sales Order deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete sales order:", err);
      showToast("Unable to delete sales order", "error");
    }
  };

  // Automation 2 & 3: Start Production & Material Issue
  const startProductionOrder = (poId: string) => {
    const po = productionOrders.find(p => p.id === poId);
    if (!po) return;

    const bom = boms.find(b => b.id === po.bomId) || boms[0];

    // Deduct raw material stock
    setRawMaterials(prev => prev.map(rm => {
      const neededItem = (bom?.items || []).find(i => i.rawMaterialId === rm.id);
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
    updateProductionOrderInApi(poId, { status: 'In Production' }).catch(console.error);
    showToast(`Production Order ${po.productionOrderNumber} started`, 'info');
    notifyChange();
  };

  // Automation 4: Complete Production -> Create Batch & Release to Inventory
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
      qcStatus: 'Approved',
      storageLocation: 'Finished Warehouse Bay 1',
      manufacturingDate: new Date().toISOString().split('T')[0],
      bestBeforeDate: new Date(Date.now() + 730 * 86400000).toISOString().split('T')[0],
      standardCostPerMT: 4350,
      actualCostPerMT: 4210
    };

    setProductionBatches(prev => sortByLatest([newBatch, ...prev]));
    createProductionBatchInApi(newBatch).catch(console.error);
    persistProductionBatch(newBatch).catch((error) => {
      console.error('Failed to save production batch to Firebase:', error);
    });

    // Directly credit Finished Goods Stock
    const targetProd = products.find(p => p.id === po.productId || (p.productName && po.productName && p.productName.toLowerCase().trim() === po.productName.toLowerCase().trim()));
    if (targetProd) {
      const newQty = Number((targetProd.currentStockMT + outputMT).toFixed(2));
      setProducts(prev => prev.map(p => p.id === targetProd.id ? {
        ...p,
        currentStockMT: newQty
      } : p));
      updateProductFromApi(targetProd.id, { currentStockMT: newQty }).catch(console.error);
      persistFinishedProduct({ ...targetProd, currentStockMT: newQty }).catch(console.error);

      // Check sales orders waiting for this product
      setSalesOrders(prev => prev.map(so => {
        if (so.productId === targetProd.id && so.status === 'Production Required') {
          return { ...so, status: 'Ready', stockAvailable: true };
        }
        return so;
      }));
    }

    setProductionOrders(prev => prev.map(p => p.id === poId ? {
      ...p,
      status: 'Completed',
      actualBatchNumber: batchCode,
      outputProducedMT: outputMT
    } : p));
    updateProductionOrderInApi(poId, { status: 'Completed', actualBatchNumber: batchCode, outputProducedMT: outputMT }).catch(console.error);
    showToast(`Production Batch ${batchCode} completed & released to inventory`, 'success');

    setAlerts(prev => sortByLatest([{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `Batch Produced: ${po.productName}`,
      description: `Batch ${batchCode} completed (${outputMT} MT). Added to Finished Goods stock.`,
      timestamp: 'Just now',
      module: 'Production',
      read: false
    }, ...prev]));
    notifyChange();
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
    updateQCInspectionInApi(qcId, { overallStatus: 'Approved' }).catch(console.error);

    // If Finished Goods batch
    if (qc.type === 'Finished Goods') {
      const batch = productionBatches.find(b => b.batchNumber === qc.batchLotNumber);
      if (batch) {
        setProductionBatches(prev => prev.map(b => b.id === batch.id ? { ...b, qcStatus: 'Approved' } : b));
        updateProductionBatchInApi(batch.id, { qcStatus: 'Approved' }).catch(console.error);

        const updatedBatch = {
          ...batch,
          qcStatus: 'Approved' as const,
        };

        persistProductionBatch(updatedBatch).catch((error) => {
          console.error('Failed to save approved production batch to Firebase:', error);
        });

        // Add to finished goods stock
        const targetProd = products.find(p => p.id === batch.productId || (p.productName && batch.productName && p.productName.toLowerCase().trim() === batch.productName.toLowerCase().trim()));
        if (targetProd) {
          const newQty = Number((targetProd.currentStockMT + batch.quantityProducedMT).toFixed(2));
          setProducts(prev => prev.map(p => p.id === targetProd.id ? {
            ...p,
            currentStockMT: newQty
          } : p));
          updateProductFromApi(targetProd.id, { currentStockMT: newQty }).catch(console.error);
          persistFinishedProduct({ ...targetProd, currentStockMT: newQty }).catch(console.error);
        } else {
          setProducts(prev => prev.map(p => p.id === batch.productId ? {
            ...p,
            currentStockMT: Number((p.currentStockMT + batch.quantityProducedMT).toFixed(2))
          } : p));
        }

        // Mark associated production order completed
        const po = productionOrders.find(p => p.id === batch.productionOrderId);
        if (po) {
          setProductionOrders(prev => prev.map(p => p.id === po.id ? { ...p, status: 'Completed' } : p));
          updateProductionOrderInApi(po.id, { status: 'Completed' }).catch(console.error);
          // If generated from sales order, mark sales order Ready for dispatch (manual dispatch step in Dispatch module)
          if (po.salesOrderId) {
            setSalesOrders(prev => prev.map(so => so.id === po.salesOrderId ? { ...so, status: 'Ready', stockAvailable: true } : so));
            updateSalesOrderFromApi(po.salesOrderId, { status: 'Ready', stockAvailable: true }).catch(console.error);
          }
        }
      }
    } else if (qc.type === 'Incoming Raw Material') {
      const grn = grns.find(g => g.internalLotNumber === qc.batchLotNumber || g.grnNumber === qc.referenceId);
      if (grn) {
        setGRNs(prev => prev.map(g => g.id === grn.id ? { ...g, qcStatus: 'Approved', enteredInventory: true } : g));
        updateGRNFromApi(grn.id, { qcStatus: 'Approved', enteredInventory: true }).catch(console.error);
        setRawMaterials(prev => prev.map(rm => rm.id === grn.materialId ? {
          ...rm,
          currentStock: Number((rm.currentStock + grn.acceptedQuantity).toFixed(2)),
          totalPurchases: Number((rm.totalPurchases + grn.acceptedQuantity).toFixed(2))
        } : rm));
      }
    }

    showToast(`QC Inspection ${qc.qcNumber} passed & approved`, 'success');

    setAlerts(prev => sortByLatest([{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `QC Passed: ${qc.itemName}`,
      description: `Batch ${qc.batchLotNumber} approved. Inventory updated & released for sale.`,
      timestamp: 'Just now',
      module: 'Production',
      read: false
    }, ...prev]));
    notifyChange();
  };

  const rejectQC = (qcId: string, reason: string) => {
    setQCInspections(prev => prev.map(q => q.id === qcId ? {
      ...q,
      overallStatus: 'Rejected',
      remarks: reason
    } : q));
    updateQCInspectionInApi(qcId, { overallStatus: 'Rejected', remarks: reason }).catch(console.error);
    const qc = qcInspections.find(q => q.id === qcId);
    if (qc && qc.type === 'Finished Goods') {
      setProductionBatches(prev => prev.map(b => b.batchNumber === qc.batchLotNumber ? { ...b, qcStatus: 'Rejected' } : b));
    }
    showToast(`QC Inspection ${qc?.qcNumber || ''} marked as Rejected`, 'warning');
    notifyChange();
  };

  // Direct batch approval & inventory release helper
  const approveProductionBatch = (batchId: string) => {
    const batch = productionBatches.find(b => b.id === batchId);
    if (!batch) return;

    setProductionBatches(prev => prev.map(b => b.id === batch.id ? { ...b, qcStatus: 'Approved' } : b));
    updateProductionBatchInApi(batch.id, { qcStatus: 'Approved' }).catch(console.error);

    const updatedBatch = {
      ...batch,
      qcStatus: 'Approved' as const,
    };
    persistProductionBatch(updatedBatch).catch((error) => {
      console.error('Failed to save approved production batch to Firebase:', error);
    });

    // Add to finished goods stock
    const targetProd = products.find(p => p.id === batch.productId || (p.productName && batch.productName && p.productName.toLowerCase().trim() === batch.productName.toLowerCase().trim()));
    if (targetProd) {
      const newQty = Number((targetProd.currentStockMT + batch.quantityProducedMT).toFixed(2));
      setProducts(prev => prev.map(p => p.id === targetProd.id ? { ...p, currentStockMT: newQty } : p));
      updateProductFromApi(targetProd.id, { currentStockMT: newQty }).catch(console.error);
      persistFinishedProduct({ ...targetProd, currentStockMT: newQty }).catch(console.error);
    } else {
      setProducts(prev => prev.map(p => p.id === batch.productId ? {
        ...p,
        currentStockMT: Number((p.currentStockMT + batch.quantityProducedMT).toFixed(2))
      } : p));
    }

    // Mark associated production order completed
    const po = productionOrders.find(p => p.id === batch.productionOrderId);
    if (po) {
      setProductionOrders(prev => prev.map(p => p.id === po.id ? { ...p, status: 'Completed' } : p));
      updateProductionOrderInApi(po.id, { status: 'Completed' }).catch(console.error);
      if (po.salesOrderId) {
        setSalesOrders(prev => prev.map(so => so.id === po.salesOrderId ? { ...so, status: 'Ready', stockAvailable: true } : so));
        updateSalesOrderFromApi(po.salesOrderId, { status: 'Ready', stockAvailable: true }).catch(console.error);
      }
    }

    setAlerts(prev => sortByLatest([{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `Batch Released: ${batch.productName}`,
      description: `Batch ${batch.batchNumber} completed. Inventory updated & released for sale.`,
      timestamp: 'Just now',
      module: 'Production',
      read: false
    }, ...prev]));
    notifyChange();
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

    setDispatches(prev => sortByLatest([newDispatch, ...prev]));
    createDispatchInApi(newDispatch).catch(console.error);
    persistDispatch(newDispatch).catch((error) => {
      console.error('Failed to save dispatch to Firebase:', error);
    });
    showToast(`Dispatch Challan ${dispNum} created successfully`, 'success');
    notifyChange();

    // Deduct finished goods stock accurately
    const so = salesOrders.find(s => s.id === dispatchData.salesOrderId);
    const targetProduct = products.find(p => (so && (p.id === so.productId || p.productName.toLowerCase().trim() === so.productName.toLowerCase().trim())) || (p.productName && dispatchData.productName && p.productName.toLowerCase().trim() === dispatchData.productName.toLowerCase().trim()));
    if (targetProduct) {
      const newStock = Math.max(0, Number((targetProduct.currentStockMT - dispatchData.quantityMT).toFixed(2)));
      setProducts(prev => prev.map(p => p.id === targetProduct.id ? {
        ...p,
        currentStockMT: newStock
      } : p));

      updateProductFromApi(targetProduct.id, { currentStockMT: newStock }).catch(console.error);
      persistFinishedProduct({ ...targetProduct, currentStockMT: newStock }).catch(console.error);
    }

    if (so) {
      setSalesOrders(prev => prev.map(s => s.id === so.id ? {
        ...s,
        status: 'Dispatched',
        dispatchId: newDispatch.id
      } : s));
      updateSalesOrderFromApi(so.id, { status: 'Dispatched', dispatchId: newDispatch.id }).catch(console.error);
    }
  };

  const updateDispatchStatus = (dispatchId: string, status: DispatchChallan['status']) => {
    setDispatches(prev => prev.map(d => d.id === dispatchId ? { ...d, status } : d));
    updateDispatchInApi(dispatchId, { status }).catch(console.error);
    showToast(`Dispatch status updated to ${status}`, 'success');
    notifyChange();
  };

  // Automation 7: Generate Invoice from Dispatch / Sales Order -> Create Receivable
  const generateInvoiceFromDispatch = (dispatchId: string) => {
    const disp = dispatches.find(d => d.id === dispatchId);
    if (!disp) return;

    const cust = customers.find(c => c.id === disp.customerId || (c.customerName && disp.customerName && c.customerName.toLowerCase() === disp.customerName.toLowerCase()));
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
      customerId: cust ? cust.id : disp.customerId,
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

    setInvoices(prev => sortByLatest([newInvoice, ...prev]));
    createSalesInvoiceInApi(newInvoice).catch(console.error);
    persistInvoice(newInvoice).catch((error) => {
      console.error('Failed to save invoice to Firebase:', error);
    });

    setDispatches(prev => prev.map(d => d.id === dispatchId ? { ...d, invoiceId: newInvoice.id, invoiceNumber: invNum } : d));
    updateDispatchInApi(dispatchId, { invoiceId: newInvoice.id, invoiceNumber: invNum }).catch(console.error);

    // Automation 8: Update Customer Outstanding
    if (cust) {
      const newBal = cust.outstandingBalance + total;
      const newSales = cust.totalSales + total;
      setCustomers(prev => prev.map(c => c.id === cust.id ? { ...c, outstandingBalance: newBal, totalSales: newSales } : c));
      updateCustomerFromApi(cust.id, { outstandingBalance: newBal, totalSales: newSales }).catch(console.error);
    }

    showToast(`Sales Invoice ${invNum} generated successfully`, 'success');
    notifyChange();

    setAlerts(prev => sortByLatest([{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `Invoice ${invNum} Generated`,
      description: `Amount ₹${total.toLocaleString('en-IN')} billed to ${disp.customerName}. Receivable created.`,
      timestamp: 'Just now',
      module: 'Finance & Accounts',
      read: false
    }, ...prev]));
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
    updateSalesInvoiceInApi(invoiceId, { paidAmount: newPaid, balanceAmount: newBalance, paymentStatus: newStatus }).catch(console.error);

    // Update customer outstanding balance
    const cust = customers.find(c => c.id === inv.customerId || (c.customerName && inv.customerName && c.customerName.toLowerCase() === inv.customerName.toLowerCase()));
    if (cust) {
      const newBal = Math.max(0, cust.outstandingBalance - amount);
      setCustomers(prev => prev.map(c => c.id === cust.id ? { ...c, outstandingBalance: newBal } : c));
      updateCustomerFromApi(cust.id, { outstandingBalance: newBal }).catch(console.error);
    }

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
    setPayments(prev => sortByLatest([newTx, ...prev]));
    createPaymentInApi(newTx).catch(console.error);
    persistPayment(newTx).catch((error) => {
      console.error('Failed to save payment to Firebase:', error);
    });

    showToast(`Payment of ₹${amount.toLocaleString('en-IN')} recorded successfully`, 'success');
    notifyChange();

    setAlerts(prev => sortByLatest([{
      id: `alt-${Date.now()}`,
      type: 'info',
      title: `Payment Received: ₹${amount.toLocaleString('en-IN')}`,
      description: `Cleared against invoice ${inv.invoiceNumber} from ${inv.customerName}.`,
      timestamp: 'Just now',
      module: 'Finance & Accounts',
      read: false
    }, ...prev]));
  };

  // Purchase Order & GRN
  const addPurchaseOrder = async (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'status'>): Promise<PurchaseOrder> => {
    const poNum = `PO-2609-0${purchaseOrders.length + 50}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now()}`,
      poNumber: poNum,
      status: 'Issued'
    };
    try {
      const apiPO = await createPurchaseOrderFromApi(newPO);
      const savedPO = apiPO || newPO;
      setPurchaseOrders(prev => sortByLatest([savedPO, ...prev]));
      showToast("Purchase Order created successfully", "success");
      notifyChange();
      return savedPO;
    } catch (err) {
      console.error("Failed to save purchase order to API:", err);
      showToast("Unable to create purchase order", "error");
      throw err;
    }
  };

  const updatePurchaseOrder = async (id: string, data: Partial<PurchaseOrder>) => {
    try {
      setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, ...data } : po));
      await updatePurchaseOrderFromApi(id, data);
      showToast("Purchase Order updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update purchase order:", err);
      showToast("Unable to update purchase order", "error");
    }
  };

  const deletePurchaseOrder = async (id: string) => {
    try {
      setPurchaseOrders(prev => prev.filter(po => po.id !== id));
      await deletePurchaseOrderFromApi(id);
      showToast("Purchase Order deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete purchase order:", err);
      showToast("Unable to delete purchase order", "error");
    }
  };

  // Automation 9 & 10: GRN -> QC & Inventory
  const addGRN = (grnData: Omit<GRN, 'id' | 'grnNumber' | 'qcStatus' | 'enteredInventory'>) => {
    const grnNum = `GRN-2609-0${grns.length + 35}`;
    const newGRN: GRN = {
      ...grnData,
      id: `grn-${Date.now()}`,
      grnNumber: grnNum,
      qcStatus: 'Approved',
      enteredInventory: true
    };
    setGRNs(prev => sortByLatest([newGRN, ...prev]));
    createGRNFromApi(newGRN)
      .then((apiGRN) => {
        setGRNs(prev => sortByLatest(prev.map(g => g.id === newGRN.id ? { ...newGRN, id: apiGRN.id } : g)));
        showToast("GRN created successfully", "success");
        notifyChange();
      })
      .catch((err) => {
        console.error("Failed to save GRN to API:", err);
        showToast("GRN created successfully", "success");
      });
    notifyChange();

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

  const updateGRN = async (id: string, data: Partial<GRN>) => {
    try {
      setGRNs(prev => prev.map(g => g.id === id ? { ...g, ...data } : g));
      await updateGRNFromApi(id, data);
      showToast("GRN updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update GRN:", err);
      showToast("Unable to update GRN", "error");
    }
  };

  const deleteGRN = async (id: string) => {
    try {
      setGRNs(prev => prev.filter(g => g.id !== id));
      await deleteGRNFromApi(id);
      showToast("GRN deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete GRN:", err);
      showToast("Unable to delete GRN", "error");
    }
  };

  const updateProductionOrder = async (id: string, data: Partial<ProductionOrder>) => {
    try {
      setProductionOrders(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      await updateProductionOrderInApi(id, data);
      showToast("Production Order updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Production Order:", err);
      showToast("Unable to update Production Order", "error");
    }
  };

  const deleteProductionOrder = async (id: string) => {
    try {
      setProductionOrders(prev => prev.filter(p => p.id !== id));
      await deleteProductionOrderFromApi(id);
      showToast("Production Order deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Production Order:", err);
      showToast("Unable to delete Production Order", "error");
    }
  };

  const updateProductionBatch = async (id: string, data: Partial<ProductionBatch>) => {
    try {
      setProductionBatches(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
      await updateProductionBatchInApi(id, data);
      showToast("Production Batch updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Production Batch:", err);
      showToast("Unable to update Production Batch", "error");
    }
  };

  const deleteProductionBatch = async (id: string) => {
    try {
      setProductionBatches(prev => prev.filter(b => b.id !== id));
      await deleteProductionBatchFromApi(id);
      showToast("Production Batch deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Production Batch:", err);
      showToast("Unable to delete Production Batch", "error");
    }
  };

  const updateQCInspection = async (id: string, data: Partial<QCInspection>) => {
    try {
      setQCInspections(prev => prev.map(q => q.id === id ? { ...q, ...data } : q));
      await updateQCInspectionInApi(id, data);
      showToast("QC Inspection updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update QC Inspection:", err);
      showToast("Unable to update QC Inspection", "error");
    }
  };

  const deleteQCInspection = async (id: string) => {
    try {
      setQCInspections(prev => prev.filter(q => q.id !== id));
      await deleteQCInspectionFromApi(id);
      showToast("QC Inspection deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete QC Inspection:", err);
      showToast("Unable to delete QC Inspection", "error");
    }
  };

  const addBOM = async (bomData: Omit<BOM, 'id'>): Promise<BOM> => {
    try {
      const tempId = `bom-${Date.now()}`;
      const newBOM: BOM = { ...bomData, id: tempId };
      const created = await createBOMInApi(bomData);
      const saved = created || newBOM;
      setBOMs(prev => sortByLatest([saved, ...prev]));
      showToast("BOM added successfully", "success");
      notifyChange();
      return saved;
    } catch (err) {
      console.error("Failed to add BOM:", err);
      showToast("Unable to add BOM", "error");
      throw err;
    }
  };

  const updateBOM = async (id: string, data: Partial<BOM>) => {
    try {
      setBOMs(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
      await updateBOMInApi(id, data);
      showToast("BOM updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update BOM:", err);
      showToast("Unable to update BOM", "error");
    }
  };

  const deleteBOM = async (id: string) => {
    try {
      setBOMs(prev => prev.filter(b => b.id !== id));
      await deleteBOMFromApi(id);
      showToast("BOM deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete BOM:", err);
      showToast("Unable to delete BOM", "error");
    }
  };

  const updateStockMovement = async (id: string, data: Partial<StockMovement>) => {
    try {
      setStockMovements(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
      await updateStockMovementInApi(id, data);
      showToast("Stock Movement updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Stock Movement:", err);
      showToast("Unable to update Stock Movement", "error");
    }
  };

  const deleteStockMovement = async (id: string) => {
    try {
      setStockMovements(prev => prev.filter(s => s.id !== id));
      await deleteStockMovementFromApi(id);
      showToast("Stock Movement deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Stock Movement:", err);
      showToast("Unable to delete Stock Movement", "error");
    }
  };

  const updateDispatch = async (id: string, data: Partial<DispatchChallan>) => {
    try {
      setDispatches(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
      await updateDispatchInApi(id, data);
      showToast("Dispatch updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Dispatch:", err);
      showToast("Unable to update Dispatch", "error");
    }
  };

  const deleteDispatch = async (id: string) => {
    try {
      setDispatches(prev => prev.filter(d => d.id !== id));
      await deleteDispatchFromApi(id);
      showToast("Dispatch deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Dispatch:", err);
      showToast("Unable to delete Dispatch", "error");
    }
  };

  const addVehicle = async (vehicleData: Omit<VehicleMaster, 'id'>) => {
    try {
      const tempId = `veh-${Date.now()}`;
      const newVeh: VehicleMaster = { ...vehicleData, id: tempId };
      setVehicles(prev => sortByLatest([newVeh, ...prev]));
      const created = await createVehicleInApi(vehicleData);
      if (created) {
        setVehicles(prev => sortByLatest(prev.map(v => v.id === tempId ? created : v)));
      }
      showToast("Vehicle registered successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to add vehicle:", err);
      showToast("Unable to add vehicle", "error");
    }
  };

  const updateVehicle = async (id: string, data: Partial<VehicleMaster>) => {
    try {
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
      await updateVehicleInApi(id, data);
      showToast("Vehicle updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Vehicle:", err);
      showToast("Unable to update Vehicle", "error");
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      setVehicles(prev => prev.filter(v => v.id !== id));
      await deleteVehicleFromApi(id);
      showToast("Vehicle deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Vehicle:", err);
      showToast("Unable to delete Vehicle", "error");
    }
  };

  const updateSalesInvoice = async (id: string, data: Partial<SalesInvoice>) => {
    try {
      setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
      await updateSalesInvoiceInApi(id, data);
      showToast("Sales Invoice updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Sales Invoice:", err);
      showToast("Unable to update Sales Invoice", "error");
    }
  };

  const deleteSalesInvoice = async (id: string) => {
    try {
      setInvoices(prev => prev.filter(i => i.id !== id));
      await deleteSalesInvoiceFromApi(id);
      showToast("Sales Invoice deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Sales Invoice:", err);
      showToast("Unable to delete Sales Invoice", "error");
    }
  };

  const updatePayment = async (id: string, data: Partial<PaymentTransaction>) => {
    try {
      setPayments(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      await updatePaymentInApi(id, data);
      showToast("Payment transaction updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Payment:", err);
      showToast("Unable to update Payment", "error");
    }
  };

  const deletePayment = async (id: string) => {
    try {
      setPayments(prev => prev.filter(p => p.id !== id));
      await deletePaymentFromApi(id);
      showToast("Payment transaction deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Payment:", err);
      showToast("Unable to delete Payment", "error");
    }
  };

  const addExpense = async (expData: Omit<ExpenseRecord, 'id' | 'expenseNumber' | 'status'>): Promise<ExpenseRecord> => {
    try {
      const expNum = `EXP-2609-0${expenses.length + 10}`;
      const tempId = `exp-${Date.now()}`;
      const newExp: ExpenseRecord = {
        ...expData,
        id: tempId,
        expenseNumber: expNum,
        status: 'Approved'
      };
      const created = await createExpenseInApi(newExp);
      if (created) {
        setExpenses(prev => sortByLatest([created, ...prev]));
        showToast("Expense record added successfully", "success");
        notifyChange();
        return created;
      } else {
        throw new Error("Failed to create expense in API");
      }
    } catch (err) {
      console.error("Failed to add Expense:", err);
      showToast("Unable to add Expense", "error");
      throw err;
    }
  };

  const updateExpense = async (id: string, data: Partial<ExpenseRecord>) => {
    try {
      setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
      await updateExpenseInApi(id, data);
      showToast("Expense updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Expense:", err);
      showToast("Unable to update Expense", "error");
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      setExpenses(prev => prev.filter(e => e.id !== id));
      await deleteExpenseFromApi(id);
      showToast("Expense deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Expense:", err);
      showToast("Unable to delete Expense", "error");
    }
  };

  const addEmployee = async (empData: Omit<Employee, 'id'>) => {
    try {
      const tempId = `emp-${Date.now()}`;
      const newEmp: Employee = { ...empData, id: tempId };
      setEmployees(prev => sortByLatest([newEmp, ...prev]));
      const created = await createEmployeeInApi(newEmp);
      if (created) {
        setEmployees(prev => sortByLatest(prev.map(e => e.id === tempId ? created : e)));
      }
      showToast("Employee added successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to add Employee:", err);
      showToast("Unable to add Employee", "error");
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    try {
      setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
      await updateEmployeeInApi(id, data);
      showToast("Employee updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Employee:", err);
      showToast("Unable to update Employee", "error");
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      setEmployees(prev => prev.filter(e => e.id !== id));
      await deleteEmployeeFromApi(id);
      showToast("Employee deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Employee:", err);
      showToast("Unable to delete Employee", "error");
    }
  };

  const addMachinery = async (machData: Omit<Machinery, 'id'>) => {
    try {
      const tempId = `mach-${Date.now()}`;
      const newMach: Machinery = { ...machData, id: tempId };
      setMachinery(prev => sortByLatest([newMach, ...prev]));
      const created = await createMachineryInApi(newMach);
      if (created) {
        setMachinery(prev => sortByLatest(prev.map(m => m.id === tempId ? created : m)));
      }
      showToast("Machinery record added successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to add Machinery:", err);
      showToast("Unable to add Machinery", "error");
    }
  };

  const updateMachinery = async (id: string, data: Partial<Machinery>) => {
    try {
      setMachinery(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
      await updateMachineryInApi(id, data);
      showToast("Machinery record updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Machinery:", err);
      showToast("Unable to update Machinery", "error");
    }
  };

  const deleteMachinery = async (id: string) => {
    try {
      setMachinery(prev => prev.filter(m => m.id !== id));
      await deleteMachineryFromApi(id);
      showToast("Machinery record deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Machinery:", err);
      showToast("Unable to delete Machinery", "error");
    }
  };

  const addDocument = async (docData: Omit<ErpDocument, 'id'>) => {
    try {
      const tempId = `doc-${Date.now()}`;
      const newDoc: ErpDocument = { ...docData, id: tempId };
      setDocuments(prev => sortByLatest([newDoc, ...prev]));
      const created = await createDocumentInApi(newDoc);
      if (created) {
        setDocuments(prev => sortByLatest(prev.map(d => d.id === tempId ? created : d)));
      }
      showToast("Document added successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to add Document:", err);
      showToast("Unable to add Document", "error");
    }
  };

  const updateDocument = async (id: string, data: Partial<ErpDocument>) => {
    try {
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
      await updateDocumentInApi(id, data);
      showToast("Document updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Document:", err);
      showToast("Unable to update Document", "error");
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      setDocuments(prev => prev.filter(d => d.id !== id));
      await deleteDocumentFromApi(id);
      showToast("Document deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete Document:", err);
      showToast("Unable to delete Document", "error");
    }
  };

  const updateCompanyProfile = async (data: Partial<CompanyProfile>) => {
    try {
      setCompany(prev => ({ ...prev, ...data }));
      await updateCompanyProfileInApi(data);
      showToast("Company Profile updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update Company Profile:", err);
      showToast("Unable to update Company Profile", "error");
    }
  };

  // Batch 2: Supplier CRUD
  const addSupplier = async (suppData: Omit<Supplier, 'id' | 'code' | 'totalPurchases' | 'outstandingBalance'>): Promise<Supplier> => {
    const code = `SUP-${String(suppliers.length + 1).padStart(3, '0')}`;
    const newSupp: Supplier = {
      ...suppData,
      id: `supp-${Date.now()}`,
      code,
      totalPurchases: 0,
      outstandingBalance: 0,
      rating: 5,
    };
    try {
      const apiSupp = await createSupplierFromApi(newSupp);
      setSuppliers(prev => sortByLatest([apiSupp, ...prev]));
      showToast("Supplier created successfully", "success");
      notifyChange();
      return apiSupp;
    } catch (err) {
      console.error("Failed to add supplier:", err);
      showToast("Unable to create supplier", "error");
      throw err;
    }
  };

  const updateSupplier = async (id: string, data: Partial<Supplier>) => {
    try {
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
      await updateSupplierFromApi(id, data);
      showToast("Supplier updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update supplier:", err);
      showToast("Unable to update supplier", "error");
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      await deleteSupplierFromApi(id);
      showToast("Supplier deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete supplier:", err);
      showToast("Unable to delete supplier", "error");
    }
  };

  // Batch 2: Raw Material CRUD
  const addRawMaterial = async (rmData: Omit<RawMaterial, 'id' | 'currentStock' | 'totalPurchases' | 'totalConsumption' | 'reservedStock'>) => {
    const newRM: RawMaterial = {
      ...rmData,
      id: `rm-${Date.now()}`,
      currentStock: rmData.openingStock || 0,
      totalPurchases: 0,
      totalConsumption: 0,
      reservedStock: 0
    };
    try {
      const apiRM = await createRawMaterialFromApi(newRM);
      setRawMaterials(prev => sortByLatest([apiRM, ...prev]));
      showToast("Raw material created successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to create raw material:", err);
      setRawMaterials(prev => sortByLatest([newRM, ...prev]));
      showToast("Raw material created successfully", "success");
      notifyChange();
    }
  };

  const updateRawMaterial = async (id: string, data: Partial<RawMaterial>) => {
    try {
      setRawMaterials(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
      await updateRawMaterialFromApi(id, data);
      showToast("Raw material updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update raw material:", err);
      showToast("Unable to update raw material", "error");
    }
  };

  const deleteRawMaterial = async (id: string) => {
    try {
      setRawMaterials(prev => prev.filter(m => m.id !== id));
      await deleteRawMaterialFromApi(id);
      showToast("Raw material deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete raw material:", err);
      showToast("Unable to delete raw material", "error");
    }
  };

  // Batch 2: Product / Finished Goods CRUD
  const addProduct = async (prodData: Omit<FinishedProduct, 'id'> & { currentStockMT?: number; reservedStockMT?: number }) => {
    const currentStock = typeof prodData.currentStockMT === 'number' ? prodData.currentStockMT : (Number(prodData.currentStockMT) || 0);
    const reservedStock = typeof prodData.reservedStockMT === 'number' ? prodData.reservedStockMT : (Number(prodData.reservedStockMT) || 0);

    const newProd: FinishedProduct = {
      ...prodData,
      id: `prod-${Date.now()}`,
      currentStockMT: currentStock,
      reservedStockMT: reservedStock,
    };
    try {
      const apiProd = await createProductFromApi(newProd);
      const normalizedProd: FinishedProduct = {
        ...apiProd,
        currentStockMT: typeof apiProd.currentStockMT === 'number' ? apiProd.currentStockMT : (Number(apiProd.currentStockMT) || currentStock),
        reservedStockMT: typeof apiProd.reservedStockMT === 'number' ? apiProd.reservedStockMT : (Number(apiProd.reservedStockMT) || reservedStock),
      };
      setProducts(prev => sortByLatest([normalizedProd, ...prev]));
      showToast("Product created successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to create product via API, saving to direct Firestore:", err);
      try {
        await persistFinishedProduct(newProd);
      } catch (persistErr) {
        console.error("Failed to persist product to Firestore fallback:", persistErr);
      }
      setProducts(prev => sortByLatest([newProd, ...prev]));
      showToast("Product created successfully", "success");
      notifyChange();
    }
  };

  const updateProduct = async (id: string, data: Partial<FinishedProduct>) => {
    try {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
      await updateProductFromApi(id, data);
      showToast("Product updated successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to update product via API, saving to direct Firestore:", err);
      try {
        const existing = products.find(p => p.id === id);
        if (existing) {
          await persistFinishedProduct({ ...existing, ...data });
        }
      } catch (persistErr) {
        console.error("Failed to persist product update to Firestore fallback:", persistErr);
      }
      showToast("Product updated successfully", "success");
      notifyChange();
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setProducts(prev => prev.filter(p => p.id !== id));
      await deleteProductFromApi(id);
      showToast("Product deleted successfully", "success");
      notifyChange();
    } catch (err) {
      console.error("Failed to delete product:", err);
      showToast("Unable to delete product", "error");
    }
  };

  const markAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  const resetAllData = () => {
    localStorage.clear();
    setCompany(initialCompanyProfile);
    setCustomers([]);
    setSuppliers([]);
    setProducts([]);
    setRawMaterials([]);
    setBOMs([]);
    setLeads([]);
    setSalesOrders([]);
    setPurchaseOrders([]);
    setGRNs([]);
    setQCInspections([]);
    setProductionOrders([]);
    setProductionBatches([]);
    setVehicles([]);
    setDispatches([]);
    setInvoices([]);
    setPayments([]);
    setExpenses([]);
    setMachinery([]);
    setEmployees([]);
    setDocuments([]);
    setAlerts([]);
    setStockMovements([]);
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
        // Step 9-10: Batch verification & Add to Finished Goods Available
        const latestBatch = productionBatches[0];
        if (latestBatch) {
          approveProductionBatch(latestBatch.id);
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
        stockMovements,
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
        toasts,
        showToast,
        dismissToast,
        addLead,
        updateLead,
        deleteLead,
        convertLeadToCustomer,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        updateRawMaterial,
        deleteRawMaterial,
        addProduct,
        updateProduct,
        deleteProduct,
        addSalesOrder,
        updateSalesOrder,
        deleteSalesOrder,
        createProductionOrderFromSO,
        addPurchaseOrder,
        updatePurchaseOrder,
        deletePurchaseOrder,
        addGRN,
        updateGRN,
        deleteGRN,
        updateProductionOrder,
        deleteProductionOrder,
        updateProductionBatch,
        deleteProductionBatch,
        updateQCInspection,
        deleteQCInspection,
        addBOM,
        updateBOM,
        deleteBOM,
        updateStockMovement,
        deleteStockMovement,
        approveQC,
        rejectQC,
        approveProductionBatch,
        startProductionOrder,
        completeProductionOrder,
        createDispatchChallan,
        updateDispatchStatus,
        updateDispatch,
        deleteDispatch,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        generateInvoiceFromDispatch,
        updateSalesInvoice,
        deleteSalesInvoice,
        recordCustomerPayment,
        updatePayment,
        deletePayment,
        addExpense,
        updateExpense,
        deleteExpense,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addMachinery,
        updateMachinery,
        deleteMachinery,
        addDocument,
        updateDocument,
        deleteDocument,
        updateCompanyProfile,
        addRawMaterial,
        markAlertRead,
        resetAllData,
        runDemoStepAction,
        refreshAllData: syncRealtimeData,
        getCustomerCredit: (customer: Customer | null | undefined) => getCustomerCreditSummary(customer, salesOrders),
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
