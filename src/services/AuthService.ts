import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { ForbiddenError } from "../errors/ForbiddenError";

export class AuthService {
    private userRepository = new UserRepository();

    async login(email: string, cpf: string, senha: string) {
        const user = await this.userRepository.findByEmailAndCpf(email, cpf);

        if (!user) {
            throw new UnauthorizedError("Credenciais inválidas");
        }

        const senhaValida = await bcrypt.compare(
            senha,
            user.getPasswordHash()
        );

        if (!senhaValida) {
            throw new UnauthorizedError("Credenciais inválidas");
        }

        if (user.role !== "ADMIN") {
            throw new ForbiddenError("Acesso administrativo negado");
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET não configurado");
        }

        const token = jwt.sign(
            {
                id: user.id_usuario,
                role: user.role
            },
            secret,
            { expiresIn: "2h" }
        );

        return {
            token,
            user: {
                id: user.id_usuario,
                nome: user.nome,
                email: user.email
            }
        };
    }
}