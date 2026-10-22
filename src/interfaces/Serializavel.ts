export interface Serializavel {
    toJSON(): Record<string, unknown>
}