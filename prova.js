// Seleziona il pulsante
const button = document.querySelector('.start_button');

// Aggiungi un evento "click" al pulsante
button.addEventListener('click', () => {
    // Applica temporaneamente una classe per l'animazione
    button.classList.add('pressed');

    // Rimuovi la classe dopo un breve intervallo per ripristinare lo stato originale
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 200); // 200ms corrisponde alla durata dell'animazione
});