import { Router } from "express";
import {
    getQCInspections,
    createQCInspection,
    updateQCInspection,
    deleteQCInspection,
} from "../controllers/qcInspection.controller";

const router = Router();

router.get("/", getQCInspections);
router.post("/", createQCInspection);
router.put("/:id", updateQCInspection);
router.delete("/:id", deleteQCInspection);

export default router;
