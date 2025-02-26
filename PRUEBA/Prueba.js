// Zona segura
window.addEventListener('DOMContentLoaded', () => {
    // Elementos de la interfaz
    const registrationForm = document.getElementById('registrationForm');
    const vsJugadorBoton = document.getElementById('vsJugador');
    const vsIABoton = document.getElementById('vsIA');
    const dificultadDiv = document.getElementById('dificultad');
    const facilBoton = document.getElementById('facil');
    const medioBoton = document.getElementById('medio');
    const dificilBoton = document.getElementById('dificil');
    const menuBoton = document.getElementById('menuBoton');
    const celdas = document.querySelectorAll('.celda');
    const reiniciarBoton = document.getElementById('reiniciar');
    const contadorDiv = document.getElementById('contador');

    // Variables del juego
    let turno = 'X'; // Turno inicial
    let juegoActivo = true; // Estado del juego
    let vsIA = false; // Modo de juego (Jugador vs Jugador o Jugador vs IA)
    let dificultad = 'facil'; // Dificultad de la IA
    let resultados = JSON.parse(localStorage.getItem('resultados')) || { X: 0, O: 0, empates: 0 }; // Contador de resultados

    // Manejo del formulario de registro
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            if (!username) return alert('El nombre de usuario es obligatorio');
            localStorage.setItem('user', JSON.stringify({ username }));
            window.location.href = './Bienvenidos.html'; // Redirigir a la pantalla de Bienvenidos
        });
    }

    // Manejo de la selección de modo de juego
    if (vsJugadorBoton) {
        vsJugadorBoton.addEventListener('click', () => {
            vsIA = false;
            window.location.href = './game.html'; // Redirigir al juego en modo Jugador vs Jugador
        });
    }

    if (vsIABoton) {
        vsIABoton.addEventListener('click', () => {
            vsIA = true;
            dificultadDiv.style.display = 'block'; // Mostrar selección de dificultad
        });
    }

    // Manejo de la selección de dificultad
    if (facilBoton) {
        facilBoton.addEventListener('click', () => {
            dificultad = 'facil';
            localStorage.setItem('dificultad', 'facil');
            window.location.href = './game.html'; // Redirigir al juego en modo Jugador vs IA (fácil)
        });
    }

    if (medioBoton) {
        medioBoton.addEventListener('click', () => {
            dificultad = 'medio';
            localStorage.setItem('dificultad', 'medio');
            window.location.href = './game.html'; // Redirigir al juego en modo Jugador vs IA (medio)
        });
    }

    if (dificilBoton) {
        dificilBoton.addEventListener('click', () => {
            dificultad = 'dificil';
            localStorage.setItem('dificultad', 'dificil');
            window.location.href = './game.html'; // Redirigir al juego en modo Jugador vs IA (difícil)
        });
    }

    // Manejo del botón de menú en el juego
    if (menuBoton) {
        menuBoton.addEventListener('click', () => {
            window.location.href = './Bienvenidos.html'; // Volver a la pantalla de Bienvenidos
        });
    }

    // Manejo del clic en las celdas del tablero
    if (celdas) {
        celdas.forEach(celda => {
            celda.addEventListener('click', manejarClick);
        });
    }

    // Función para manejar el clic en una celda
    function manejarClick(e) {
        const celda = e.target;

        // Si la celda ya está ocupada o el juego no está activo, no hacer nada
        if (celda.textContent !== '' || !juegoActivo) return;

        // Marcar la celda con el símbolo del jugador actual (X o O)
        celda.textContent = turno;
        celda.classList.add(turno === 'X' ? 'simbolo-x' : 'simbolo-o');

        // Verificar si hay un ganador
        if (verificarGanador(turno)) {
            juegoActivo = false;
            alert(`¡${turno} ha ganado!`);
            resultados[turno]++;
            actualizarContador();
            return;
        }

        // Verificar si hay un empate
        if (verificarEmpate()) {
            juegoActivo = false;
            alert('¡Empate!');
            resultados.empates++;
            actualizarContador();
            return;
        }

        // Cambiar el turno al siguiente jugador
        turno = turno === 'X' ? 'O' : 'X';

        // Si es el turno de la IA, realizar su movimiento
        if (vsIA && turno === 'O') {
            jugarIA();
        }
    }

    // Función para verificar si hay un ganador
    function verificarGanador(jugador) {
        const combinacionesGanadoras = [
            [0, 1, 2], // Línea horizontal superior
            [3, 4, 5], // Línea horizontal media
            [6, 7, 8], // Línea horizontal inferior
            [0, 3, 6], // Línea vertical izquierda
            [1, 4, 7], // Línea vertical media
            [2, 5, 8], // Línea vertical derecha
            [0, 4, 8], // Línea diagonal (esquina superior izquierda a inferior derecha)
            [2, 4, 6]  // Línea diagonal (esquina superior derecha a inferior izquierda)
        ];

        return combinacionesGanadoras.some(combinacion => {
            return combinacion.every(index => {
                return celdas[index].textContent === jugador;
            });
        });
    }

    // Función para verificar si hay un empate
    function verificarEmpate() {
        return [...celdas].every(celda => {
            return celda.textContent !== '';
        });
    }

    // Función para reiniciar el juego
    if (reiniciarBoton) {
        reiniciarBoton.addEventListener('click', reiniciarJuego);
    }

    function reiniciarJuego() {
        celdas.forEach(celda => {
            celda.textContent = '';
            celda.classList.remove('simbolo-x', 'simbolo-o');
        });
        juegoActivo = true;
        turno = 'X';
    }

    // Función para actualizar el contador de resultados
    function actualizarContador() {
        localStorage.setItem('resultados', JSON.stringify(resultados));
        contadorDiv.textContent = `X: ${resultados.X} | O: ${resultados.O} | Empates: ${resultados.empates}`;
        contadorDiv.classList.remove('hidden');
    }

    // Función para que la IA realice su movimiento
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
            celdas[movimiento].classList.add('simbolo-o');

            if (verificarGanador('O')) {
                juegoActivo = false;
                alert('¡La IA ha ganado!');
                resultados.O++;
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

            turno = 'X';
        }
    }

    // Función para la IA en modo fácil (movimiento aleatorio)
    function jugarIAFacil() {
        const celdasVacias = [...celdas].filter(celda => celda.textContent === '');
        const movimientoAleatorio = Math.floor(Math.random() * celdasVacias.length);
        return celdasVacias[movimientoAleatorio].getAttribute('data-index');
    }

    // Función para la IA en modo medio (puedes mejorarla)
    function jugarIAMedio() {
        return jugarIAFacil(); // Por ahora, es igual al modo fácil
    }

    // Función para la IA en modo difícil (puedes mejorarla)
    function jugarIADificil() {
        return jugarIAFacil(); // Por ahora, es igual al modo fácil
    }

    // Limpiar estadísticas cuando se cierra la pestaña o el navegador
    window.addEventListener('beforeunload', () => {
        localStorage.removeItem('resultados'); // Eliminar las estadísticas del localStorage
    });
});