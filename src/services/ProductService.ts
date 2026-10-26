import { ProductRepository } from "../repositories/ProductRepository";
import { Product } from "../entities/Product";
import { AppError } from "../errors/AppError";
import { productIdSchema, productCreateSchema } from "../schemas/productSchemas";

export class ProductService {
    private productRepository = new ProductRepository();

    async findAll(): Promise<Product[]> {
        return this.productRepository.findAll();
    }

    async findById(id: number): Promise<Product> {
        const resultado = productIdSchema.safeParse(id)

        if (!resultado.success) {
            throw new AppError(resultado.error.issues[0]?.message ?? "ID Inválido", 400);
        }

        const produto = await this.productRepository.findById(resultado.data);

        if (produto === null) {
            throw new AppError("Produto não encontrado", 404);
        }

        return produto;
    }

    async create(nome: string, preco: number, popular: boolean, id_categoria: number, ingredienteIds: number[]): Promise<number> {
        const resultado = productCreateSchema.safeParse({nome, preco, popular, id_categoria, ingredienteIds});

        if (!resultado.success) {
            throw new AppError(resultado.error.issues[0]?.message ?? "Dados inválidos", 400);
        }

        const dados = resultado.data;

        await this.validarReferencias(dados.id_categoria, dados.ingredienteIds);

        const idCriado = await this.executarGravacao(() => this.productRepository.create(dados.nome, dados.preco, dados.popular, dados.id_categoria, dados.ingredienteIds));

        return idCriado;
    }

    async update(id: number, nome: string, preco: number, popular: boolean, id_categoria: number, ingredienteIds: number[]): Promise<boolean> {
        const resultado = productCreateSchema.safeParse({nome, preco, popular, id_categoria, ingredienteIds});

        if (!resultado.success) {
            throw new AppError(resultado.error.issues[0]?.message ?? "Dados inválidos", 400);
        }

        const dados = resultado.data;

        const resultadoid = productIdSchema.safeParse(id);

        if (!resultadoid.success) {
            throw new AppError("ID inválido", 400); 
        }

        await this.validarReferencias(dados.id_categoria, dados.ingredienteIds);

        const produto = await this.productRepository.findById(resultadoid.data);

        if (produto === null) {
            throw new AppError("Produto não encontrado", 404);
        }

        const atualizado = await this.executarGravacao(() => this.productRepository.update(resultadoid.data, dados.nome, dados.preco, dados.popular, dados.id_categoria, dados.ingredienteIds));

        return atualizado;
    }

    async delete(id: number): Promise<boolean> {
        const resultadoid = productIdSchema.safeParse(id);
        
                if (!resultadoid.success) {
                    throw new AppError(resultadoid.error.issues[0]?.message ?? "ID inválido", 400);
                }
        
                const produto = await this.productRepository.findById(resultadoid.data);
        
                if (produto === null) {
                    throw new AppError("Produto não encontrado", 404);
                }

                const emEstoque = await this.productRepository.isUsedInStock(resultadoid.data);

                if (emEstoque) {
                    throw new AppError("Não é possível excluir um produto vinculado ao estoque", 409);
                }
                        
                const deleta = await this.productRepository.delete(resultadoid.data);
                
                return deleta;
    }

    
    private async validarReferencias(id_categoria: number,ingredienteIds: number[]): Promise<void> {
        const categoriaExiste = await this.productRepository.categoryExists(id_categoria);

        if (!categoriaExiste) {
            throw new AppError("Categoria não encontrada", 400);
        }

        const ingredientesExistem = await this.productRepository.ingredientsExist(ingredienteIds);

        if (!ingredientesExistem) {
            throw new AppError("Um ou mais ingredientes não existem", 400);
        }
    }

    
    private async executarGravacao<T>(operacao: () => Promise<T>): Promise<T> {
        try {
            return await operacao();
        } catch (error) {
            if (error instanceof Error &&error.message === "Um ou mais ingredientes não existem") {
                throw new AppError(error.message, 400);
            }

            if (typeof error === "object" && error !== null && "code" in error &&error.code === "ER_NO_REFERENCED_ROW_2") {
                throw new AppError("Categoria ou ingrediente inexistente", 400);
            }

            throw error;
        }
    }


}
