// Types for Bhavani Agro & Minerals ERP

export type UserRole = 
  | 'Owner / Admin'
  | 'Sales'
  | 'Purchase'
  | 'Production Manager'
  | 'Warehouse'
  | 'Accounts'
  | 'Dispatch';

export interface CompanyProfile {
  name: string;
  legalName: string;
  formation: string;
  established: string;
  businessType: string;
  industry: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  branch: string;
}

export type LeadStage = 
  | 'New'
  | 'Contacted'
  | 'Follow-up'
  | 'Quotation'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export interface Lead {
  id: string;
  leadName: string;
  company: string;
  contactPerson: string;
  mobile: string;
  email: string;
  location: string;
  productInterested: string;
  expectedQuantityMT: number;
  leadSource: string;
  estimatedValue: number;
  followUpDate: string;
  salesperson: string;
  status: LeadStage;
  notes?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  code: string;
  customerName: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  billingAddress: string;
  shippingAddress: string;
  gstin: string;
  state: string;
  creditLimit: number;
  paymentTerms: string; // e.g. "Net 30 Days", "Immediate", "50% Advance"
  customerType: 'Distributor' | 'Dealer' | 'Fertilizer Blender' | 'Cooperative' | 'Institutional Buyer';
  assignedSalesperson: string;
  totalSales: number;
  outstandingBalance: number;
  createdAt: string;
}

export interface Supplier {
  id: string;
  code: string;
  supplierName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: string;
  gstin: string;
  materialSupplied: string[];
  paymentTerms: string;
  creditPeriodDays: number;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  totalPurchases: number;
  outstandingBalance: number;
  rating: number; // 1 to 5
}

export interface RawMaterial {
  id: string;
  sku: string;
  materialName: string;
  category: 'Mineral Ore' | 'Organic Input' | 'Microbial' | 'Chemical & Additive' | 'Packaging' | 'Consumable';
  unit: 'KG' | 'MT' | 'Bags' | 'Liters' | 'Units';
  minimumStock: number;
  maximumStock: number;
  currentStock: number; // Opening + Purchases + Production Returns - Consumption - Other Issues
  openingStock: number;
  totalPurchases: number;
  totalConsumption: number;
  reservedStock: number;
  averageCost: number; // in INR
  storageLocation: string; // e.g. "Shed A - Bin 3", "Cool Storage Cell 2"
  primarySupplier: string;
  reorderLevel: number;
}

export interface FinishedProduct {
  id: string;
  sku: string;
  productName: string;
  category: 'Granules' | 'Bio-Fertilizer' | 'Organic' | 'Powder' | 'Mineral';
  unit: 'MT' | 'Bags';
  sellingPricePerMT: number;
  standardCostPerMT: number;
  currentStockMT: number;
  reservedStockMT: number;
  minimumStockMT: number;
  maximumStockMT: number;
  packagingType: '50kg HDPE Woven Bag' | '25kg Kraft Paper Bag' | '1000kg Jumbo Bag' | 'Bulk Loose';
  storageLocation: string;
  taxRate: number; // e.g. 5% for fertilizers, 18% for mineral chemicals
  hsnCode: string;
  description: string;
}

export interface BOMItem {
  rawMaterialId: string;
  rawMaterialName: string;
  quantityPerMT: number; // kg or units needed per 1 MT output
  unit: string;
  costPerUnit: number;
  wastagePercent: number;
}

export interface BOM {
  id: string;
  productId: string;
  productName: string;
  version: string;
  batchYieldMT: number; // usually 1 MT or 10 MT
  processLossPercent: number;
  items: BOMItem[];
  packagingBagsPerMT: number;
  packagingCostPerMT: number;
  labourCostPerMT: number;
  powerElectricityCostPerMT: number;
  overheadCostPerMT: number;
  totalRawMaterialCostPerMT: number;
  totalStandardCostPerMT: number;
  notes?: string;
  isActive: boolean;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  validUntil: string;
  productId: string;
  productName: string;
  quantityMT: number;
  ratePerMT: number;
  discountPercent: number;
  taxPercent: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentTerms: string;
  deliveryTerms: string;
  notes: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Converted to Order' | 'Rejected';
}

export type SalesOrderStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Production Required'
  | 'Ready'
  | 'Dispatched'
  | 'Completed'
  | 'Cancelled';

