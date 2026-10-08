import { Router } from "express";
import {
    getBOMs,
    createBOM,
    updateBOM,
    deleteBOM,
} from "../controllers/bom.controller";

const router = Router();

router.get("/", getBOMs);
router.post("/", createBOM);
router.put("/:id", updateBOM);
router.delete("/:id", deleteBOM);

export default router;
