import { ingredientIdSchema } from "../schemas/ingredientSchemas";
import { Serializavel } from "../interfaces/Serializavel";
import { EntidadeNomeada } from "./EntidadeNomeada";

export class Ingredient extends EntidadeNomeada implements Serializavel {
    private _id_ingredientes: number | null;

    get id_ingredientes(): number | null {
        return this._id_ingredientes;
    }

    get nome_ingrediente(): string {
        return this.nome;
    }

    set nome_ingrediente(nome: string) {
        this.nome = nome
    }

    constructor(id_ingredientes: number | null, nome_ingrediente: string) {
        super(nome_ingrediente)
        this._id_ingredientes = id_ingredientes === null ? null : ingredientIdSchema.parse(id_ingredientes);
    }

    toJSON() {
        return {
            id_ingredientes: this.id_ingredientes,
            nome_ingrediente: this.nome_ingrediente
        };
    }
}