export interface SalesOrder {
  id: string;
  orderNumber: string;
  quotationId?: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  productId: string;
  productName: string;
  quantityMT: number;
  ratePerMT: number;
  discountPercent: number;
  taxPercent: number;
  totalAmount: number;
  paymentTerms: string;
  shippingAddress: string;
  status: SalesOrderStatus;
  stockAvailable: boolean;
  productionOrderId?: string;
  dispatchId?: string;
  invoiceId?: string;
  notes: string;
}

export type PurchaseOrderStatus = 
  | 'Draft'
  | 'Approved'
  | 'Issued'
  | 'Partial GRN'
  | 'GRN Completed'
  | 'Billed'
  | 'Cancelled';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  rate: number;
  taxPercent: number;
  freightCost: number;
  totalAmount: number;
  paymentTerms: string;
  status: PurchaseOrderStatus;
  notes: string;
}

export interface GRN {
  id: string;
  grnNumber: string;
  poNumber: string;
  poId: string;
  supplierId: string;
  supplierName: string;
  materialId: string;
  materialName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unit: string;
  supplierBatchNumber: string;
  internalLotNumber: string;
  manufacturingDate: string;
  vehicleNumber: string;
  weightReceiptMT: number;
  date: string;
  qcStatus: 'Pending QC' | 'Approved' | 'Rejected';
  enteredInventory: boolean;
  remarks: string;
}

export interface QCInspection {
  id: string;
  qcNumber: string;
  type: 'Incoming Raw Material' | 'In-Process Production' | 'Finished Goods';
  referenceId: string; // GRN # or Production Order # or Batch #
  itemCode: string;
  itemName: string;
  batchLotNumber: string;
  quantity: number;
  unit: string;
  inspectionDate: string;
  inspector: string;
  parameters: {
    parameter: string;
    specification: string;
    observedValue: string;
    status: 'Pass' | 'Fail';
  }[];
  overallStatus: 'Pending' | 'Under Testing' | 'Approved' | 'Rejected';
  labReportAttachment?: string;
  remarks: string;
}

export type ProductionOrderStatus = 
  | 'Draft'
  | 'Planned'
  | 'Material Ready'
  | 'In Production'
  | 'QC'
  | 'Completed'
  | 'Cancelled';

export interface ProductionOrder {
  id: string;
  productionOrderNumber: string;
  salesOrderId?: string;
  productId: string;
  productName: string;
  targetQuantityMT: number;
  bomId: string;
  plannedStartDate: string;
  plannedEndDate: string;
  productionLine: string; // "Granulation Line 1", "Raymond Mill Pulverizer", "Bio-Fertilizer Fermentation"
  supervisor: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  status: ProductionOrderStatus;
  materialCheck: {
    materialId: string;
    materialName: string;
    requiredQty: number;
    availableQty: number;
    shortageQty: number;
    unit: string;
  }[];
  hasMaterialShortage: boolean;
  actualBatchNumber?: string;
  outputProducedMT?: number;
  notes: string;
}

export interface ProductionEntry {
  id: string;
  productionOrderId: string;
  productionOrderNumber: string;
  productName: string;
  batchNumber: string;
  startTime: string;
  endTime: string;
  inputRawMaterialQtyMT: number;
  outputFinishedGoodsQtyMT: number;
  wastageQuantityMT: number;
  rejectedQuantityMT: number;
  efficiencyPercent: number; // e.g. 96.5%
  yieldPercent: number; // output / input * 100
  powerConsumedKWh: number;
  supervisor: string;
  productionDate: string;
  qcStatus: 'Pending' | 'Approved' | 'Rejected';
  storageLocation: string;
  remarks: string;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  productionDate: string;
  productionOrderId: string;
  rawMaterialLots: {
    lotNumber: string;
    materialName: string;
    quantityUsed: number;
    unit: string;
  }[];
  quantityProducedMT: number;
  quantityRemainingMT: number;
  qcStatus: 'Pending' | 'Approved' | 'Rejected';
  storageLocation: string;
  manufacturingDate: string;
  bestBeforeDate: string;
  standardCostPerMT: number;
  actualCostPerMT: number;
}

export interface StockMovement {
  id: string;
  date: string;
  itemType: 'Raw Material' | 'Finished Goods' | 'Packaging' | 'Consumable';
  itemId: string;
  itemName: string;
  batchOrLotNumber?: string;
  movementType: 'Purchase Receipt' | 'Production Issue' | 'Production Output' | 'Dispatch' | 'Adjustment' | 'Rejection';
  quantity: number;
  unit: string;
  balanceAfter: number;
  referenceDocNumber: string; // GRN#, PO#, PROD#, INV#, etc.
  performedBy: string;
}

