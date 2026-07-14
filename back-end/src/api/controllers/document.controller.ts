import type { Request, Response } from "express";
import { translationService } from "../services/translation.service.js";

export async function translateDocument(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({
        message: "No file uploaded",
      });
      return;
    }

    const result = await translationService.translate(req.file);
    

    res.status(200).json(result);
  } catch (error: unknown) {
    console.error(error);

    res.status(500).json({
      message: "Translation failed",
    });
  }
}
