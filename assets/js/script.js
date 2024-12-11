const gameContainer = document.querySelector(".game-container")

const audio = new Audio('../assets/audio/audio.mp3')
const audio2 = new Audio('../assets/audio/easyandmedium.mp3')
const audio3 = new Audio('../assets/audio/gameover.mp3')
const audio4 = new Audio('../assets/audio/hardmode.mp3')

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

const numeroAleatorio = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const posicaoAleatoria = () => {
    const numero = numeroAleatorio(0, gameContainer.offsetWidth - tamanhoQuadrado)
    return Math.round(numero / tamanhoQuadrado) * tamanhoQuadrado
}

const corAleatoria = () => {
    const red = numeroAleatorio(0, 255)
    const green = numeroAleatorio(0, 255)
    const blue = numeroAleatorio(0, 255)
    return `rgb(${red}, ${green}, ${blue})`
}

const comida = {
    x: posicaoAleatoria(),
    y: posicaoAleatoria(),
    color: corAleatoria()
}

let direcao, loopId

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

let comeuComida = false

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

    comeuComida = head.x === comida.x && head.y === comida.y

    if (!comeuComida) {
        snake.shift()
    }
}

const mordida = () => {
    const head = snake[snake.length - 1]

    if (head.x === comida.x && head.y === comida.y) {
        incrementarPontuacao()
        audio.play()

        comida.x = posicaoAleatoria()
        comida.y = posicaoAleatoria()
        comida.color = corAleatoria()
       
        snake.push({ x: head.x, y: head.y })

    }
}

const colisao = () => {
    const head = snake[snake.length - 1]
    const body = comeuComida ? snake.slice(0, -2) : snake.slice(0, -1)

    const colisaoSnake = body.some(
        (posicao) => posicao.x === head.x && posicao.y === head.y
    )

    if (colisaoSnake) gameOver()
}

let audio3Tocou = false

const gameOver = () => {
    if (!audio3Tocou) {
        audio3.play()
        audio3Tocou = true
        audio3.onended = () => {
            audio3.pause()
            audio3.currentTime = 0
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


