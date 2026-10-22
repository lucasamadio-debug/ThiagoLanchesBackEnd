import { Request, Response } from "express";
import { IngredientService } from "../services/IngredientService";
import { AppError } from "../errors/AppError";

export class IngredientController {
    private ingredientService = new IngredientService();

    findAll = async(req: Request, res: Response): Promise<void> => {
        try {
            const ingredients = await this.ingredientService.findAll();
            res.status(200).json(ingredients);
        } catch (error) {
            console.error("Erro ao buscar os ingredientes:", error);

            res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    findById = async(req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const ingrediente = await this.ingredientService.findById(id);
            res.status(200).json(ingrediente);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({message: error.message});
            } else {
                res.status(500).json({message: "Erro interno do servidor"});
            }
        }
    }

    create = async(req: Request, res: Response): Promise<void> => {
        try {
            const nome = req.body.nome_ingrediente
            const criado = await this.ingredientService.create(nome)
            res.status(201).json({ id_ingredientes: criado})
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({message: error.message});
            } else {
                res.status(500).json({message: "Erro interno do servidor"});
            }
        }
    }

    update = async(req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const nome = req.body.nome_ingrediente;
            const atualizado = await this.ingredientService.update(id, nome)
            if (!atualizado) {
                throw new AppError("Não foi possível atualizar o ingrediente", 404);
            }
            res.status(200).json({message: "Ingrediente atualizado com sucesso"});
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({message: error.message});
            } else {
                res.status(500).json({message: "Erro interno do servidor"});
            }
        }
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const deletado = await this.ingredientService.delete(id);
            if (!deletado) {
                throw new AppError("Não foi possível deletar o ingrediente", 404);
            }
            res.status(200).json({message: "Ingrediente deletado com sucesso"});
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({message: error.message});
            } else {
                res.status(500).json({message: "Erro interno do servidor"});
            }
        }
    }
}
