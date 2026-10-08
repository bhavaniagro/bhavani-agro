import { Router } from "express";
import {
    getGRNs,
    createGRN,
    updateGRN,
    deleteGRN,
} from "../controllers/grn.controller";

const router = Router();

router.get("/", getGRNs);
router.post("/", createGRN);
router.put("/:id", updateGRN);
router.delete("/:id", deleteGRN);

export default router;
