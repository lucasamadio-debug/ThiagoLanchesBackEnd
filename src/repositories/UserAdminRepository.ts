import pool from "../config/database";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface UsuarioPublico {
    id: number; // Mantém compatibilidade com a listagem do Frontend
    id_usuario: number;
    nome: string;
    email: string;
    cpf: string | null;
    role: "ADMIN" | "USER";
}

interface UsuarioRow extends RowDataPacket {
    id_usuario: number;
    nome: string;
    email: string;
    cpf: string | null;
    role: "ADMIN" | "USER";
}

export class UserAdminRepository {
    private mapear(row: UsuarioRow): UsuarioPublico {
        return { id: row.id_usuario, ...row };
    }

    async findAll(): Promise<UsuarioPublico[]> {
        const [rows] = await pool.query<UsuarioRow[]>(
            "SELECT id_usuario, nome, email, cpf, role FROM usuarios ORDER BY id_usuario"
        );
        return rows.map(row => this.mapear(row));
    }

    async findById(id: number): Promise<UsuarioPublico | null> {
        const [rows] = await pool.execute<UsuarioRow[]>(
            "SELECT id_usuario, nome, email, cpf, role FROM usuarios WHERE id_usuario = ?",
            [id]
        );
        return rows.length ? this.mapear(rows[0]) : null;
    }

    async findByCpf(cpf: string): Promise<UsuarioPublico | null> {
        const [rows] = await pool.execute<UsuarioRow[]>(
            "SELECT id_usuario, nome, email, cpf, role FROM usuarios WHERE cpf = ?",
            [cpf]
        );
        return rows.length ? this.mapear(rows[0]) : null;
    }

    async update(id: number, nome: string, cpf: string, senhaHash?: string): Promise<boolean> {
        let sql = "UPDATE usuarios SET nome = ?, cpf = ? WHERE id_usuario = ?";
        let params: Array<string | number> = [nome, cpf, id];
        if (senhaHash !== undefined) {
            sql = "UPDATE usuarios SET nome = ?, cpf = ?, senha = ? WHERE id_usuario = ?";
            params = [nome, cpf, senhaHash, id];
        }
        const [result] = await pool.execute<ResultSetHeader>(sql, params);
        return result.affectedRows > 0;
    }

    async delete(id: number): Promise<boolean> {
        const [result] = await pool.execute<ResultSetHeader>(
            "DELETE FROM usuarios WHERE id_usuario = ?", [id]
        );
        return result.affectedRows > 0;
    }
}
