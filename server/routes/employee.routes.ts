import { Router } from "express";
import * as employeeController from "../controllers/employee.controller";

const router = Router();

router.get("/", employeeController.getEmployees);
router.post("/", employeeController.createEmployee);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

export default router;
