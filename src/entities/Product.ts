import { productIdSchema, productNomeSchema, productPrecoSchema, productCategoriaSchema, productIngredientesSchema, productPopularSchema } from "../schemas/productSchemas";

export class Product {
    private _id: number;
    private _nome: string = "";
    private _preco: number = 0;
    private _popular: boolean;
    private _ingredientes: string;
    private _categoria: string;

    get id(): number {
        return this._id;
    }

    get preco(): number {
        return this._preco;
    }

    set preco(valor: number) {
        this._preco = productPrecoSchema.parse(valor)
    }

    get nome(): string {
        return this._nome;
    }

    set nome(valor: string) {
        this._nome = productNomeSchema.parse(valor)
    }

    get popular(): boolean {
        return this._popular;
    }

    get ingredientes(): string {
        return this._ingredientes;
    }

    get categoria(): string {
        return this._categoria;
    }

    constructor(id: number, nome: string, preco: number, popular: boolean, ingredientes: string, categoria: string) {
        this._id = productIdSchema.parse(id);
        this.nome = nome;
        this.preco = preco;
        this._popular = productPopularSchema.parse(popular);
        this._ingredientes = productIngredientesSchema.parse(ingredientes);
        this._categoria = productCategoriaSchema.parse(categoria);
    }

    toJSON() {
        return {
           id: this.id,
           nome: this.nome,
           preco: this.preco,
           popular: this.popular,
           ingredientes: this.ingredientes,
           categoria: this.categoria
        };
    }

}