
import { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService";
import { AppError } from "../errors/AppError";

export class CategoryController {
    private service = new CategoryService();

    private responderErro(res: Response, error: unknown): void {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                message: error.message
            });
        } else {
            console.error("Erro no CRUD de categorias:", error);
            res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    findAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const categorias = await this.service.findAll();
            res.status(200).json(categorias);
        } catch (error) {
            this.responderErro(res, error);
        }
    };

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            const categoria = await this.service.findById(
                Number(req.params.id)
            );
            res.status(200).json(categoria);
        } catch (error) {
            this.responderErro(res, error);
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = await this.service.create(
                req.body?.nome_categoria
            );
            res.status(201).json({ id_categoria: id });
        } catch (error) {
            this.responderErro(res, error);
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.service.update(
                Number(req.params.id),
                req.body?.nome_categoria
            );

            res.status(200).json({
                message: "Categoria atualizada com sucesso"
            });
        } catch (error) {
            this.responderErro(res, error);
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.service.delete(Number(req.params.id));

            res.status(200).json({
                message: "Categoria excluída com sucesso"
            });
        } catch (error) {
            this.responderErro(res, error);
        }
    };
}
