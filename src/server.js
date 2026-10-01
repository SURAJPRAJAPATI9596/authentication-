const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "./.env"),
});
const connectDb = require("./config/db");
const { redisClient, connectRedis } = require("./config/redis");
const app = require("./app");

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDb();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
