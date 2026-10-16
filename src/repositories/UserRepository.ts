import { User } from "../entities/User" 
import pool from "../config/database"
import type { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
    id_usuario: number;
    nome: string;
    email: string;
    cpf: string | null;
    senha: string;
    role: "ADMIN" | "USER";
}

export class UserRepository {
    async findByEmailAndCpf(email: string, cpf: string): Promise<User | null> {
        const sql = "select * from usuarios where email = ? and cpf = ?";
        const [rows] = await pool.execute<UserRow[]>(sql, [email, cpf]);

        if (rows.length === 0) {
            return null;
        }

        const user = new User(rows[0].id_usuario, rows[0].nome, rows[0].email, rows[0].cpf, rows[0].senha, rows[0].role)
            return user
    }
}

