
import { categoryIdSchema, categoryNomeSchema } from "../schemas/categorySchemas";

export class Category {
    private _id_categoria: number | null;
    private _nome_categoria: string = "";

    constructor(id_categoria: number | null, nome_categoria: string) {
        this._id_categoria = id_categoria === null ? null : categoryIdSchema.parse(id_categoria);
        this.nome_categoria = nome_categoria;
    }

    get id_categoria(): number | null {
        return this._id_categoria;
    }

    get nome_categoria(): string {
        return this._nome_categoria;
    }

    set nome_categoria(nome: string) {
        this._nome_categoria = categoryNomeSchema.parse(nome);
    }

    toJSON() {
        return {
            id_categoria: this.id_categoria,
            nome_categoria: this.nome_categoria
        };
    }
}
