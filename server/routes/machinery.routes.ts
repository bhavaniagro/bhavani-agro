import { Router } from "express";
import * as machineryController from "../controllers/machinery.controller";

const router = Router();

router.get("/", machineryController.getMachinery);
router.post("/", machineryController.createMachinery);
router.put("/:id", machineryController.updateMachinery);
router.delete("/:id", machineryController.deleteMachinery);

export default router;
