const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected");
};

module.exports = {
  redisClient,
  connectRedis,
};
