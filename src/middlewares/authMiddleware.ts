import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import pool from "../config/database";
import type { RowDataPacket } from "mysql2";

interface AdminRow extends RowDataPacket {
    id_usuario: number;
    role: "ADMIN" | "USER";
}

interface AuthPayload extends JwtPayload {
    id: number;
    role: "ADMIN" | "USER";
}

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authorization = req.headers.authorization;

        if (!authorization?.startsWith("Bearer ")) {
            res.status(401).json({ message: "Token não fornecido" });
            return;
        }

        const token = authorization.slice(7);
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            res.status(500).json({ message: "Erro de configuração" });
            return;
        }

        const decoded = jwt.verify(token, secret);

        if (
            typeof decoded === "string" ||
            typeof decoded.id !== "number" ||
            !Number.isSafeInteger(decoded.id)
        ) {
            res.status(401).json({ message: "Token inválido" });
            return;
        }

        const payload = decoded as AuthPayload;

        const [rows] = await pool.execute<AdminRow[]>(
            "SELECT id_usuario, role FROM usuarios WHERE id_usuario = ?",
            [payload.id]
        );

        if (rows.length === 0) {
            res.status(401).json({ message: "Usuário não encontrado" });
            return;
        }

        if (rows[0].role !== "ADMIN") {
            res.status(403).json({ message: "Acesso administrativo negado" });
            return;
        }

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: "Token inválido ou expirado" });
            return;
        }

        console.error("Erro na autenticação:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
}