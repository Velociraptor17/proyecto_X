document.addEventListener('DOMContentLoaded', function () {
    // Elementos de la interfaz
    const registrationForm = document.getElementById('registrationForm');
    const tablero = document.getElementById('tablero');
    const reiniciarBoton = document.getElementById('reiniciar');
    const contadorDiv = document.getElementById('contador');
    const modeSelect = document.getElementById('modeSelect');
    const startGameButton = document.getElementById('startGame');
    const simboloSelect = document.querySelector('input[name="symbol"]:checked');
    let turno = simboloSelect ? simboloSelect.value : 'X';
    let jugadorSimbolo = turno;
    let juegoActivo = true;
    let modoJuego = '2players';
    let resultados = JSON.parse(localStorage.getItem('resultados')) || { X: 0, O: 0, empates: 0 };

    actualizarContador();

    window.addEventListener('beforeunload', () => {
        localStorage.removeItem('resultados');
    });

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        if (!username) {
            alert('El nombre de usuario es obligatorio');
            return;
        }

        localStorage.setItem('user', JSON.stringify({ username }));
        document.querySelector('.register-form').classList.add('hidden');
        document.querySelector('.game-mode').classList.remove('hidden');
    });

    startGameButton.addEventListener('click', () => {
        modoJuego = modeSelect.value;
        turno = document.querySelector('input[name="symbol"]:checked').value;
        jugadorSimbolo = turno;
        document.querySelector('.game-mode').classList.add('hidden');
        tablero.classList.remove('hidden');
        reiniciarBoton.classList.remove('hidden');
        actualizarContador();
    });

    const celdas = document.querySelectorAll('.celda');
    const combinacionesGanadoras = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function manejarClick(e) {
        const celda = e.target;
        if (celda.textContent !== '' || !juegoActivo) return;

        celda.textContent = turno;

        if (verificarGanador(turno)) {
            juegoActivo = false;
            alert(`¡${turno} ha ganado!`);
            resultados[turno]++;
            actualizarContador();
            return;
        }

        if (verificarEmpate()) {
            juegoActivo = false;
            alert('¡Empate!');
            resultados.empates++;
            actualizarContador();
            return;
        }

        turno = turno === 'X' ? 'O' : 'X';

        if (modoJuego !== '2players' && turno !== jugadorSimbolo) {
            movimientoComputadora();
        }
    }

    function verificarGanador(jugador) {
        return combinacionesGanadoras.some(combinacion =>
            combinacion.every(index => celdas[index].textContent === jugador)
        );
    }

    function verificarEmpate() {
        return [...celdas].every(celda => celda.textContent !== '');
    }

    function reiniciarJuego() {
        celdas.forEach(celda => celda.textContent = '');
        juegoActivo = true;
        turno = jugadorSimbolo;
    }

    function actualizarContador() {
        localStorage.setItem('resultados', JSON.stringify(resultados));
        contadorDiv.textContent = `X: ${resultados.X} | O: ${resultados.O} | Empates: ${resultados.empates}`;
        contadorDiv.classList.remove('hidden');
    }

    function movimientoComputadora() {
        let index;
        const vacias = [...celdas].map((c, i) => c.textContent === '' ? i : null).filter(i => i !== null);

        if (modoJuego === 'easy') {
            index = vacias[Math.floor(Math.random() * vacias.length)];
        } else {
            index = vacias[0];
        }

        celdas[index].textContent = turno;
        if (verificarGanador(turno)) {
            juegoActivo = false;
            alert('¡La computadora ha ganado!');
            resultados[turno]++;
            actualizarContador();
        } else if (verificarEmpate()) {
            juegoActivo = false;
            alert('¡Empate!');
            resultados.empates++;
            actualizarContador();
        }
        turno = jugadorSimbolo;
    }

    celdas.forEach(celda => celda.addEventListener('click', manejarClick));
    reiniciarBoton.addEventListener('click', reiniciarJuego);
});