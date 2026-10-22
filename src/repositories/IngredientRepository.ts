import { RowDataPacket } from "mysql2";
import type { ResultSetHeader } from "mysql2";
import { Ingredient } from "../entities/Ingredient";
import pool from "../config/database";

interface IngredientRow extends RowDataPacket {
    id_ingrediente: number;
    nome_ingrediente: string;

}

interface CountRow extends RowDataPacket {
    total: number;
}

export class IngredientRepository {
    async findAll(): Promise<Ingredient[]> {
        const sql = "select i.id_ingredientes as id_ingrediente, i.nome_ingrediente as nome_ingrediente from ingredientes as i"
        const [rows] = await pool.query<IngredientRow[]>(sql)
        return rows.map((row) => {
            return new Ingredient(
                row.id_ingrediente,
                row.nome_ingrediente
            )
        })

    }

    async findById(id: number): Promise<Ingredient | null> {
        const sql = "select i.id_ingredientes as id_ingrediente, i.nome_ingrediente as nome_ingrediente from ingredientes as i where id_ingredientes = ?"
        const [rows] = await pool.query<IngredientRow[]>(sql, [id])
        if (rows.length === 0) {
            return null;
        }

        const ingrediente = new Ingredient(
            rows[0].id_ingrediente,
            rows[0].nome_ingrediente
        )

        return ingrediente;
    }
    async findByName(nome: string): Promise<Ingredient | null> {
        const sql = "select i.id_ingredientes as id_ingrediente, i.nome_ingrediente as nome_ingrediente from ingredientes as i where nome_ingrediente = ?"
        const [rows] = await pool.query<IngredientRow[]>(sql, [nome])
        if (rows.length === 0) {
            return null;
        }

        const ingrediente = new Ingredient(
            rows[0].id_ingrediente,
            rows[0].nome_ingrediente
        )

        return ingrediente;
    }

    async create(nome: string): Promise<number> {
        const sql = "insert into ingredientes (nome_ingrediente) values (?)";
        const [result] = await pool.execute<ResultSetHeader>(sql, [nome]);

        return result.insertId;
    }

    async update(id: number, nome: string): Promise<boolean> {
        const sql = "update ingredientes set nome_ingrediente = ? where id_ingredientes = ?";
        const [result] = await pool.execute<ResultSetHeader>(sql, [nome, id]);

        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const sql = "delete from ingredientes where id_ingredientes = ?"
        const [result] = await pool.execute<ResultSetHeader>(sql, [id]);

        return result.affectedRows > 0;
    }

    async isUsedOnProducts(id_ingrediente: number): Promise<boolean> {
        const sql = "select count(*) as total from produto_ingredientes where id_ingredientes = ?;"
        const [rows] = await pool.query<CountRow[]>(sql, [id_ingrediente]);
        return rows[0].total > 0;
    }
}