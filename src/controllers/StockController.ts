import type { Request, Response } from "express";
import { StockService } from "../services/StockService";
import { AppError } from "../errors/AppError";

export class StockController {
    private service = new StockService();

    private responderErro(res: Response, error: unknown): void {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            console.error("Erro no CRUD de estoque:", error);
            res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    findAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json(await this.service.findAll());
        } catch (error) { this.responderErro(res, error); }
    };

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            res.status(200).json(await this.service.findById(Number(req.params.id)));
        } catch (error) { this.responderErro(res, error); }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = await this.service.create(req.body?.id_produto, req.body?.quantidade);
            res.status(201).json({ id_estoque: id });
        } catch (error) { this.responderErro(res, error); }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.service.update(Number(req.params.id), req.body?.quantidade);
            res.status(200).json({ message: "Estoque atualizado com sucesso" });
        } catch (error) { this.responderErro(res, error); }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.service.delete(Number(req.params.id));
            res.status(200).json({ message: "Registro de estoque excluído com sucesso" });
        } catch (error) { this.responderErro(res, error); }
    };
}
