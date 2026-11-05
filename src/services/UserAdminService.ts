import bcrypt from "bcrypt";
import { z } from "zod";
import { AppError } from "../errors/AppError";
import { UserAdminRepository } from "../repositories/UserAdminRepository";
import type { UsuarioPublico } from "../repositories/UserAdminRepository";
import {
    userIdSchema,
    userNomeSchema,
    userCpfSchema,
    userSenhaCadastroSchema
} from "../schemas/userSchemas";

const editarSchema = z.object({
    nome: userNomeSchema,
    cpf: z.string()
        .transform(valor => valor.replace(/\D/g, ""))
        .pipe(z.string().length(11, "CPF deve conter 11 dígitos"))
        .pipe(userCpfSchema.unwrap()),
    senha: z.union([userSenhaCadastroSchema, z.literal("")]).optional()
});

export class UserAdminService {
    private repository = new UserAdminRepository();

    private validarId(id: number): number {
        const resultado = userIdSchema.safeParse(id);
        if (!resultado.success) throw new AppError("ID de usuário inválido", 400);
        return resultado.data;
    }

    async findAll(): Promise<UsuarioPublico[]> {
        return this.repository.findAll();
    }

    async findById(id: number): Promise<UsuarioPublico> {
        const usuario = await this.repository.findById(this.validarId(id));
        if (!usuario) throw new AppError("Usuário não encontrado", 404);
        return usuario;
    }

    async update(id: number, body: unknown): Promise<UsuarioPublico> {
        const idValido = this.validarId(id);
        const resultado = editarSchema.safeParse(body);
        if (!resultado.success) {
            throw new AppError(resultado.error.issues[0]?.message ?? "Dados inválidos", 400);
        }
        const usuario = await this.findById(idValido);
        const dados = resultado.data;
        const cpfOcupado = await this.repository.findByCpf(dados.cpf);
        if (cpfOcupado && cpfOcupado.id_usuario !== usuario.id_usuario) {
            throw new AppError("CPF já cadastrado", 409);
        }

        const senhaHash = dados.senha ? await bcrypt.hash(dados.senha, 12) : undefined;
        try {
            const atualizado = await this.repository.update(
                idValido, dados.nome, dados.cpf, senhaHash
            );
            if (!atualizado) throw new AppError("Usuário não encontrado", 404);
        } catch (error) {
            if (typeof error === "object" && error !== null && "code" in error &&
                error.code === "ER_DUP_ENTRY") {
                throw new AppError("CPF já cadastrado", 409);
            }
            throw error;
        }
        return this.findById(idValido);
    }

    async delete(id: number, administradorId: number): Promise<boolean> {
        const idValido = this.validarId(id);
        const admValido = this.validarId(administradorId);
        if (idValido === admValido) {
            throw new AppError("Você não pode excluir a própria conta", 403);
        }
        await this.findById(idValido);
        try {
            return await this.repository.delete(idValido);
        } catch (error) {
            if (typeof error === "object" && error !== null && "code" in error &&
                error.code === "ER_ROW_IS_REFERENCED_2") {
                throw new AppError("Usuário possui registros vinculados", 409);
            }
            throw error;
        }
    }
}
