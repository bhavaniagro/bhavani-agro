import { Router } from "express";
import {
    getSalesOrders,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
} from "../controllers/salesOrder.controller";

const router = Router();

router.get("/", getSalesOrders);
router.post("/", createSalesOrder);
router.put("/:id", updateSalesOrder);
router.delete("/:id", deleteSalesOrder);

export default router;
