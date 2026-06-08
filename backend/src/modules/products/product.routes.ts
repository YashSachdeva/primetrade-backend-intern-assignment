import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validate } from "../../middleware/validate.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct
} from "./product.controller.js";
import { productCreateSchema, productUpdateSchema } from "./product.schemas.js";

export const productRouter = Router();

productRouter.use(authenticate);
productRouter.get("/", asyncHandler(listProducts));
productRouter.get("/:id", asyncHandler(getProduct));
productRouter.post("/", authorize(Role.ADMIN), validate(productCreateSchema), asyncHandler(createProduct));
productRouter.patch("/:id", authorize(Role.ADMIN), validate(productUpdateSchema), asyncHandler(updateProduct));
productRouter.delete("/:id", authorize(Role.ADMIN), asyncHandler(deleteProduct));
