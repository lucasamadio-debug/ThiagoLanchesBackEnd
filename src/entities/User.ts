export class User {
    id_usuario: number;
    nome: string;
    email: string;
    cpf: string | null;
    private senha: string;
    role: "ADMIN" | "USER";
    
    constructor(id_usuario: number, nome: string, email: string, cpf: string | null, senha: string, role: "ADMIN" | "USER") {
        this.id_usuario = id_usuario;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.senha = senha;
        this.role = role;
    }

    public getPasswordHash(): string {
        return this.senha;
    }
}

