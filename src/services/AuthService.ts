import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
    private userRepository = new UserRepository();

    async login(email: string, cpf: string, senha: string) {
        const user = await this.userRepository.findByEmailAndCpf(email, cpf);

        if (!user) {
            throw new Error("Credenciais inválidas");
        }

        const senhaValida = await bcrypt.compare(
            senha,
            user.getPasswordHash()
        );

        if (!senhaValida) {
            throw new Error("Credenciais inválidas");
        }

        if (user.role !== "ADMIN") {
            throw new Error("Acesso administrativo negado");
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