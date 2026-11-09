
import type { RowDataPacket } from "mysql2";
import pool from "../config/database";
import { Product } from "../entities/Product";
import { Ingredient } from "../entities/Ingredient";
import { Category } from "../entities/Category";
import { Stock } from "../entities/Stock";

export type RecursoAdmin =
    "produtos" | "ingredientes" | "categorias" | "estoque";

export interface ResultadoPaginado<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

interface CountRow extends RowDataPacket {
    total: number;
}

interface ProductRow extends RowDataPacket {
    id: number;
    nome: string;
    preco: number;
    popular: number;
    ingredientes: string | null;
    categoria: string;
}

interface IngredientRow extends RowDataPacket {
    id_ingredientes: number;
    nome_ingrediente: string;
}

interface CategoryRow extends RowDataPacket {
    id_categoria: number;
    nome_categoria: string;
}

interface StockRow extends RowDataPacket {
    id_estoque: number;
    id_produto: number;
    quantidade: number;
    produto: string;
    categoria: string;
}

export class AdminPaginationRepository {
    private async consultar<L extends RowDataPacket, T>(sql: string, sqlCount: string, page: number, limit: number, mapear: (linha: L) => T): Promise<ResultadoPaginado<T>> {
        const offset = (page - 1) * limit;

        const [[rows], [counts]] = await Promise.all([pool.query<L[]>(`${sql} limit ? offset ?`, [limit, offset]), pool.query<CountRow[]>(sqlCount)]);

        const total = Number(counts[0]?.total ?? 0);

        return {
            data: rows.map(mapear),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    produtos(page: number, limit: number) {
        return this.consultar<ProductRow, Product>(
            `select p.id_produto as id, p.nome_lanches as nome, p.preco, p.popular, p.ingredientes, c.nome_categoria as categoria from produto p
             join categoria c on c.id_categoria = p.id_categoria order BY p.id_produto`,
            `select count(*) as total from produto p join categoria c on c.id_categoria = p.id_categoria`,
            page,
            limit,
            row => new Product(row.id, row.nome, row.preco, row.popular === 1, row.ingredientes ?? "", row.categoria)
        );
    }

    ingredientes(page: number, limit: number) {
        return this.consultar<IngredientRow, Ingredient>(
            `select id_ingredientes, nome_ingrediente from ingredientes order by id_ingredientes`,
            `select count(*) as total FROM ingredientes`,
            page,
            limit,
            row => new Ingredient(row.id_ingredientes, row.nome_ingrediente)
        );
    }

    categorias(page: number, limit: number) {
        return this.consultar<CategoryRow, Category>(
            `select id_categoria, nome_categoria from categoria order by id_categoria`,
            `select count(*) as total FROM categoria`,
            page,
            limit,
            row => new Category(row.id_categoria, row.nome_categoria)
        );
    }

    estoque(page: number, limit: number) {
        return this.consultar<StockRow, {
            id: number;
            id_estoque: number;
            id_produto: number;
            quantidade: number;
            produto: string;
            categoria: string;
        }>(
            `select e.id_estoque, e.id_produto, e.quantidade, p.nome_lanches AS produto, c.nome_categoria AS categoria from estoque e
             join produto p on p.id_produto = e.id_produto join categoria c on c.id_categoria = p.id_categoria order by e.id_estoque`,
            `select count(*) as total from estoque e join produto p on p.id_produto = e.id_produto join categoria c on c.id_categoria = p.id_categoria`,
            page,
            limit,
            row => {
                const item = new Stock(row.id_estoque, row.id_produto, row.quantidade);

                return {
                    id: row.id_estoque,
                    id_estoque: row.id_estoque,
                    id_produto: item.id_produto,
                    quantidade: item.quantidade,
                    produto: row.produto,
                    categoria: row.categoria
                };
            }
        );
    }

    listar(recurso: RecursoAdmin, page: number, limit: number) {
        switch (recurso) {
            case "produtos":
                return this.produtos(page, limit);
            case "ingredientes":
                return this.ingredientes(page, limit);
            case "categorias":
                return this.categorias(page, limit);
            case "estoque":
                return this.estoque(page, limit);
        }
    }
}
