import { Router } from "express";
import { download } from "../controllers/download.controller.js";

const router = Router();

router.get("/:token", download);

export default router;
