import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { TranslationJobService } from "../api/services/translation-job.service.js";

const service = new TranslationJobService();

const worker = new Worker(
  "translation",
  async (job) => {
    console.log("Path:", job.data.filePath);

    await service.translateDocument(job.data.filePath);
  },
  {
    connection: redisConnection,
  },
);

worker.on("completed", (job) => {
  console.log("The translation has been completed.", job.data.filePath);
});
