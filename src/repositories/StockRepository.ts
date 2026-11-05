import pool from "../config/database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { Stock } from "../entities/Stock";

interface StockRow extends RowDataPacket {
    id_estoque: number;
    id_produto: number;
    produto: string;
    categoria: string;
    quantidade: number;
}

interface IdRow extends RowDataPacket {
    id_estoque: number;
}

export interface StockDetalhado {
    id: number;
    id_estoque: number;
    id_produto: number;
    produto: string;
    categoria: string;
    quantidade: number;
}

export class StockRepository {
    private readonly selectSql = `
        SELECT e.id_estoque, e.id_produto,
               p.nome_lanches AS produto,
               c.nome_categoria AS categoria,
               e.quantidade
        FROM estoque AS e
        INNER JOIN produto AS p ON p.id_produto = e.id_produto
        INNER JOIN categoria AS c ON c.id_categoria = p.id_categoria
    `;

    private mapear(row: StockRow): StockDetalhado {
        const estoque = new Stock(row.id_estoque, row.id_produto, row.quantidade);
        return {
            id: row.id_estoque, // Compatibilidade com a tabela do Frontend
            id_estoque: row.id_estoque,
            id_produto: estoque.id_produto,
            quantidade: estoque.quantidade,
            produto: row.produto,
            categoria: row.categoria
        };
    }

    async findAll(): Promise<StockDetalhado[]> {
        const [rows] = await pool.query<StockRow[]>(
            this.selectSql + " ORDER BY e.id_estoque"
        );
        return rows.map(row => this.mapear(row));
    }

    async findById(id: number): Promise<StockDetalhado | null> {
        const [rows] = await pool.execute<StockRow[]>(
            this.selectSql + " WHERE e.id_estoque = ?", [id]
        );
        return rows.length ? this.mapear(rows[0]) : null;
    }

    async findByProductId(idProduto: number): Promise<boolean> {
        const [rows] = await pool.execute<IdRow[]>(
            "SELECT id_estoque FROM estoque WHERE id_produto = ? LIMIT 1",
            [idProduto]
        );
        return rows.length > 0;
    }

    async create(idProduto: number, quantidade: number): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            "INSERT INTO estoque (id_produto, quantidade) VALUES (?, ?)",
            [idProduto, quantidade]
        );
        return result.insertId;
    }

    async update(id: number, quantidade: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>(
            "UPDATE estoque SET quantidade = ? WHERE id_estoque = ?",
            [quantidade, id]
        );
        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>(
            "DELETE FROM estoque WHERE id_estoque = ?", [id]
        );
        return result.affectedRows > 0;
    }
}
