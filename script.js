// =============================
// FUNZIONE PER IL CAROSELLO
// =============================
// La funzione createCarousel incapsula la logica del carosello originale,
// garantendo che il salvataggio in localStorage usi una chiave univoca per ciascuna istanza.
function createCarousel(carouselEl, options = {}) {
  const maxWeight = options.maxWeight || 500;
  // Utilizza la storageKey passata oppure quella presente come attributo dati
  const storageKey = options.storageKey || carouselEl.dataset.storageKey || "pesoSelezionato_default";

  let isCarouselActive = false;
  let currentCentered = null;
  let centerTimer = null;

  // Genera gli elementi (da 0 a maxWeight)
  function buildItems() {
    carouselEl.innerHTML = "";
    for (let i = 0; i <= maxWeight; i++) {
      const item = document.createElement("div");
      item.classList.add("carousel-item");
      item.textContent = `${i} kg`;
      carouselEl.appendChild(item);
    }
  }

  // Rileva l'elemento centrato all'interno del carosello corrente
  function getCenteredItem() {
    const items = carouselEl.querySelectorAll(".carousel-item");
    const containerRect = carouselEl.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestItem = null;
    let closestDistance = Infinity;
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - itemCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });
    return closestItem;
  }

  // Handler per rilevare l'elemento centrato (con debounce di 500ms)
  function handleCenterDetection() {
    if (!isCarouselActive) return;
    const centered = getCenteredItem();

    if (centered !== currentCentered) {
      clearTimeout(centerTimer);
      if (currentCentered) {
        currentCentered.classList.remove("selected");
        currentCentered.removeEventListener("dblclick", handleDoubleClickInput);
      }
      currentCentered = centered;
      centerTimer = setTimeout(() => {
        centered.classList.add("selected");
        console.log("Peso selezionato:", centered.textContent);
        localStorage.setItem(storageKey, centered.textContent);
        centered.addEventListener("dblclick", handleDoubleClickInput);
      }, 500);
    }
  }

  // Gestione del doppio click per mostrare l'input manuale
  // L'input viene ricercato relativamente al container padre (in modo che ogni istanza lo trovi nel proprio blocco)
  function handleDoubleClickInput() {
    const inputElement = carouselEl.parentElement.querySelector('.manualWeightInput');
    if (!inputElement) {
      console.error("Input manualWeightInput non trovato nel container padre.");
      return;
    }
    inputElement.style.opacity = "1";
    inputElement.style.pointerEvents = "auto";
    inputElement.focus();
    inputElement.value = "";

    function handleInputConfirm() {
      const value = parseInt(inputElement.value, 10);
      if (!isNaN(value) && value >= 0 && value <= maxWeight) {
        const items = carouselEl.querySelectorAll(".carousel-item");
        const target = Array.from(items).find(item => item.textContent === `${value} kg`);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", inline: "center" });
        }
      } else if (inputElement.value !== "") {
        alert("Inserisci un numero valido tra 0 e " + maxWeight + ".");
      }
      inputElement.blur();
      inputElement.style.opacity = "0";
      inputElement.style.pointerEvents = "none";
      inputElement.removeEventListener("blur", handleInputConfirm);
      inputElement.removeEventListener("keydown", handleKeyDown);
    }

    function handleKeyDown(e) {
      if (e.key === "Enter") {
        handleInputConfirm();
      }
    }

    inputElement.addEventListener("blur", handleInputConfirm);
    inputElement.addEventListener("keydown", handleKeyDown);
  }

  // Attiva il carosello al primo click/tocco
  function activateCarousel() {
    if (!isCarouselActive) {
      isCarouselActive = true;
      carouselEl.addEventListener("scroll", handleCenterDetection);
      setTimeout(handleCenterDetection, 100);
      console.log("Carosello attivato.");
    }
  }

  // Inizializza il carosello
  buildItems();
  carouselEl.addEventListener("click", activateCarousel);

  // Ripristina il peso salvato per questa istanza (se presente)
  const savedWeight = localStorage.getItem(storageKey);
  if (savedWeight) {
    const items = carouselEl.querySelectorAll(".carousel-item");
    items.forEach(item => {
      if (item.textContent === savedWeight) {
        // Il ripristino viene eseguito subito, dal momento che il DOM è già stato caricato
        item.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    });
  }
}

// =============================
// INIZIALIZZAZIONE DELLE ISTANZE
// =============================
// Al caricamento del DOM, viene chiamata createCarousel per ogni container con classe "carousel-container"
document.addEventListener("DOMContentLoaded", () => {
  const carouselElements = document.querySelectorAll(".carousel-container");
  carouselElements.forEach(carouselEl => {
    createCarousel(carouselEl, { maxWeight: 500 });
  });
});

// =============================
// FUNZIONE PER IL MENÙ A TENDINA
// =============================
// La funzione createDropdown accetta come parametri:
// - dropdownEl: l'elemento <select> target
// - options: oggetto opzionale per configurare (maxReps, storageKey)
function createDropdown(dropdownEl, options = {}) {
  const maxReps = options.maxReps || 50;
  const storageKey = options.storageKey || dropdownEl.dataset.storageKey || "selectedReps_default";

  dropdownEl.innerHTML = "";
  for (let i = 1; i <= maxReps; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${i} reps`;
    dropdownEl.appendChild(option);
  }

  const savedValue = localStorage.getItem(storageKey);
  if (savedValue !== null) {
    dropdownEl.value = savedValue;
    dropdownEl.classList.remove("gray-text");
    dropdownEl.classList.add("black-text");
  }

  dropdownEl.addEventListener("change", () => {
    localStorage.setItem(storageKey, dropdownEl.value);
    dropdownEl.classList.remove("gray-text");
    dropdownEl.classList.add("black-text");
  });
}

// =============================
// FUNZIONE PER LA CHECKBOX
// =============================
// La funzione createCheckbox accetta:
// - checkboxEl: l'elemento <input type="checkbox">
// - onChange: (opzionale) callback per gestire il cambio di stato
function createCheckbox(checkboxEl, onChange) {
  checkboxEl.addEventListener("change", function() {
    if (this.checked) {
      console.log("Checkbox selezionata");
    } else {
      console.log("Checkbox deselezionata");
    }
    if (typeof onChange === "function") {
      onChange(this.checked);
    }
  });
}

// =============================
// ESEMPIO DI INIZIALIZZAZIONE
// =============================
// Per ciascuna istanza, se il container HTML contiene l’attributo data-storage-key, verrà usato automaticamente.
document.addEventListener("DOMContentLoaded", () => {
  const carouselElements = document.querySelectorAll(".carousel-container");
  carouselElements.forEach(carouselEl => {
    createCarousel(carouselEl, { maxWeight: 500 });
  });

  const dropdownElements = document.querySelectorAll(".custom-select");
  dropdownElements.forEach(dropdownEl => {
    createDropdown(dropdownEl, { maxReps: 50 });
  });

  const checkboxElements = document.querySelectorAll('input[type="checkbox"]');
  checkboxElements.forEach(checkboxEl => {
    createCheckbox(checkboxEl);
  });
});