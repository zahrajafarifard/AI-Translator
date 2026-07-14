import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { TranslationJobService } from "../api/services/translation-job.service.js";

const service = new TranslationJobService();

new Worker(
  "translation",
  async (job) => {
    console.log("Path:", job.data.filePath);

    await service.process(job.data.filePath);
  },
  {
    connection: redisConnection,
  },
);
