import type { Request, Response } from "express";
import { prisma } from "../../db/prisma.js";
import { HttpError } from "../../utils/http-error.js";

export async function listProducts(_req: Request, res: Response) {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });

  return res.json({ products });
}

export async function getProduct(req: Request, res: Response) {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) {
    throw new HttpError(404, "Product not found");
  }

  return res.json({ product });
}

export async function createProduct(req: Request, res: Response) {
  const product = await prisma.product.create({ data: req.body });
  return res.status(201).json({ product });
}

export async function updateProduct(req: Request, res: Response) {
  const existingProduct = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existingProduct) {
    throw new HttpError(404, "Product not found");
  }

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body
  });

  return res.json({ product });
}

export async function deleteProduct(req: Request, res: Response) {
  const existingProduct = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!existingProduct) {
    throw new HttpError(404, "Product not found");
  }

  await prisma.product.delete({ where: { id: req.params.id } });
  return res.status(204).send();
}
