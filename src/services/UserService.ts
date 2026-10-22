
import { AppError } from "../errors/AppError";
import { UserRepository } from "../repositories/UserRepository";
import { userCadastroSchema } from "../schemas/userSchemas";
import bcrypt from "bcrypt";

export class UserService {
    private userRepository = new UserRepository();

    async register(
        nome: string,
        email: string,
        cpf: string,
        senha: string
    ) {
        const resultado = userCadastroSchema.safeParse({
            nome,
            email,
            cpf,
            senha
        });

        if (!resultado.success) {
            throw new AppError(
                resultado.error.issues[0]?.message ?? "Dados inválidos",
                400
            );
        }

        const dados = resultado.data;

        const usuarioExistente = await this.userRepository.findByEmail(
            dados.email
        );

        if (usuarioExistente) {
            throw new AppError("E-mail já cadastrado", 409);
        }

        const cpfExistente = await this.userRepository.findByCpf(
            dados.cpf
        );

        if (cpfExistente) {
            throw new AppError("CPF já cadastrado", 409);
        }

        const senhaHash = await bcrypt.hash(dados.senha, 12);

        const userId = await this.userRepository.create(
            dados.nome,
            dados.email,
            dados.cpf,
            senhaHash
        );

        return userId;
    }
}
