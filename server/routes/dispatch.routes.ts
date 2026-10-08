import { Router } from "express";
import {
    getDispatches,
    createDispatch,
    updateDispatch,
    deleteDispatch,
} from "../controllers/dispatch.controller";

const router = Router();

router.get("/", getDispatches);
router.post("/", createDispatch);
router.put("/:id", updateDispatch);
router.delete("/:id", deleteDispatch);

export default router;
