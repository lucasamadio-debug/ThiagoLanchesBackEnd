import { categoryIdSchema, categoryNomeSchema } from "../schemas/categorySchemas";
import { Serializavel } from "../interfaces/Serializavel";
import { EntidadeNomeada } from "./EntidadeNomeada";

export class Category extends EntidadeNomeada implements Serializavel {
    private _id_categoria: number | null;

    constructor(id_categoria: number | null, nome_categoria: string) {
        super(nome_categoria)
        this._id_categoria = id_categoria === null ? null : categoryIdSchema.parse(id_categoria);
    }

    get id_categoria(): number | null {
        return this._id_categoria;
    }

    get nome_categoria(): string {
        return this.nome;
    }

    set nome_categoria(nome: string) {
        this.nome = nome;
    }

    toJSON() {
        return {
            id_categoria: this.id_categoria,
            nome_categoria: this.nome_categoria
        };
    }
}
