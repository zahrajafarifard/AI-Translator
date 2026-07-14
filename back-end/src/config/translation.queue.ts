import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const translationQueue = new Queue("translation", {
  connection: redisConnection,
});