import { IngredientRepository } from "../repositories/IngredientRepository";
import { AppError} from "../errors/AppError";
import { Ingredient } from "../entities/Ingredient";
import { ingredientIdSchema, ingredientNomeSchema } from "../schemas/ingredientSchemas";

export class IngredientService {
    private ingredientRepository = new IngredientRepository();

    async findAll(): Promise<Ingredient[]> {
        return this.ingredientRepository.findAll();
    }

    async findById(id_ingrediente: number): Promise<Ingredient> {
        const resultado = ingredientIdSchema.safeParse(id_ingrediente)

        if (!resultado.success) {
            throw new AppError(resultado.error.issues[0]?.message ?? "ID Inválido", 400);
        }

        const ingrediente = await this.ingredientRepository.findById(resultado.data);

        if (ingrediente === null) {
            throw new AppError("Ingrediente não encontrado", 404);
        }

        return ingrediente;
    }

    async findByName(nome_ingrediente: string): Promise<Ingredient> {
        const resultado = ingredientNomeSchema.safeParse(nome_ingrediente)

        if (!resultado.success) {
            throw new AppError(resultado.error.issues[0]?.message ?? "Nome inválido", 400);
        }

        const ingrediente = await this.ingredientRepository.findByName(resultado.data);

        if (ingrediente === null) {
            throw new AppError("Ingrediente não encontrado", 404);
        }

        return ingrediente;
    }

    async create(nome_ingrediente: string): Promise<number> {
        const resultado = ingredientNomeSchema.safeParse(nome_ingrediente)

        if (!resultado.success) {
            throw new AppError(resultado.error.issues[0]?.message ?? "Nome inválido", 400);
        }

        const ingrediente = await this.ingredientRepository.findByName(resultado.data);

        if (ingrediente !== null) {
            throw new AppError("Este ingrediente já está cadastrado", 409);
        }

        const criado = await this.ingredientRepository.create(resultado.data)

        return criado;
    }

    async update(id_ingrediente: number, nome_ingrediente: string): Promise<boolean> {
        const resultadoid = ingredientIdSchema.safeParse(id_ingrediente)
        const resultadonome = ingredientNomeSchema.safeParse(nome_ingrediente)

        if (!resultadoid.success) {
            throw new AppError(resultadoid.error.issues[0]?.message ?? "ID inválido", 400);
        }

        if (!resultadonome.success) {
            throw new AppError(resultadonome.error.issues[0]?.message ?? "Nome inválido", 400);
        }

        const ingrediente = await this.ingredientRepository.findById(resultadoid.data);

        if (ingrediente === null) {
            throw new AppError("Ingrediente não encontrado", 404);
        }

        const existente = await this.ingredientRepository.findByName(resultadonome.data);

        if (existente != null && existente.id_ingredientes !== resultadoid.data) {
            throw new AppError("Este ingrediente já está cadastrado", 409);
        }

        const atualizado = await this.ingredientRepository.update(resultadoid.data, resultadonome.data);

        return atualizado;
        
    }

    async delete(id_ingrediente: number): Promise<boolean> {
        const resultadoid = ingredientIdSchema.safeParse(id_ingrediente);

        if (!resultadoid.success) {
            throw new AppError(resultadoid.error.issues[0]?.message ?? "ID inválido", 400);
        }

        const ingrediente = await this.ingredientRepository.findById(resultadoid.data);

        if (ingrediente === null) {
            throw new AppError("Ingrediente não encontrado", 404);
        }

        const emUso = await this.ingredientRepository.isUsedOnProducts(resultadoid.data);

        if (emUso) {
            throw new AppError("Não é possível excluir um ingrediente vinculado a produtos", 409);
        }

        const deleta = await this.ingredientRepository.delete(resultadoid.data);
        
        return deleta;
    }
}