import { translationQueue } from "../../config/translation.queue.js";

import Document from "../../models/document.model.js";

export const translationService = {
  async translate(file: Express.Multer.File, userId: number) {
    let document: Document | null = null;
    try {
      if (!file) {
        throw new Error("No file");
      }

      document = await Document.create({
        user_id: userId,
        original_name: file.originalname,
        original_path: file.path,
        source_language: file.mimetype,
        target_language: "docx",
        status: "QUEUED",
      });

      await translationQueue.add(
        "translate-document",
        {
          documentId: document.id,
        },
        {
          attempts: 3,
          removeOnFail: false,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
        },
      );

      return {
        documentId: document.id,
        status: document.status,
      };
    } catch (error: unknown) {
      console.error(error);

      if (document) {
        await document.update({
          status: "FAILED",
          error_message: error instanceof Error ? error.message : String(error),
        });
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(String(error));
    }
  },
};
