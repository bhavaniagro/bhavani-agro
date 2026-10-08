import { Router } from "express";
import {
    getProductionBatches,
    createProductionBatch,
    updateProductionBatch,
    deleteProductionBatch,
} from "../controllers/productionBatch.controller";

const router = Router();

router.get("/", getProductionBatches);
router.post("/", createProductionBatch);
router.put("/:id", updateProductionBatch);
router.delete("/:id", deleteProductionBatch);

export default router;
