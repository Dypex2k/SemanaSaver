let saldo = 0.00;
let weeklyIncome = 0.00;

window.onload = function() {
    loadSavedData();
};

function calculateSavings() {
    // Obtiene las fechas y ganancias ingresadas por el usuario
    let startDate = new Date(document.getElementById('startWeek').value);
    let endDate = new Date(document.getElementById('endWeek').value);
    weeklyIncome = parseFloat(document.getElementById('weeklyIncome').value);

    // Ajusta automáticamente al inicio de la semana (lunes)
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - startDate.getDay() + (startDate.getDay() === 1 ? 0 : 1));

    // Ajusta automáticamente al final de la semana (sábado)
    endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - endDate.getDay() + 5);

    // Verifica que las fechas sean válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || isNaN(weeklyIncome)) {
        alert('Por favor, ingrese fechas y ganancias válidas.');
        return;
    }

    // Inicializa la variable para almacenar el resultado detallado
    let detailedResult = '';

    // Calcula el ahorro total y detallado
    let currentWeek = 1;
    let currentDate = startDate;

    while (currentDate <= endDate) {
        const startOfWeek = new Date(currentDate.getTime());
        const endOfWeek = new Date(startOfWeek.getTime() + (5 * 24 * 60 * 60 * 1000));

        // Utiliza el atributo data-week para identificar cada botón de completado
        detailedResult += `${getMonthName(startOfWeek.getMonth())} ${startOfWeek.getDate()} - ${endOfWeek.getDate()} (Semana ${currentWeek}) <button data-week="${currentWeek}" onclick="toggleCompletion(${currentWeek})">Completado</button><br>`;
        currentWeek++;

        currentDate.setDate(currentDate.getDate() + 7);
    }

    // Calcula el ahorro total
    const totalSavings = (currentWeek - 1) * weeklyIncome;

    // Muestra el resultado en la página
    document.getElementById('result').innerHTML = `Detalles de las semanas:<br>${detailedResult}<br>El ahorro total es: $${totalSavings.toFixed(2)}`;

    // Guarda los datos actualizados después de calcular el ahorro
    saveData();
}

function toggleCompletion(week) {
    // Obtiene el botón de completado correspondiente a la semana
    const completionButton = document.querySelector(`button[data-week="${week}"]`);

    // Actualiza el saldo dependiendo de la acción
    if (completionButton.textContent === 'Completado') {
        saldo += weeklyIncome;
    } else {
        saldo -= weeklyIncome;
    }

    // Actualiza el mensaje de felicitaciones si el saldo acumulado es positivo
    const savingsMessage = document.getElementById('savingsMessage');
    if (saldo > 0) {
        savingsMessage.innerHTML = '¡Felicidades! Has estado ahorrando.';
    } else {
        savingsMessage.innerHTML = '¡Vamos, puedes hacerlo! Continúa ahorrando.';
    }

    // Actualiza el saldo acumulado en la interfaz
    document.getElementById('saldoAmount').innerHTML = `Saldo: $${saldo.toFixed(2)}`;

    // Cambia el texto del botón según la acción
    if (completionButton.textContent === 'Completado') {
        completionButton.textContent = 'No Completado';
    } else {
        completionButton.textContent = 'Completado';
    }

    // Guarda los datos actualizados después de cada acción
    saveData();
}

function resetSavings() {
    // Restablece todas las variables y la interfaz
    saldo = 0.00;
    document.getElementById('result').innerHTML = '';
    document.getElementById('savingsMessage').innerHTML = '';
    document.getElementById('saldoAmount').innerHTML = 'Saldo: $0.00';

    // Limpia los datos almacenados
    clearStoredData();

    // Vuelve a cargar los datos para evitar problemas de visualización después del reinicio
    loadSavedData();
}

function saveData() {
    // Guarda tanto los detalles de la semana, el saldo actual y el monto ganado por semana en el LocalStorage
    try {
        const dataToSave = {
            weekDetails: document.getElementById('result').innerHTML,
            currentSavings: saldo.toFixed(2),
            weeklyIncome: weeklyIncome.toFixed(2)
        };
        window.localStorage.setItem('savedData', JSON.stringify(dataToSave));
    } catch (e) {
        console.error('Error al guardar datos en el LocalStorage:', e);
    }
}

function loadSavedData() {
    // Carga los datos almacenados desde el LocalStorage al cargar la página
    const savedData = window.localStorage.getItem('savedData');

    if (savedData !== null) {
        const parsedData = JSON.parse(savedData);

        // Carga el saldo almacenado
        const savedSavings = parsedData.currentSavings;
        if (!isNaN(parseFloat(savedSavings)) && isFinite(savedSavings)) {
            saldo = parseFloat(savedSavings);
            document.getElementById('saldoAmount').innerHTML = `Saldo: $${saldo.toFixed(2)}`;
        }

        // Carga los detalles de la semana almacenados
        const savedWeekDetails = parsedData.weekDetails;
        if (savedWeekDetails !== null) {
            document.getElementById('result').innerHTML = savedWeekDetails;
        }

        // Carga el monto ganado por semana almacenado
        const savedWeeklyIncome = parsedData.weeklyIncome;
        if (!isNaN(parseFloat(savedWeeklyIncome)) && isFinite(savedWeeklyIncome)) {
            weeklyIncome = parseFloat(savedWeeklyIncome);
        }

        // Actualiza el mensaje de felicitaciones según el saldo y el monto ganado por semana cargados
        const savingsMessage = document.getElementById('savingsMessage');
        if (saldo > 0) {
            savingsMessage.innerHTML = '¡Felicidades! Has estado ahorrando.';
        } else {
            savingsMessage.innerHTML = '¡Vamos, puedes hacerlo! Continúa ahorrando.';
        }
    }
}

function clearStoredData() {
    // Limpia los datos almacenados en el LocalStorage
    try {
        window.localStorage.removeItem('savedData');
    } catch (e) {
        console.error('Error al limpiar el LocalStorage:', e);
    }
}

function getMonthName(month) {
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[month];
}
