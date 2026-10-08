import { Router } from "express";
import {
    getSalesInvoices,
    createSalesInvoice,
    updateSalesInvoice,
    deleteSalesInvoice,
} from "../controllers/salesInvoice.controller";

const router = Router();

router.get("/", getSalesInvoices);
router.post("/", createSalesInvoice);
router.put("/:id", updateSalesInvoice);
router.delete("/:id", deleteSalesInvoice);

export default router;
