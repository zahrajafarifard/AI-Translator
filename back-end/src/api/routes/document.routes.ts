import { Router } from "express";
import { translateDocument } from "../controllers/document.controller.js";
import { upload } from "../../config/multer.config.js";
const router = Router();

router.post("/translate", upload.single("document"), translateDocument);

export default router;
