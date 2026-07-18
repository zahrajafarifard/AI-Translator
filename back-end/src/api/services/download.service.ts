import fs from "fs";
import path from "path";
import Document from "../../models/document.model.js";

export const downloadService = {
  async getDownloadFile(token: string) {
    const document = await Document.findOne({
      where: {
        downloadToken: token,
        status: "COMPLETED",
      },
    });

    if (!document) {
      throw new Error("INVALID_TOKEN");
    }

    if (
      document.tokenExpiry &&
      document.tokenExpiry.getTime() < Date.now()
    ) {
      throw new Error("TOKEN_EXPIRED");
    }

    if (!document.translated_path) {
      throw new Error("FILE_NOT_FOUND");
    }

    const filePath = path.resolve(document.translated_path);

    if (!fs.existsSync(filePath)) {
      throw new Error("FILE_NOT_FOUND");
    }

    return {
      path: filePath,
      filename: path.basename(filePath),
    };
  },
};