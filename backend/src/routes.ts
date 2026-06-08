import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes.js";
import { productRouter } from "./modules/products/product.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "primetrade-assignment-api" });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productRouter);
