import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { swaggerDocument } from "./config/swagger.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import { apiRouter } from "./routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 200,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/api/v1", apiRouter);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
