import { Router } from "express";
import {
    getLeads,
    postLead,
} from "../controllers/lead.controller";

const router = Router();

router.get("/", getLeads);
router.post("/", postLead);

export default router;