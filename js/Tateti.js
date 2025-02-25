//zona segura
window.addEventListener('DOMContentLoaded', () => {
    // Elementos de la interfaz
    const registrationForm = document.getElementById('registrationForm');

    // Manejo del formulario de registro
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        if (!username) return alert('El nombre de usuario es obligatorio');
        localStorage.setItem('user', JSON.stringify({ username }));
        window.open('./game.html', '_blank');
    });

    // Configuración del juego
    if (window.location.pathname.includes('game.html')) {
        const tablero = document.getElementById('tablero');
        const reiniciarBoton = document.getElementById('reiniciar');
        const contadorDiv = document.getElementById('contador');
        const simboloSelect = document.querySelector('input[name="symbol"]:checked');
        let turno = simboloSelect ? simboloSelect.value : 'X',
            jugadorSimbolo = turno, juegoActivo = true,
            resultados = JSON.parse(localStorage.getItem('resultados')) || { X: 0, O: 0, empates: 0 };

        actualizarContador();

        const celdas = document.querySelectorAll('.celda');
        celdas.forEach(celda => celda.addEventListener('click', manejarClick));
        reiniciarBoton.addEventListener('click', reiniciarJuego);

        function manejarClick(e) {
            const celda = e.target;
            if (celda.textContent || !juegoActivo) return;
            celda.textContent = turno;

            if (verificarGanador(turno)) {
                juegoActivo = false;
                alert(`¡${turno} ha ganado!`);
                resultados[turno]++;
            } else if (verificarEmpate()) {
                juegoActivo = false;
                alert('¡Empate!');
                resultados.empates++;
            } else {
                turno = turno === 'X' ? 'O' : 'X';
            }
            actualizarContador();
        }

        function verificarGanador(jugador) {
            const combinacionesGanadoras = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
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
    }
});



