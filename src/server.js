import mongoose from "mongoose"

import app from "./app.js"
import env from "./config/env.js"

const startServer = async () => {
  try {
    await mongoose.connect(
      env.mongoUri
    );

    console.log(
      "MongoDB connected successfully"
    );

    const server = app.listen(
      env.port,
      () => {
        console.log(
          `Server running on http://localhost:${env.port}`
        );
      }
    );

    const shutdown = async (
      signal
    ) => {
      console.log(
        `${signal} received. Shutting down...`
      );

      server.close(async () => {
        await mongoose.disconnect();

        console.log(
          "MongoDB disconnected"
        );

        process.exit(0);
      });
    };

    process.on(
      "SIGTERM",
      () => shutdown("SIGTERM")
    );

    process.on(
      "SIGINT",
      () => shutdown("SIGINT")
    );
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    await mongoose.disconnect();

    process.exit(1);
  }
};

startServer();