import { z } from "zod";

export const categoryIdSchema = z.number().int().positive();

export const categoryNomeSchema = z.string().trim().min(1, "Nome da categoria não pode estar vazio").max(100, "Nome da categoria deve ter no máximo 100 caracteres");
