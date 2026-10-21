import { AppError } from "../errors/AppError";
import { UserRepository } from "../repositories/UserRepository";
import { validarCPF } from "../utils/validarCPF";
import bcrypt from "bcrypt";

export class UserService {
    private userRepository = new UserRepository();

    async register(nome: string, email: string, cpf: string, senha: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailNormalizado = email.trim().toLowerCase();
        const maiusculaRegex = /[A-Z]/;
        const minusculaRegex = /[a-z]/;
        const numeroRegex = /[0-9]/;
        const especialRegex = /[^A-Za-z0-9]/;
        const cpfLimpo = cpf.replace(/\D/g, "");
        
        if (!nome.trim()) {
            throw new AppError("O nome não pode estar vazio", 400)
        }

        if (!emailNormalizado || !emailRegex.test(emailNormalizado)) {
            throw new AppError("O email não pode estar vazio nem estar fora do formato correto", 400)
        }

        if (senha.length < 8) {
            throw new AppError("A senha não pode ter menos de 8 caracteres", 400)
        }

        if (!maiusculaRegex.test(senha)) {
            throw new AppError("A senha deve conter pelo menos uma letra maiúscula", 400)
        }

        if (!minusculaRegex.test(senha)) {
            throw new AppError("A senha deve conter pelo menos uma letra minúscula", 400)
        }

        if (!numeroRegex.test(senha)) {
            throw new AppError("A senha deve conter pelo menos um número", 400)
        }

        if (!especialRegex.test(senha)) {
            throw new AppError("A senha deve conter pelo menos um caractere especial", 400)
        }

        if (cpfLimpo.length !== 11) {
            throw new AppError("O CPF deve conter 11 dígitos", 400)
        }

        if (!validarCPF(cpfLimpo)) {
            throw new AppError("CPF inválido", 400);
        }

        const usuarioExistente = await this.userRepository.findByEmail(emailNormalizado)

        if (usuarioExistente) {
            throw new AppError("E-mail já cadastrado", 409);
        }

        const cpfExistente = await this.userRepository.findByCpf(cpfLimpo)

        if (cpfExistente) {
            throw new AppError("CPF já cadastrado", 409);
        }

        const senhaHash = await bcrypt.hash(senha, 12)

        const userId = await this.userRepository.create(nome.trim(), emailNormalizado, cpfLimpo, senhaHash)

        return userId;
    }
}