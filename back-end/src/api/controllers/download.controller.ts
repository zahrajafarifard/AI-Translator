import type { Request, Response, NextFunction } from "express";
import { downloadService } from "../services/download.service.js";
import { renderPage } from "../../utils/renderPage.js";

export async function download(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = Array.isArray(req.params.token)
      ? req.params.token[0]
      : req.params.token;

    if (!token) {
      throw new Error("INVALID_TOKEN");
    }

    const file = await downloadService.getDownloadFile(token);

    res.download(file.path, file.filename, (error) => {
      if (error && !res.headersSent) {
        res
          .status(500)
          .send(renderPage("Error", "Error occurred while downloading."));
      }
    });
  } catch (error: any) {
    if (error.message === "INVALID_TOKEN") {
      return res
        .status(404)
        .send(renderPage("Download Failed", "The download link is invalid."));
    }

    if (error.message === "TOKEN_EXPIRED") {
      return res
        .status(410)
        .send(renderPage("Link Expired", "This download link has expired."));
    }

    if (error.message === "FILE_NOT_FOUND") {
      return res
        .status(404)
        .send(
          renderPage(
            "File Not Found",
            "The translated document is no longer available.",
          ),
        );
    }

    next(error);
  }
}