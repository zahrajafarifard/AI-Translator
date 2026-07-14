import { translationQueue } from "../../config/translation.queue.js";

export const translationService = {
  async translate(file: Express.Multer.File) {
    if (!file) {
      throw new Error("No file provided");
    }

    const job = await translationQueue.add(
      "translate-document",
      {
        filePath: file.path,
      },
      {
        attempts: 3,
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );

    return {
      jobId: job.id,
      status: "queued",
    };
  },
};