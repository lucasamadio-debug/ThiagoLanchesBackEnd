import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { AppError } from "../errors/AppError";
import { UserService } from "../services/UserService";

export class AuthController {
    private authService = new AuthService();
    private userService = new UserService();

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

            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!regex.test(email)) {
                res.status(400).json({
                    message: "Formato de e-mail inválido"
                })
                return;
            }

            const result = await this.authService.login(
                email,
                cpf,
                senha
            );

            res.status(200).json(result);

        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    message: error.message
                });
                return;
            }

            console.error("Erro no login:", error);

            res.status(500).json({
                message: "Erro interno do servidor"
            });
        }
    };

    register = async(req: Request, res: Response): Promise<void> => {
        try {
            const { nome, email, cpf, senha } = req.body;

            if (typeof nome !== "string" ||
                typeof email !== "string" ||
                typeof cpf !== "string" ||
                typeof senha !== "string" ||
                !nome.trim() ||
                !email.trim() ||
                !cpf.trim() ||
                !senha
            ) {
                res.status(400).json({
                    message: "Nome, e-mail, CPF e senha são obrigatórios"
                });
                return;
            }

            const userId = await this.userService.register(nome, email, cpf, senha);

            res.status(201).json({
                message: "Usuário cadastrado com sucesso",
                id: userId
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    message: error.message
                });
                return;
            } else {
                console.error("Erro no cadastro:", error)
                res.status(500).json({
                    message: "Erro interno do servidor"
                });
            }
        }
    }
}