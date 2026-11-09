import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserAdminService } from "../services/UserAdminService";
import { AppError } from "../errors/AppError";

export class UserAdminController {
    private service = new UserAdminService();

    private idAutenticado(req: Request): number {
        const authorization = req.headers.authorization;
        const secret = process.env.JWT_SECRET;
        if (!authorization?.startsWith("Bearer ") || !secret) {
            throw new AppError("Não autenticado", 401);
        }
        const payload = jwt.verify(authorization.slice(7), secret);
        if (typeof payload === "string" || typeof payload.id !== "number") {
            throw new AppError("Token inválido", 401);
        }
        return payload.id;
    }

    private responderErro(res: Response, error: unknown): void {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error("Erro no gerenciamento de usuários:", error);
            res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    findAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json(await this.service.findAll());
        } catch (error) { this.responderErro(res, error); }
    };

    findMe = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json(await this.service.findById(this.idAutenticado(req)));
        } catch (error) { this.responderErro(res, error); }
    };

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json(await this.service.findById(Number(req.params.id)));
        } catch (error) { this.responderErro(res, error); }
    };

    updateMe = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json(await this.service.update(this.idAutenticado(req), req.body));
        } catch (error) { this.responderErro(res, error); }
    };

    
    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const idAutenticado = this.idAutenticado(req);
            const idSolicitado = Number(req.params.id);

            if (!Number.isSafeInteger(idSolicitado) || idSolicitado <= 0) {
                throw new AppError("ID de usuário inválido", 400);
            }

            if (idSolicitado !== idAutenticado) {
                throw new AppError("Você só pode editar o próprio usuário", 403);
            }

            const atualizado = await this.service.update(idAutenticado, req.body);

            res.status(200).json(atualizado);
        } catch (error) {
            this.responderErro(res, error);
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.service.delete(Number(req.params.id), this.idAutenticado(req));
            res.status(200).json({ message: "Usuário excluído com sucesso" });
        } catch (error) { this.responderErro(res, error); }
    };
}
