
import { RowDataPacket, ResultSetHeader } from "mysql2";
import pool from "../config/database";
import { Category } from "../entities/Category";

interface CategoryRow extends RowDataPacket {
    id_categoria: number;
    nome_categoria: string;
}

interface CountRow extends RowDataPacket {
    total: number;
}

export class CategoryRepository {
    async findAll(): Promise<Category[]> {
        const [rows] = await pool.query<CategoryRow[]>(
            "select id_categoria, nome_categoria from categoria order by id_categoria"
        );

        return rows.map(
            row => new Category(row.id_categoria, row.nome_categoria)
        );
    }

    async findById(id: number): Promise<Category | null> {
        const [rows] = await pool.query<CategoryRow[]>(
            "select id_categoria, nome_categoria from categoria where id_categoria = ?",
            [id]
        );

        if (rows.length === 0) return null;

        return new Category(rows[0].id_categoria, rows[0].nome_categoria);
    }

    async findByName(nome: string): Promise<Category | null> {
        const [rows] = await pool.query<CategoryRow[]>(
            "select id_categoria, nome_categoria from categoria where nome_categoria = ?", [nome]
        );

        if (rows.length === 0) return null;

        return new Category(rows[0].id_categoria, rows[0].nome_categoria);
    }

    async create(nome: string): Promise<number> {
        const [result] = await pool.execute<ResultSetHeader>(
            "insert into categoria (nome_categoria) values (?)",
            [nome]
        );

        return result.insertId;
    }

    async update(id: number, nome: string): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>(
            "update categoria set nome_categoria = ? where id_categoria = ?",
            [nome, id]
        );

        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>(
            "delete from categoria where id_categoria = ?",
            [id]
        );

        return result.affectedRows > 0;
    }

    async isUsedOnProducts(id: number): Promise<boolean> {
        const [rows] = await pool.query<CountRow[]>(
            "select count(*) as total from produto where id_categoria = ?",
            [id]
        );

        return rows[0].total > 0;
    }
}
