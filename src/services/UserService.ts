import { AppError } from "../errors/AppError";
import { UserRepository } from "../repositories/UserRepository";
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
        const cpfRepetidoRegex = /^(\d)\1{10}$/;
        const digitos = cpfLimpo.split("").map(Number);
        let soma = 0;
        let soma2 = 0;
        let primeiroDigito = 0;
        let segundoDigito = 0;
        
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

        if (cpfRepetidoRegex.test(cpfLimpo)) {
            throw new AppError("CPF Inválido", 400)
        }

        for (let i = 0; i < 9; i++){
            soma += digitos[i] * (10 - i)    
        }

        const resto = soma % 11;

        if (resto < 2) {
            primeiroDigito = 0;
        } else {
            primeiroDigito = 11 - resto
        }

        if (primeiroDigito !== digitos[9]) {
            throw new AppError("CPF inválido", 400);
        }

        for (let i = 0; i < 10; i++){
            soma2 += digitos[i] * (11 - i)    
        }

        const resto2 = soma2 % 11;

        if (resto2 < 2) {
            segundoDigito = 0;
        } else {
            segundoDigito = 11 - resto2
        }

        if (segundoDigito !== digitos[10]) {
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