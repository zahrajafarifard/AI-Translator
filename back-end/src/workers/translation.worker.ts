import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { TranslationJobService } from "../api/services/translation-job.service.js";
import Document from "../models/document.model.js";

const service = new TranslationJobService();

const worker = new Worker(
  "translation",
  async (job) => {
    try {
      const { documentId } = job.data;

      const document = await Document.findByPk(documentId);

      if (!document) {
        throw new Error("Document not found");
      }

      await document.update({
        status: "PROCESSING",
      });

      const originalPath = document.getDataValue("original_path");

      await service.translateDocument(originalPath, document?.id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  {
    connection: redisConnection,
    maxStalledCount: 1,
  },
);
worker.on("active", (job) => {
  console.log(`Started processing document ${job.data.documentId}`);
});

worker.on("completed", async (job) => {
  console.log("The translation has been completed.", job.data?.documentId);

  await Document.update(
    {
      status: "COMPLETED",
      translated_path: `translated\\${job.data?.documentId}-translated.docx`,
    },
    {
      where: {
        id: job.data?.documentId,
      },
    },
  );
});

worker.on("failed", async (job, err) => {
  console.error(err);

  if (!job) return;

  await Document.update(
    {
      status: "FAILED",
      error_message: err instanceof Error ? err.message : String(err),
    },
    {
      where: {
        id: job.data.documentId,
      },
    },
  );
});

//This is not about a job failing. It's about the worker itself having a problem.
worker.on("error", (err) => {
  console.error("Worker error:", err);
});

worker.on("stalled", (jobId) => {
  console.log(`Job ${jobId} stalled.`);
});
