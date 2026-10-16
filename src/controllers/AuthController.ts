import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
    private authService = new AuthService();

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, cpf, senha } = req.body;

            if (
                typeof email !== "string" ||
                typeof cpf !== "string" ||
                typeof senha !== "string" ||
                !email.trim() ||
                !cpf.trim() ||
                !senha
            ) {
                res.status(400).json({
                    message: "Email, CPF e senha são obrigatórios"
                });
                return;
            }

            const result = await this.authService.login(
                email,
                cpf,
                senha
            );

            res.status(200).json(result);

        } catch (error) {
            if (error instanceof Error &&
                error.message === "Credenciais inválidas") {
                res.status(401).json({
                    message: "Credenciais inválidas"
                });
                return;
            }

            console.error("Erro no login:", error);

            res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    };
}