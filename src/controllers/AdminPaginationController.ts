
import type { Request, Response } from "express";
import { z } from "zod";
import { AdminPaginationRepository } from "../repositories/AdminPaginationRepository";
import type { RecursoAdmin } from "../repositories/AdminPaginationRepository";

const paginacaoSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
});

export class AdminPaginationController {
    private repository = new AdminPaginationRepository();

    listar = (recurso: RecursoAdmin) =>
        async (req: Request, res: Response): Promise<void> => {
            const resultado = paginacaoSchema.safeParse({page: req.query.page, limit: req.query.limit});

            if (!resultado.success) {
                res.status(400).json({message: "page deve ser positivo e limit deve estar entre 1 e 100"});
                return;
            }

            try {
                const pagina = await this.repository.listar(recurso, resultado.data.page, resultado.data.limit);
                res.status(200).json(pagina);
            } catch (error) {
                console.error("Erro na paginação administrativa:", error);

                res.status(500).json({message: "Erro interno do servidor"});
            }
        };
}
