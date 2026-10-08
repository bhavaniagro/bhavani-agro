import { Router } from "express";
import * as companyController from "../controllers/company.controller";

const router = Router();

router.get("/", companyController.getCompanyProfile);
router.post("/", companyController.updateCompanyProfile);
router.put("/", companyController.updateCompanyProfile);

export default router;