export type DispatchStatus = 
  | 'Ready'
  | 'Loaded'
  | 'Dispatched'
  | 'In Transit'
  | 'Delivered'
  | 'Returned';

export interface DispatchChallan {
  id: string;
  dispatchNumber: string;
  salesOrderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  invoiceNumber?: string;
  productName: string;
  batchNumber: string;
  quantityMT: number;
  bagsCount: number;
  vehicleNumber: string;
  driverName: string;
  driverMobile: string;
  transporterName: string;
  dispatchDate: string;
  destination: string;
  eWayBillNumber: string;
  lrNumber: string; // Lorry Receipt
  freightAmountRs: number;
  freightPaidBy: 'Company' | 'Customer';
  status: DispatchStatus;
  deliveryDate?: string;
  remarks: string;
}

export interface VehicleMaster {
  id: string;
  vehicleNumber: string;
  vehicleType: '10-Wheeler Truck (20 MT)' | '12-Wheeler Truck (25 MT)' | '14-Wheeler Trailer (35 MT)' | '6-Wheeler Tipper (10 MT)' | 'Mini Truck (3.5 MT)';
  transporterName: string;
  driverName: string;
  driverPhone: string;
  capacityMT: number;
  freightRatePerMTPerKM: number;
  status: 'Available' | 'On Trip' | 'Under Maintenance';
  pucExpiry: string;
  fitnessExpiry: string;
  insuranceExpiry?: string;
}

export type InvoicePaymentStatus = 
  | 'Unpaid'
  | 'Partially Paid'
  | 'Paid'
  | 'Overdue';

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  salesOrderId: string;
  dispatchId?: string;
  customerId: string;
  customerName: string;
  gstin: string;
  billingAddress: string;
  shippingAddress: string;
  invoiceDate: string;
  dueDate: string;
  productName: string;
  hsnCode: string;
  quantityMT: number;
  ratePerMT: number;
  discountAmount: number;
  taxableValue: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTax: number;
  freightAmount: number;
  roundOff: number;
  totalInvoiceAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: InvoicePaymentStatus;
  paymentTerms: string;
}

export interface PaymentTransaction {
  id: string;
  transactionNumber: string;
  type: 'Customer Receipt' | 'Supplier Payment';
  partyId: string;
  partyName: string;
  referenceInvoiceNumber: string;
  paymentDate: string;
  amount: number;
  paymentMode: 'NEFT/RTGS' | 'Cheque' | 'Cash' | 'UPI';
  bankReference: string;
  notes: string;
}

export interface ExpenseRecord {
  id: string;
  expenseNumber: string;
  category: 
    | 'Electricity & Power'
    | 'Fuel & Diesel (DG/Boiler)'
    | 'Labour & Wages'
    | 'Freight & Transport'
    | 'Machinery Repairs & Spares'
    | 'Packaging Materials'
    | 'Factory Rent'
    | 'Staff Salaries'
    | 'Lab Testing & R&D'
    | 'Office & Admin'
    | 'Miscellaneous';
  date: string;
  amount: number;
  paidFromAccount: 'SBI Industrial Current A/c' | 'HDFC Cash Credit A/c' | 'Petty Cash';
  vendorName: string;
  description: string;
  invoiceOrVoucherNo: string;
  status: 'Approved' | 'Pending Review';
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  mobile: string;
  role: string;
  department: 'Production' | 'Sales' | 'Purchase' | 'Accounts' | 'Warehouse' | 'Dispatch' | 'Administration';
  joiningDate: string;
  monthlySalary: number;
  status: 'Active' | 'On Leave' | 'Resigned';
}

export interface Machinery {
  id: string;
  machineCode: string;
  machineName: string;
  department: 'Granulation' | 'Pulverizing & Grinding' | 'Bio-Reactor' | 'Packaging & Dispatch' | 'Power & Utilities';
  capacityRating: string; // e.g. "15 MT / Hour", "800 RPM"
  installationDate: string;
  maintenanceFrequencyDays: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  currentStatus: 'Operational' | 'Under Maintenance' | 'Standby' | 'Breakdown';
  breakdownCountThisYear: number;
  totalMaintenanceCostThisYear: number;
}

export interface ErpDocument {
  id: string;
  title: string;
  documentType: 'GST & Statutory' | 'Quality Lab Report' | 'E-Way Bill' | 'Supplier Invoice' | 'Delivery Challan' | 'Pollution Clearance & License';
  relatedEntity: string; // e.g. "Order #SO-2409-082", "Batch #BNT-2609-088"
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface ErpAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  module: string;
  actionUrl?: string;
  read: boolean;
}
