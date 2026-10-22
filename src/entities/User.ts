import { userIdSchema, userNomeSchema, userEmailSchema, userCpfSchema, userRoleSchema } from "../schemas/userSchemas";
import { Serializavel } from "../interfaces/Serializavel";

export class User implements Serializavel {
    private _id_usuario: number;
    private _nome: string = "";
    private _email: string = "";
    private _cpf: string | null;
    private _senha: string;
    private _role: "ADMIN" | "USER";

    constructor(id_usuario: number, nome: string, email: string, cpf: string | null, senha: string, role: "ADMIN" | "USER") {
        this._id_usuario = userIdSchema.parse(id_usuario);
        this.nome = nome;
        this.email = email;
        this._cpf = userCpfSchema.parse(cpf);
        this._senha = senha;
        this._role = userRoleSchema.parse(role);
    }

    get id_usuario(): number {
        return this._id_usuario;
    }

    get nome(): string {
        return this._nome;
    }

    set nome(nome: string) {
        this._nome = userNomeSchema.parse(nome);
    }

    get email(): string {
        return this._email;
    }

    set email(email: string) {
        this._email = userEmailSchema.parse(email);
    }

    get cpf(): string | null {
        return this._cpf;
    }

    get role(): "ADMIN" | "USER" {
        return this._role;
    }

    getPasswordHash(): string {
        return this._senha;
    }

    toJSON() {
        return {
            id_usuario: this.id_usuario,
            nome: this.nome,
            email: this.email
        };
    }
}
