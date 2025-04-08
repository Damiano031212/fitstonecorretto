const carousel = document.getElementById('carousel');

// Crea gli elementi da 0 a 500 kg
for (let i = 0; i <= 500; i++) {
  const div = document.createElement('div');
  div.classList.add('weight');
  div.textContent = `${i}kg`;
  carousel.appendChild(div);
}

// Funzione per evidenziare il peso centrato (usata in seguito per lo scroll)
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

    item.classList.remove('selected');

    if (distance < minDistance) {
      minDistance = distance;
      selectedItem = item;
    }
  });

  if (selectedItem) {
    selectedItem.classList.add('selected');
    localStorage.setItem('pesoSelezionato', selectedItem.textContent);
  }
}

// Evidenzia quando si scrolla
carousel.addEventListener('scroll', () => {
  window.requestAnimationFrame(highlightCenteredWeight);
});

window.addEventListener('load', () => {
  const saved = localStorage.getItem('pesoSelezionato');
  if (saved) {
    const items = document.querySelectorAll('.weight');
    items.forEach(item => {
      if (item.textContent === saved) {
        // Rimuove la classe "selected" da tutti e imposta quella sull'elemento salvato
        items.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        localStorage.setItem('pesoSelezionato', item.textContent);
      }
    });
  } else {
    highlightCenteredWeight();
  }
});

// da qui sotto inizia la parte del dropdown reps
const dropdown = document.getElementById('repsDropdown');

// Aggiunge le opzioni da 1 a 50
for (let i = 1; i <= 50; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = `${i} reps`;
  dropdown.appendChild(option);
}

// Controlla se c'è un valore salvato
const savedValue = localStorage.getItem('selectedReps');
if (savedValue !== null) {
  dropdown.value = savedValue;
  dropdown.classList.remove('gray-text');
  dropdown.classList.add('black-text');
}

// Quando cambia, salva e aggiorna colore
dropdown.addEventListener('change', () => {
  localStorage.setItem('selectedReps', dropdown.value);
  dropdown.classList.remove('gray-text');
  dropdown.classList.add('black-text');
});
