import { z } from "zod";

export const stockIdSchema = z.number().int().positive();
export const stockProdutoIdSchema = z.number().int().positive();
export const stockQuantidadeSchema = z.number().int().nonnegative();