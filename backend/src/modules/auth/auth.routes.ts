import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { validate } from "../../middleware/validate.js";
import { login, me, register } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), asyncHandler(register));
authRouter.post("/login", validate(loginSchema), asyncHandler(login));
authRouter.get("/me", authenticate, asyncHandler(me));
