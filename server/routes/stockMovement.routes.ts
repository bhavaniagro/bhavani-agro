import { Router } from "express";
import {
    getStockMovements,
    createStockMovement,
    updateStockMovement,
    deleteStockMovement,
} from "../controllers/stockMovement.controller";

const router = Router();

router.get("/", getStockMovements);
router.post("/", createStockMovement);
router.put("/:id", updateStockMovement);
router.delete("/:id", deleteStockMovement);

export default router;
