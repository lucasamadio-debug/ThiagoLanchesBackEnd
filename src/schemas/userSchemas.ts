import { z } from "zod";
import { validarCPF } from "../utils/validarCPF";

export const userIdSchema = z.number().int().positive();
export const userNomeSchema = z.string().trim().min(1, "Nome inválido");
export const userEmailSchema = z.email();
export const userCpfSchema = z.string().refine((cpf) => validarCPF(cpf), {message: "CPF inválido"}).nullable()
export const userRoleSchema = z.enum(["ADMIN", "USER"]);

export const userSenhaCadastroSchema = z.string().min(8, "A senha não pode ter menos de 8 caracteres").regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula").regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula").regex(/[0-9]/, "A senha deve conter pelo menos um número").regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial");

export const userCadastroSchema = z.object({nome: userNomeSchema, email: z.string().trim().toLowerCase().pipe(userEmailSchema), cpf: z.string().transform(cpf => cpf.replace(/\D/g, "")).pipe(z.string().length(11, "O CPF deve conter 11 dígitos")).pipe(userCpfSchema.unwrap()), senha: userSenhaCadastroSchema});
