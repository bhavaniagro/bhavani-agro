import { Router } from "express";
import {
    getProductionOrders,
    createProductionOrder,
    updateProductionOrder,
    deleteProductionOrder,
} from "../controllers/productionOrder.controller";

const router = Router();

router.get("/", getProductionOrders);
router.post("/", createProductionOrder);
router.put("/:id", updateProductionOrder);
router.delete("/:id", deleteProductionOrder);

export default router;
