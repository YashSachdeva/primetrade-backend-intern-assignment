import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(1000),
  price: z.coerce.number().positive().max(999999),
  stock: z.coerce.number().int().min(0).max(100000),
  isActive: z.boolean().optional()
});

export const productUpdateSchema = productCreateSchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required"
});
