function generateRandomCode({min,max}: {min:number,max:number}): string {
    const caracteresPermitidos = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_';

    const longitudCadena = Math.floor(Math.random() * (max - min + 1)) + min;
    let codeVerifier = '';

    for (let i = 0; i < longitudCadena; i++) {
        const indiceCaracter = Math.floor(Math.random() * caracteresPermitidos.length);
        codeVerifier += caracteresPermitidos.charAt(indiceCaracter);
    }

    return codeVerifier;
}

export function generateCodeVerifier() {
    return generateRandomCode({min: 43, max: 128});
}

export function generateState() {
  return generateRandomCode({min: 16, max: 1024})
}
