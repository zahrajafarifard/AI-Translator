import { Router } from "express";
import { translateDocument } from "../controllers/document.controller.js";
import { upload } from "../../config/multer.config.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const router = Router();

router.post(
  "/translate",
  authMiddleware,
  upload.single("document"),
  translateDocument,
);

export default router;
