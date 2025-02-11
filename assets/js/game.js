import { corAleatoria, numeroAleatorio } from './utils.js'
import { audio, audio2, audio3, audio4 } from './audio.js'

const gameContainer = document.querySelector(".game-container")
const pontuacao = document.querySelector(".valor-pontuacao")
const pontuacaoFinal = document.querySelector(".pontuacao-final > span")
const menu = document.querySelector(".menu")
const botao = document.querySelector(".btn-jogar")
const dificuldadeSelect = document.querySelector(".dificuldade")

let velocidade = 300
const tamanhoQuadrado = 30

const posicaoInicial = { x: 270, y: 240 }
let snake = [posicaoInicial]

const incrementarPontuacao = () => {
    pontuacao.innerText = +pontuacao.innerText + 10
}

const posicaoAleatoria = () => {
    let x, y, posicaoOcupada

    do {
        x = Math.round(numeroAleatorio(0, gameContainer.offsetWidth - 30) / 30) * 30
        y = Math.round(numeroAleatorio(0, gameContainer.offsetHeight - 30) / 30) * 30

        posicaoOcupada = snake.some((segmento) => segmento.x === x && segmento.y === y)
    } while (posicaoOcupada)

    return { x, y }
}

let comida = {
    ...posicaoAleatoria(),
    color: corAleatoria()
}

let direcao, loopId
let comeuComida = false

const desenharComida = () => {
    let comidaDiv = document.querySelector(".comida")
    if (!comidaDiv) {
        comidaDiv = document.createElement("div")
        comidaDiv.className = "comida"
        gameContainer.appendChild(comidaDiv)
    }
    comidaDiv.style.top = `${comida.y}px`
    comidaDiv.style.left = `${comida.x}px`
    comidaDiv.style.backgroundColor = comida.color
}

const desenharSnake = () => {
    gameContainer.innerHTML = ""
    desenharComida()
    snake.forEach((posicao, index) => {
        const snakeDiv = document.createElement("div")
        snakeDiv.className = index === snake.length - 1 ? "snake-head" : "snake-body"
        snakeDiv.style.top = `${posicao.y}px`
        snakeDiv.style.left = `${posicao.x}px`
        gameContainer.appendChild(snakeDiv)
    })
}

const mordida = () => {
    const head = snake[snake.length - 1]

    if (head.x === comida.x && head.y === comida.y) {
        incrementarPontuacao()
        audio.play()

        comida = {
            ...posicaoAleatoria(),
            color: corAleatoria()
        }

        comeuComida = true
    }
}

const moverSnake = () => {
    if (!direcao) return

    const head = snake[snake.length - 1]
    let novoHead = { ...head }

    audio2.play()

    if (velocidade === 100) {
        audio2.pause()
        audio4.play()
    } else {
        audio2.play()
        audio4.pause()
    }

    if (direcao === "right") novoHead = { x: head.x + tamanhoQuadrado, y: head.y }
    if (direcao === "left") novoHead = { x: head.x - tamanhoQuadrado, y: head.y }
    if (direcao === "down") novoHead = { x: head.x, y: head.y + tamanhoQuadrado }
    if (direcao === "up") novoHead = { x: head.x, y: head.y - tamanhoQuadrado }

    const limiteX = gameContainer.offsetWidth - tamanhoQuadrado
    const limiteY = gameContainer.offsetHeight - tamanhoQuadrado

    if (novoHead.x < 0) novoHead.x = limiteX
    if (novoHead.x > limiteX) novoHead.x = 0
    if (novoHead.y < 0) novoHead.y = limiteY
    if (novoHead.y > limiteY) novoHead.y = 0

    snake.push(novoHead)

    if (!comeuComida) {
        snake.shift()
    } else {
        comeuComida = false
    }
}

const colisao = () => {
    const head = snake[snake.length - 1]
    const body = snake.slice(0, -1)

    const colisaoSnake = body.some(
        (posicao) => posicao.x === head.x && posicao.y === head.y
    )

    if (colisaoSnake) gameOver()
}

let audio3Tocou = false

const tamanhoCampo = (gameContainer.offsetWidth / tamanhoQuadrado) * (gameContainer.offsetHeight / tamanhoQuadrado)

const verificarVitoria = () => {
    if (snake.length >= tamanhoCampo) {
        clearTimeout(loopId)
        gameOver(true)
    }
}

const gameOver = (vitoria = false) => {
    if (vitoria) {
        alert("Parabéns! Você venceu o jogo!")
    } else {
        if (!audio3Tocou) {
            audio3.play()
            audio3Tocou = true
            audio3.onended = () => {
                audio3.pause()
                audio3.currentTime = 0
            }
        }
    }
    audio2.pause()
    audio4.pause()
    audio4.currentTime = 0
    direcao = undefined

    menu.style.display = "flex"
    pontuacaoFinal.innerText = pontuacao.innerText
    gameContainer.style.filter = "blur(2px)"
}

const gameLoop = () => {
    clearTimeout(loopId)
    desenharComida()
    moverSnake()
    mordida()
    desenharSnake()
    colisao()
    verificarVitoria()
    loopId = setTimeout(gameLoop, velocidade)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
    if (key === "ArrowRight" && direcao !== "left") direcao = "right"
    if (key === "ArrowLeft" && direcao !== "right") direcao = "left"
    if (key === "ArrowDown" && direcao !== "up") direcao = "down"
    if (key === "ArrowUp" && direcao !== "down") direcao = "up"
})

dificuldadeSelect.addEventListener("change", (event) => {
    velocidade = Number(event.target.value)
    dificuldadeSelect.blur();
})

botao.addEventListener("click", () => {
    pontuacao.innerText = "00"
    menu.style.display = "none"
    gameContainer.style.filter = "none"
    audio3Tocou = false
    snake = [posicaoInicial]
    direcao = undefined
    gameLoop()
})
