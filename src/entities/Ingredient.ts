import { ingredientIdSchema, ingredientNomeSchema } from "../schemas/ingredientSchemas";

export class Ingredient {
    private _id_ingredientes: number | null;
    private _nome_ingrediente: string = "";

    get id_ingredientes(): number | null {
        return this._id_ingredientes;
    }

    get nome_ingrediente(): string {
        return this._nome_ingrediente;
    }

    set nome_ingrediente(nome: string) {
        this._nome_ingrediente = ingredientNomeSchema.parse(nome);
    }

    constructor(id_ingredientes: number | null, nome_ingrediente: string) {
        this._id_ingredientes = id_ingredientes === null ? null : ingredientIdSchema.parse(id_ingredientes);
        this.nome_ingrediente = nome_ingrediente;
    }

    toJSON() {
        return {
            id_ingredientes: this.id_ingredientes,
            nome_ingrediente: this.nome_ingrediente
        };
    }
}