import { z } from "zod";

export const productIdSchema = z.number().int().positive();
export const productNomeSchema = z.string().trim().min(1, "Nome inválido");
export const productPrecoSchema = z.number().nonnegative();
export const productPopularSchema = z.boolean();
export const productIngredientesSchema = z.string();
export const productCategoriaSchema = z.string().trim().min(1);
export const productCreateSchema = z.object({
    nome: productNomeSchema,
    preco: productPrecoSchema,
    popular: productPopularSchema,
    id_categoria: productIdSchema,
    ingredientes: z.array(z.object({id_ingrediente: productIdSchema, quantidade: z.number().int().positive()})).superRefine((ingredientes, ctx) => {
    const ids = ingredientes.map(i => i.id_ingrediente);

    if (new Set(ids).size !== ids.length) {
        ctx.addIssue({code: "custom", message: "Não é permitido repetir ingredientes"});
    }
    })
});