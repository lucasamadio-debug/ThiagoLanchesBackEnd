import { stockIdSchema, stockProdutoIdSchema, stockQuantidadeSchema } from "../schemas/stockSchemas";
import{ z } from "zod";

export class Stock {
    private _id_estoque: number | null;
    private _id_produto: number;
    private _quantidade: number = 0;

    constructor(id_estoque: number | null, id_produto: number, quantidade: number) {
        this._id_estoque = id_estoque === null ? null : stockIdSchema.parse(id_estoque);
        this._id_produto = stockProdutoIdSchema.parse(id_produto);
        this.quantidade = quantidade;
    }

    get id_estoque(): number | null {
        return this._id_estoque;
    }

    get id_produto(): number {
        return this._id_produto;
    }

    get quantidade(): number {
        return this._quantidade;
    }

    set quantidade(qntd: number) {
        this._quantidade = stockQuantidadeSchema.parse(qntd);
    }

    adicionarQuantidade(valor: number): void {
        const valorValidado = z.number().int().positive().parse(valor);
        this.quantidade += valorValidado;
    }

    retirarQuantidade(valor: number): void {
        const valorValidado = z.number().int().positive().parse(valor);
        if (valorValidado > this.quantidade) {
            throw new Error("Estoque insuficiente");
        }
        this.quantidade -= valorValidado;
    }

    toJSON() {
        return {
            id_estoque: this.id_estoque,
            id_produto: this.id_produto,
            quantidade: this.quantidade
        };
    }
}