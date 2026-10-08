import type {
    Customer,
    Lead,
    SalesOrder,
    PurchaseOrder,
    GRN,
    QCInspection,
    ProductionOrder,
    ProductionBatch,
    FinishedProduct,
    RawMaterial,
    DispatchChallan,
    SalesInvoice,
    PaymentTransaction,
    ExpenseRecord,
} from "../../types/erp";

import { saveDocument } from "./erpFirestore.service";

export async function persistCustomer(
    item: Customer
): Promise<void> {
    await saveDocument("customers", item);
}

export async function persistLead(
    item: Lead
): Promise<void> {
    await saveDocument("leads", item);
}

export async function persistSalesOrder(
    item: SalesOrder
): Promise<void> {
    await saveDocument("salesOrders", item);
}

export async function persistPurchaseOrder(
    item: PurchaseOrder
): Promise<void> {
    await saveDocument("purchaseOrders", item);
}

export async function persistGRN(
    item: GRN
): Promise<void> {
    await saveDocument("grns", item);
}

export async function persistQCInspection(
    item: QCInspection
): Promise<void> {
    await saveDocument("qcInspections", item);
}

export async function persistProductionOrder(
    item: ProductionOrder
): Promise<void> {
    await saveDocument("productionOrders", item);
}

export async function persistProductionBatch(
    item: ProductionBatch
): Promise<void> {
    await saveDocument("productionBatches", item);
}

export async function persistFinishedProduct(
    item: FinishedProduct
): Promise<void> {
    await saveDocument("products", item);
}

export async function persistRawMaterial(
    item: RawMaterial
): Promise<void> {
    await saveDocument("rawMaterials", item);
}

export async function persistDispatch(
    item: DispatchChallan
): Promise<void> {
    await saveDocument("dispatches", item);
}

export async function persistInvoice(
    item: SalesInvoice
): Promise<void> {
    await saveDocument("invoices", item);
}

export async function persistPayment(
    item: PaymentTransaction
): Promise<void> {
    await saveDocument("payments", item);
}

export async function persistExpense(
    item: ExpenseRecord
): Promise<void> {
    await saveDocument("expenses", item);
}