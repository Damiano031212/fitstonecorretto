const carousel = document.getElementById("carousel");

// Flag per abilitare il carosello dopo il primo tocco/click
let isCarouselActive = false;
let items = [];

// Funzione per iniziare il carosello dopo il primo tocco
function activateCarousel() {
  if (!isCarouselActive) {
    isCarouselActive = true;

    // Aggiungi l'eventListener per lo scroll solo dopo l'attivazione
    carousel.addEventListener("scroll", handleCenterDetection);

    // Prima rilevazione
    setTimeout(handleCenterDetection, 100);

    console.log("Carosello attivato.");
  }
}

// Genera i pesi da 0 a 500
for (let i = 0; i <= 500; i++) {
  const item = document.createElement("div");
  item.classList.add("carousel-item");
  item.textContent = `${i} kg`;
  items.push(item);
  carousel.appendChild(item);
}

// Duplicare gli item per l'effetto infinito
function duplicateItems() {
  const totalItems = items.length;
  items.forEach(item => {
    const clone = item.cloneNode(true);
    carousel.appendChild(clone);
  });

  // Aggiungi gli item all'inizio per un carosello ciclico
  items.reverse().forEach(item => {
    const clone = item.cloneNode(true);
    carousel.prepend(clone);
  });
}

// Rilevazione dell'elemento centrato
let currentCentered = null;
let centerTimer = null;

function getCenteredItem() {
  const items = document.querySelectorAll(".carousel-item");
  const containerRect = carousel.getBoundingClientRect();
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
      localStorage.setItem("pesoSelezionato", centered.textContent);

      centered.addEventListener("dblclick", handleDoubleClickInput);
    }, 500);
  }
}

// Gestione del doppio click per input manuale con tastierino nativo
function handleDoubleClickInput() {
  // Ottieni l'elemento di input per il peso manuale
  const inputElement = document.getElementById("manualWeightInput");

  // Mostra l'input e abilita l'interazione
  inputElement.style.opacity = "1"; // Rende visibile l'input
  inputElement.style.pointerEvents = "auto"; // Abilita l'interazione con l'input
  inputElement.focus(); // Imposta il focus sull'input
  inputElement.value = ""; // Resetta il valore dell'input

  // Funzione per gestire la conferma dell'input
  function handleInputConfirm() {
    // Converte il valore dell'input in un numero intero
    const value = parseInt(inputElement.value, 10);

    // Controlla se il valore è valido (numero tra 0 e 500)
    if (!isNaN(value) && value >= 0 && value <= 500) {
      // Ottieni tutti gli elementi del carosello
      const items = document.querySelectorAll(".carousel-item");

      // Trova l'elemento corrispondente al valore inserito
      const target = Array.from(items).find(item => item.textContent === `${value} kg`);

      // Se l'elemento esiste, scorri fino a centrarlo
      if (target) {
        target.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    } else if (inputElement.value !== "") {
      // Mostra un messaggio di errore se il valore non è valido
      alert("Inserisci un numero valido tra 0 e 500.");
    }

    // Rimuovi il focus dall'input
    inputElement.blur();

    // Nascondi l'input e disabilita l'interazione
    inputElement.style.opacity = "0"; // Rende invisibile l'input
    inputElement.style.pointerEvents = "none"; // Disabilita l'interazione con l'input

    // Rimuovi i listener per evitare duplicazioni
    inputElement.removeEventListener("blur", handleInputConfirm);
    inputElement.removeEventListener("keydown", handleKeyDown);
  }

  // Funzione per gestire la pressione del tasto "Enter"
  function handleKeyDown(e) {
    // Se il tasto premuto è "Enter", conferma l'input
    if (e.key === "Enter") {
      handleInputConfirm();
    }
  }

  // Aggiungi il listener per la perdita di focus sull'input
  inputElement.addEventListener("blur", handleInputConfirm);

  // Aggiungi il listener per la pressione dei tasti
  inputElement.addEventListener("keydown", handleKeyDown);
}

// Aggiungi il listener per il primo click/tocco
carousel.addEventListener("click", activateCarousel);

// Ripristina il peso salvato all'avvio
window.addEventListener("DOMContentLoaded", () => {
  const pesoSalvato = localStorage.getItem("pesoSelezionato");

  if (pesoSalvato) {
    const items = document.querySelectorAll(".carousel-item");
    items.forEach(item => {
      if (item.textContent === pesoSalvato) {
        item.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    });
  }

  // Duplica gli items per ottenere l'effetto di carosello infinito
  duplicateItems();
});
