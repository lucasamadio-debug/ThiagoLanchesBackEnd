import { z } from "zod";

export const productIdSchema = z.number().int().positive();
export const productNomeSchema = z.string().trim().min(1, "Nome inválido");
export const productPrecoSchema = z.number().nonnegative();
export const productPopularSchema = z.boolean();
export const productIngredientesSchema = z.string();
export const productCategoriaSchema = z.string().trim().min(1);