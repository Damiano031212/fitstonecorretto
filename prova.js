const carousel = document.getElementById('carousel');

// Crea gli elementi da 0 a 500 kg
for (let i = 0; i <= 500; i++) {
  const div = document.createElement('div');
  div.classList.add('weight');
  div.textContent = `${i}kg`;
  carousel.appendChild(div);
}

// Funzione per determinare l'elemento centrato e salvarlo in localStorage
function highlightCenteredWeight() {
  const items = document.querySelectorAll('.weight');
  const containerRect = carousel.getBoundingClientRect();
  let minDistance = Infinity;
  let selectedItem = null;

  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const containerCenter = containerRect.left + containerRect.width / 2;
    const distance = Math.abs(containerCenter - itemCenter);

    // Rimuove la classe "selected" da ogni elemento
    item.classList.remove('selected');

    if (distance < minDistance) {
      minDistance = distance;
      selectedItem = item;
    }
  });

  if (selectedItem) {
    // Imposta l'elemento con distanza minima come selezionato
    selectedItem.classList.add('selected');
    // Salva il valore selezionato in localStorage
    localStorage.setItem('pesoSelezionato', selectedItem.textContent);
  }
}

// Al verificarsi dello scroll, viene richiamata la funzione per aggiornare la selezione
carousel.addEventListener('scroll', () => {
  window.requestAnimationFrame(highlightCenteredWeight);
});

// Al caricamento della pagina, ripristina l'elemento salvato e poi chiama highlightCenteredWeight per aggiornare
window.addEventListener('load', () => {
  const saved = localStorage.getItem('pesoSelezionato');
  if (saved) {
    const items = document.querySelectorAll('.weight');
    items.forEach(item => {
      // Rimuove eventuali selezioni precedenti
      item.classList.remove('selected');
      if (item.textContent === saved) {
        // Imposta direttamente l'elemento corrispondente come selezionato
        item.classList.add('selected');
      }
    });
  }
  // Chiama la funzione per aggiornare la selezione basata sulla posizione attuale
  highlightCenteredWeight();
});

const dropdown = document.getElementById('repsDropdown');

// Aggiunge le opzioni da 1 a 50
for (let i = 1; i <= 50; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = `${i} reps`;
  dropdown.appendChild(option);
}

// Ripristina il valore salvato per il dropdown delle rep, se presente
const savedValue = localStorage.getItem('selectedReps');
if (savedValue !== null) {
  dropdown.value = savedValue;
  dropdown.classList.remove('gray-text');
  dropdown.classList.add('black-text');
}

// Al cambio del dropdown, salva il nuovo valore e cambia colore del testo
dropdown.addEventListener('change', () => {
  localStorage.setItem('selectedReps', dropdown.value);
  dropdown.classList.remove('gray-text');
  dropdown.classList.add('black-text');
});
