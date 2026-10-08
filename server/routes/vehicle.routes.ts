import { Router } from "express";
import {
    getVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
} from "../controllers/vehicle.controller";

const router = Router();

router.get("/", getVehicles);
router.post("/", createVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
