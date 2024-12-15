export const numeroAleatorio = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

export const corAleatoria = () => {
    const red = numeroAleatorio(0, 255)
    const green = numeroAleatorio(0, 255)
    const blue = numeroAleatorio(0, 255)
    return `rgb(${red}, ${green}, ${blue})`
}
