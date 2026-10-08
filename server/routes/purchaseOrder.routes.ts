import { Router } from "express";
import {
    getPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
} from "../controllers/purchaseOrder.controller";

const router = Router();

router.get("/", getPurchaseOrders);
router.post("/", createPurchaseOrder);
router.put("/:id", updatePurchaseOrder);
router.delete("/:id", deletePurchaseOrder);

export default router;
