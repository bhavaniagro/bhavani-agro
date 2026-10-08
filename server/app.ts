import express from "express";
import cors from "cors";

import leadRoutes from "./routes/lead.routes";
import customerRoutes from "./routes/customer.routes";
import supplierRoutes from "./routes/supplier.routes";
import rawMaterialRoutes from "./routes/rawMaterial.routes";
import productRoutes from "./routes/product.routes";
import salesOrderRoutes from "./routes/salesOrder.routes";
import purchaseOrderRoutes from "./routes/purchaseOrder.routes";
import grnRoutes from "./routes/grn.routes";
import productionOrderRoutes from "./routes/productionOrder.routes";
import productionBatchRoutes from "./routes/productionBatch.routes";
import qcInspectionRoutes from "./routes/qcInspection.routes";
import bomRoutes from "./routes/bom.routes";
import stockMovementRoutes from "./routes/stockMovement.routes";
import dispatchRoutes from "./routes/dispatch.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import salesInvoiceRoutes from "./routes/salesInvoice.routes";
import paymentRoutes from "./routes/payment.routes";
import expenseRoutes from "./routes/expense.routes";
import employeeRoutes from "./routes/employee.routes";
import machineryRoutes from "./routes/machinery.routes";
import documentRoutes from "./routes/document.routes";
import companyRoutes from "./routes/company.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Bhavani Agro API is running",
    });
});

app.use("/api/leads", leadRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/raw-materials", rawMaterialRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales-orders", salesOrderRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/grns", grnRoutes);
app.use("/api/production-orders", productionOrderRoutes);
app.use("/api/production-batches", productionBatchRoutes);
app.use("/api/qc-inspections", qcInspectionRoutes);
app.use("/api/boms", bomRoutes);
app.use("/api/stock-movements", stockMovementRoutes);
app.use("/api/dispatches", dispatchRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/sales-invoices", salesInvoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/machinery", machineryRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/company", companyRoutes);

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
});