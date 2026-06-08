import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { HttpError } from "../utils/http-error.js";

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, `Route ${req.method} ${req.originalUrl} not found`));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.flatten().fieldErrors
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return res.status(409).json({ message: "A record with this unique field already exists" });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
