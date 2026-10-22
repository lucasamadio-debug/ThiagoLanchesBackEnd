import { z } from "zod"

export abstract class EntidadeNomeada {
    protected _nome: string = "";

    constructor(nome: string) {
        this.nome = nome
    }

    get nome(): string {
        return this._nome
    }

    set nome(nome: string) {
        this._nome = z.string().trim().min(1, "O nome não pode estar vazio").max(100, "O nome não pode exceder 100 caracteres").parse(nome)
    }
}