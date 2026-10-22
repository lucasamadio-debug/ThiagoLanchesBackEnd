import { Serializavel } from "../interfaces/Serializavel";

export function serializarEntidades(entidades: Serializavel[]): Record<string, unknown>[] {
    const serializados = entidades.map(entidade => entidade.toJSON())

    return serializados;
}