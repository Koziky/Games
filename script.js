// Selectors
const cards = document.querySelectorAll(".game-card");
const modal = document.getElementById("gameModal");
const modalFrame = document.getElementById("gameFrame");
const closeModal = document.getElementById("closeModal");
const filters = document.querySelectorAll(".nav-links a");

// Open game in modal
cards.forEach(card => {
  card.addEventListener("click", () => {
    const src = card.getAttribute("data-src");
    modalFrame.src = src;
    modal.classList.remove("hidden");
  });
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modalFrame.src = ""; // reset game
});
