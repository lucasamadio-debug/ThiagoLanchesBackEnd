export class Product {
    id: number;
    nome: string;
    preco: number;
    popular: boolean;
    ingredientes: string;
    categoria: string;

    constructor(id: number, nome: string, preco: number, popular: boolean, ingredientes: string, categoria: string) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.popular = popular;
        this.ingredientes = ingredientes;
        this.categoria = categoria;
    }

}