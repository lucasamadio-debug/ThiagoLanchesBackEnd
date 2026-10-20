import { User } from "../entities/User" 
import pool from "../config/database"
import type { RowDataPacket } from "mysql2";
import type { ResultSetHeader } from "mysql2";

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

    async findByEmail(email: string): Promise<User | null> {
        const sql = "select * from usuarios where email = ?";
        const [rows] = await pool.execute<UserRow[]>(sql, [email])

        if (rows.length === 0) {
            return null;
        }

        const user = new User(
            rows[0].id_usuario,
            rows[0].nome,
            rows[0].email,
            rows[0].cpf,
            rows[0].senha,
            rows[0].role,
        )

        return user;
    }

    async findByCpf(cpf: string): Promise<User | null> {
        const sql = "select * from usuarios where cpf = ?";
        const [rows] = await pool.execute<UserRow[]>(sql, [cpf])

        if (rows.length === 0) {
            return null;
        }

        const user = new User(
            rows[0].id_usuario,
            rows[0].nome,
            rows[0].email,
            rows[0].cpf,
            rows[0].senha,
            rows[0].role,
        )

        return user;
    }

    async create(nome: string, email: string, cpf: string, senhaHash: string): Promise<number> {
        const sql = "insert into usuarios (nome, email, cpf, senha) values (?, ?, ?, ?)";
        const [result] = await pool.execute<ResultSetHeader>(sql, [nome, email, cpf, senhaHash]);

        return result.insertId;
    }
}

