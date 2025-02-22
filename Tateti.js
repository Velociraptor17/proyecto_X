document.addEventListener('DOMContentLoaded', function () {
    // Captura del formulario y del tablero
    const registrationForm = document.getElementById('registrationForm');
    const tablero = document.getElementById('tablero');
    const reiniciarBoton = document.getElementById('reiniciar');
    const contadorDiv = document.createElement('div');
    contadorDiv.id = 'contador';
    document.body.appendChild(contadorDiv);
    
    let turno = 'X';
    let juegoActivo = true;
    
    // Contador de resultados
    let resultados = JSON.parse(localStorage.getItem('resultados')) || { X: 0, O: 0, empates: 0 };
    actualizarContador();
    
    // Manejo del formulario de registro
    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!username || !email || !password) {
            alert('Todos los campos son obligatorios');
            return;
        }
        
        localStorage.setItem('user', JSON.stringify({ username, email }));
        
        document.querySelector('.register-form').style.display = 'none';
        tablero.style.display = 'grid';
        reiniciarBoton.style.display = 'block';
        
        alert(`Bienvenido, ${username}! El juego ha comenzado.`);
    });
    
    // Configuración del juego
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
        turno = 'X';
    }
    
    function actualizarContador() {
        localStorage.setItem('resultados', JSON.stringify(resultados));
        contadorDiv.textContent = `X: ${resultados.X} | O: ${resultados.O} | Empates: ${resultados.empates}`;
    }
    
    celdas.forEach(celda => celda.addEventListener('click', manejarClick));
    reiniciarBoton.addEventListener('click', reiniciarJuego);
});
