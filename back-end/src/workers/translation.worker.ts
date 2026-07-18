import crypto from "crypto";
import { Worker } from "bullmq";
import Document from "../models/document.model.js";
import { redisConnection } from "../config/redis.js";
import { EmailService } from "../infrastructure/email/email.service.js";
import { TranslationJobService } from "../api/services/translation-job.service.js";

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
    concurrency: 1,
    lockDuration: 3 * 60 * 60 * 1000,
  },
);
worker.on("active", (job) => {
  console.log(`Started processing document ${job.data.documentId}`);
});

worker.on("completed", async (job) => {
  console.log("The translation has been completed.", job.data?.documentId);
  const token = crypto.randomBytes(32).toString("hex");

  await Document.update(
    {
      status: "COMPLETED",
      translated_path: `translated\\${job.data?.documentId}-translated.docx`,
      downloadToken: token,
      tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
    {
      where: {
        id: job.data?.documentId,
      },
    },
  );

  const emailService = new EmailService();

  await emailService.sendTranslationReadyEmail(
    "jafarifardz@gmail.com",
    `${process.env.APP_URL}/api/download/${token}`,
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
