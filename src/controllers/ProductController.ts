import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { AppError } from "../errors/AppError";

export class ProductController {
    private productService = new ProductService();

    findAll = async(req: Request, res: Response): Promise<void> => {
        try {
            const products = await this.productService.findAll();
            res.status(200).json(products);
        } catch (error) {
            console.error("Erro ao buscar os produtos:", error);

            res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    }

    findById = async(req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const produto = await this.productService.findById(id);
            res.status(200).json(produto);
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
            const { nome, preco, popular, id_categoria, ingredienteIds } = req.body;
            const criado = await this.productService.create(nome, preco, popular, id_categoria, ingredienteIds)
            res.status(201).json({ id_produto: criado})
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
            const { nome, preco, popular, id_categoria, ingredienteIds } = req.body;
            const atualizado = await this.productService.update(id, nome, preco, popular, id_categoria, ingredienteIds)
            if (!atualizado) {
                throw new AppError("Não foi possível atualizar o Produto", 404);
            }
            res.status(200).json({message: "Produto atualizado com sucesso"});
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
            const deletado = await this.productService.delete(id);
            if (!deletado) {
                throw new AppError("Não foi possível deletar o Produto", 404);
            }
            res.status(200).json({message: "Produto deletado com sucesso"});
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({message: error.message});
            } else {
                res.status(500).json({message: "Erro interno do servidor"});
            }
        }
    }
}