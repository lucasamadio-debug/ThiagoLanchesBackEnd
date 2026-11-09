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
        select e.id_estoque, e.id_produto, p.nome_lanches as produto, c.nome_categoria as categoria, e.quantidade from estoque as e inner join produto as p on p.id_produto = e.id_produto inner join categoria as c on c.id_categoria = p.id_categoria`;

    private mapear(row: StockRow): StockDetalhado {
        const estoque = new Stock(row.id_estoque, row.id_produto, row.quantidade);
        return {
            id: row.id_estoque,
            id_estoque: row.id_estoque,
            id_produto: estoque.id_produto,
            quantidade: estoque.quantidade,
            produto: row.produto,
            categoria: row.categoria
        };
    }

    async findAll(): Promise<StockDetalhado[]> {
        const [rows] = await pool.query<StockRow[]>(this.selectSql + " order by e.id_estoque");
        return rows.map(row => this.mapear(row));
    }

    async findById(id: number): Promise<StockDetalhado | null> {
        const [rows] = await pool.execute<StockRow[]>(this.selectSql + " where e.id_estoque = ?", [id]);
        return rows.length ? this.mapear(rows[0]) : null;
    }

    async findByProductId(idProduto: number): Promise<boolean> {
        const [rows] = await pool.execute<IdRow[]>("select id_estoque from estoque where id_produto = ? limit 1", [idProduto]);
        return rows.length > 0;
    }

    async create(idProduto: number, quantidade: number): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>("insert into estoque (id_produto, quantidade) values (?, ?)", [idProduto, quantidade]);
        return result.insertId;
    }

    async update(id: number, quantidade: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>("update estoque set quantidade = ? where id_estoque = ?", [quantidade, id]);
        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>("delete from estoque where id_estoque = ?", [id]);
        return result.affectedRows > 0;
    }
}
