import { StockRepository } from "../repositories/StockRepository";
import type { StockDetalhado } from "../repositories/StockRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { AppError } from "../errors/AppError";
import {stockIdSchema, stockProdutoIdSchema, stockQuantidadeSchema } from "../schemas/stockSchemas";

export class StockService {
    private repository = new StockRepository();
    private produtos = new ProductRepository();

    private validarId(id: number): number {
        const resultado = stockIdSchema.safeParse(id);
        if (!resultado.success) throw new AppError("ID do estoque inválido", 400);
        return resultado.data;
    }

    private validarQuantidade(quantidade: number): number {
        const resultado = stockQuantidadeSchema.safeParse(quantidade);
        if (!resultado.success) {
            throw new AppError("Quantidade deve ser um inteiro maior ou igual a zero", 400);
        }
        return resultado.data;
    }

    async findAll(): Promise<StockDetalhado[]> {
        return this.repository.findAll();
    }

    async findById(id: number): Promise<StockDetalhado> {
        const estoque = await this.repository.findById(this.validarId(id));
        if (!estoque) throw new AppError("Registro de estoque não encontrado", 404);
        return estoque;
    }

    async create(id_produto: number, quantidade: number): Promise<number> {
        const produtoId = stockProdutoIdSchema.safeParse(id_produto);
        if (!produtoId.success) throw new AppError("ID do produto inválido", 400);
        const quantidadeValida = this.validarQuantidade(quantidade);

        const produto = await this.produtos.findById(produtoId.data);
        if (!produto) throw new AppError("Produto não encontrado", 404);

        if (await this.repository.findByProductId(produtoId.data)) {
            throw new AppError("Este produto já possui registro de estoque", 409);
        }

        try {
            return await this.repository.create(produtoId.data, quantidadeValida);
        } catch (error) {
            if (typeof error === "object" && error !== null && "code" in error) {
                if (error.code === "ER_DUP_ENTRY") {
                    throw new AppError("Este produto já possui registro de estoque", 409);
                }
                if (error.code === "ER_NO_REFERENCED_ROW_2") {
                    throw new AppError("Produto não encontrado", 404);
                }
            }
            throw error;
        }
    }

    async update(id: number, quantidade: number): Promise<boolean> {
        const idValido = this.validarId(id);
        const quantidadeValida = this.validarQuantidade(quantidade);
        await this.findById(idValido);
        return this.repository.update(idValido, quantidadeValida);
    }

    async delete(id: number): Promise<boolean> {
        const idValido = this.validarId(id);
        await this.findById(idValido);
        return this.repository.delete(idValido);
    }
}
