import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import { HttpError } from "../utils/http-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    return next(new HttpError(401, "Authentication token is required"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, "Authentication token is required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, "You do not have permission to perform this action"));
    }

    return next();
  };
}
