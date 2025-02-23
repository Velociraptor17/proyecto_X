const celdas = document.querySelectorAll('.celda');
const tablero = document.getElementById('tablero');
const reiniciarBoton = document.getElementById('reiniciar');
const vsJugadorBoton = document.getElementById('vsJugador');
const vsIABoton = document.getElementById('vsIA');
const dificultadDiv = document.getElementById('dificultad');
const facilBoton = document.getElementById('facil');
const medioBoton = document.getElementById('medio');
const dificilBoton = document.getElementById('dificil');
const victoriasX = document.getElementById('victoriasX');
const victoriasO = document.getElementById('victoriasO');
const menu = document.getElementById('menu');
const juego = document.getElementById('juego');

let turno = 'X';
let juegoActivo = true;
let vsIA = false;
let dificultad = 'facil'; // 'facil', 'medio', 'dificil'
let victoriasJugadorX = 0;
let victoriasJugadorO = 0;

const combinacionesGanadoras = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function manejarClick(e) {
    const celda = e.target;
    const index = celda.getAttribute('data-index');

    if (celda.textContent !== '' || !juegoActivo) return;

    celda.textContent = turno;
    if (verificarGanador(turno)) {
        juegoActivo = false;
        alert(`¡${turno} ha ganado!`);
        actualizarContador(turno);
        return;
    }

    if (verificarEmpate()) {
        juegoActivo = false;
        alert('¡Empate!');
        return;
    }

    turno = turno === 'X' ? 'O' : 'X';

    if (vsIA && turno === 'O') {
        jugarIA();
    }
}

function verificarGanador(jugador) {
    return combinacionesGanadoras.some(combinacion => {
        return combinacion.every(index => {
            return celdas[index].textContent === jugador;
        });
    });
}

function verificarEmpate() {
    return [...celdas].every(celda => {
        return celda.textContent !== '';
    });
}

function reiniciarJuego() {
    celdas.forEach(celda => {
        celda.textContent = '';
    });
    juegoActivo = true;
    turno = 'X';
}

function actualizarContador(jugador) {
    if (jugador === 'X') {
        victoriasJugadorX++;
        victoriasX.textContent = victoriasJugadorX;
    } else {
        victoriasJugadorO++;
        victoriasO.textContent = victoriasJugadorO;
    }
}

function jugarIA() {
    let movimiento;
    if (dificultad === 'facil') {
        movimiento = jugarIAFacil();
    } else if (dificultad === 'medio') {
        movimiento = jugarIAMedio();
    } else if (dificultad === 'dificil') {
        movimiento = jugarIADificil();
    }

    if (movimiento !== undefined) {
        celdas[movimiento].textContent = 'O';
        if (verificarGanador('O')) {
            juegoActivo = false;
            alert('¡La IA ha ganado!');
            actualizarContador('O');
            return;
        }

        if (verificarEmpate()) {
            juegoActivo = false;
            alert('¡Empate!');
            return;
        }

        turno = 'X';
    }
}

function jugarIAFacil() {
    const celdasVacias = [...celdas].filter(celda => celda.textContent === '');
    const movimientoAleatorio = Math.floor(Math.random() * celdasVacias.length);
    return celdasVacias[movimientoAleatorio].getAttribute('data-index');
}

function jugarIAMedio() {
    // Lógica para dificultad media (puedes mejorarla)
    return jugarIAFacil();
}

function jugarIADificil() {
    // Lógica para dificultad difícil (puedes mejorarla)
    return jugarIAFacil();
}

vsJugadorBoton.addEventListener('click', () => {
    vsIA = false;
    menu.style.display = 'none';
    juego.style.display = 'block';
});

vsIABoton.addEventListener('click', () => {
    vsIA = true;
    dificultadDiv.style.display = 'block';
});

facilBoton.addEventListener('click', () => {
    dificultad = 'facil';
    menu.style.display = 'none';
    juego.style.display = 'block';
});

medioBoton.addEventListener('click', () => {
    dificultad = 'medio';
    menu.style.display = 'none';
    juego.style.display = 'block';
});

dificilBoton.addEventListener('click', () => {
    dificultad = 'dificil';
    menu.style.display = 'none';
    juego.style.display = 'block';
});

celdas.forEach(celda => {
    celda.addEventListener('click', manejarClick);
});

reiniciarBoton.addEventListener('click', reiniciarJuego);