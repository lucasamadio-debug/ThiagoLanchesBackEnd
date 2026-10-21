import { z } from "zod";

export const ingredientIdSchema = z.number().int().positive();
export const ingredientNomeSchema = z.string().trim().min(1, "Nome do ingrediente não pode estar vazio").max(100, "Nome do ingrediente deve ter no máximo 100 caracteres");