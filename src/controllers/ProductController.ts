import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

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
}