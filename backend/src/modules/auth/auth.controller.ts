import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../db/prisma.js";
import { HttpError } from "../../utils/http-error.js";
import { signAccessToken } from "../../utils/jwt.js";

function publicUser(user: { id: string; name: string; email: string; role: string; createdAt: Date }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new HttpError(409, "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, passwordHash }
  });

  const token = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  return res.status(201).json({ user: publicUser(user), token });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  return res.json({ user: publicUser(user), token });
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return res.json({ user });
}
