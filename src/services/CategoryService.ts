
import { CategoryRepository } from "../repositories/CategoryRepository";
import { Category } from "../entities/Category";
import { AppError } from "../errors/AppError";
import {
    categoryIdSchema,
    categoryNomeSchema
} from "../schemas/categorySchemas";

export class CategoryService {
    private repository = new CategoryRepository();

    private validarId(id: number): number {
        const resultado = categoryIdSchema.safeParse(id);

        if (!resultado.success) {
            throw new AppError("ID inválido", 400);
        }

        return resultado.data;
    }

    private validarNome(nome: string): string {
        const resultado = categoryNomeSchema.safeParse(nome);

        if (!resultado.success) {
            throw new AppError(
                resultado.error.issues[0]?.message ?? "Nome inválido",
                400
            );
        }

        return resultado.data;
    }

    async findAll(): Promise<Category[]> {
        return this.repository.findAll();
    }

    async findById(id: number): Promise<Category> {
        const categoria = await this.repository.findById(
            this.validarId(id)
        );

        if (!categoria) {
            throw new AppError("Categoria não encontrada", 404);
        }

        return categoria;
    }

    async create(nome: string): Promise<number> {
        const nomeValidado = this.validarNome(nome);

        const existente = await this.repository.findByName(nomeValidado);

        if (existente) {
            throw new AppError("Categoria já cadastrada", 409);
        }

        return this.repository.create(nomeValidado);
    }

    async update(id: number, nome: string): Promise<boolean> {
        const idValidado = this.validarId(id);
        const nomeValidado = this.validarNome(nome);

        await this.findById(idValidado);

        const existente = await this.repository.findByName(nomeValidado);

        if (existente && existente.id_categoria !== idValidado) {
            throw new AppError("Categoria já cadastrada", 409);
        }

        return this.repository.update(idValidado, nomeValidado);
    }

    async delete(id: number): Promise<boolean> {
        const idValidado = this.validarId(id);

        await this.findById(idValidado);

        const emUso = await this.repository.isUsedOnProducts(idValidado);

        if (emUso) {
            throw new AppError(
                "Não é possível excluir uma categoria vinculada a produtos",
                409
            );
        }

        try {
            return await this.repository.delete(idValidado);
        } catch (error) {
            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                error.code === "ER_ROW_IS_REFERENCED_2"
            ) {
                throw new AppError(
                    "Categoria vinculada a produtos",
                    409
                );
            }

            throw error;
        }
    }
}
