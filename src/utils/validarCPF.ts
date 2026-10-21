export function validarCPF(cpf: string): boolean {
    const cpfLimpo = cpf.replace(/\D/g, "");
    const cpfRepetidoRegex = /^(\d)\1{10}$/;

    if (cpfLimpo.length !== 11) {
        return false;
    }

    if (cpfRepetidoRegex.test(cpfLimpo)) {
        return false;
    }

    const digitos = cpfLimpo.split("").map(Number);

    let soma = 0;
    let soma2 = 0;

    for (let i = 0; i < 9; i++) {
        soma += digitos[i] * (10 - i);
    }

    const resto = soma % 11;
    const primeiroDigito = resto < 2 ? 0 : 11 - resto;

    if (primeiroDigito !== digitos[9]) {
        return false;
    }

    for (let i = 0; i < 10; i++) {
        soma2 += digitos[i] * (11 - i);
    }

    const resto2 = soma2 % 11;
    const segundoDigito = resto2 < 2 ? 0 : 11 - resto2;

    if (segundoDigito !== digitos[10]) {
        return false;
    }

    return true;
}