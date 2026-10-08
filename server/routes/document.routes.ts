import { Router } from "express";
import * as documentController from "../controllers/document.controller";

const router = Router();

router.get("/", documentController.getDocuments);
router.post("/", documentController.createDocument);
router.put("/:id", documentController.updateDocument);
router.delete("/:id", documentController.deleteDocument);

export default router;
