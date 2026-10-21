import { z } from "zod";
import { validarCPF } from "../utils/validarCPF";

export const userIdSchema = z.number().int().positive();
export const userNomeSchema = z.string().trim().min(1, "Nome inválido");
export const userEmailSchema = z.email();
export const userCpfSchema = z.string().refine((cpf) => validarCPF(cpf), {message: "CPF inválido"}).nullable()
export const userRoleSchema = z.enum(["ADMIN", "USER"]);