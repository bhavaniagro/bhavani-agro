import { Router } from "express";
import {
    getLeads,
    postLead,
    updateLead,
    deleteLead,
} from "../controllers/lead.controller";

const router = Router();

router.get("/", getLeads);
router.post("/", postLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;