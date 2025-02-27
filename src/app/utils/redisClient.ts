import { createClient } from "redis";
import config from "../config";

const redisClient = createClient({
  url: `redis://${config.redis_host || "localhost"}:${config.redis_port || 6379}`,
  password: config.redis_password || "",
});

redisClient.connect();

redisClient.on("connect", () => {
  console.log("Connected to Redis...");
});

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

export { redisClient };
