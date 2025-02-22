// 1. Pedir al usuario sus datos
let nombre = prompt("Ingrese su nombre:");
let apellido = prompt("Ingrese su apellido:");
let cedula = prompt("Ingrese su cédula:");

// 2. Guardar los datos del usuario como objeto
let usuario = {
    nombre: nombre,
    apellido: apellido,
    cedula: cedula
};

const board = document.getElementById("board");
const status = document.getElementById("status");
const resetButton = document.getElementById("reset");
let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            status.textContent = `¡${gameBoard[a]} gana!`;
            board.childNodes.forEach(cell => cell.classList.add("taken"));
            return true;
        }
    }
    if (!gameBoard.includes("")) {
        status.textContent = "¡Empate!";
        return true;
    }
    return false;
}

function handleClick(e) {
    const index = e.target.dataset.index;
    if (gameBoard[index] === "") {
        gameBoard[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.classList.add("taken");
        if (!checkWinner()) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            status.textContent = `Turno de ${currentPlayer}`;
        }
    }
}

function resetGame() {
    gameBoard.fill("");
    board.innerHTML = "";
    status.textContent = "Turno de X";
    currentPlayer = "X";
    createBoard();
}

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleClick);
        board.appendChild(cell);
    }
}

resetButton.addEventListener("click", resetGame);
createBoard();

// 8. Mostrar el objeto usuario en la consola del navegador
console.log(usuario);