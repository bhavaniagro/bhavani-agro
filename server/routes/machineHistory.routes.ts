import { Router } from "express";
import * as historyController from "../controllers/machineHistory.controller";

const router = Router();

router.get("/", historyController.getMachineHistory);
router.post("/", historyController.createMachineHistory);
router.delete("/:id", historyController.deleteMachineHistory);

export default router;
