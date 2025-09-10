// Category Filtering
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav-links button");
  const cards = document.querySelectorAll(".game-card");
  const modal = document.getElementById("gameModal");
  const modalFrame = document.getElementById("modalGameFrame");
  const closeBtn = document.getElementById("closeModal");

  // Filtering
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.getAttribute("data-category");

      cards.forEach(card => {
        if (category === "all" || card.getAttribute("data-category") === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Open modal with game
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const src = card.getAttribute("data-src");
      modalFrame.src = src;
      modal.classList.remove("hidden");
    });
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    modalFrame.src = ""; // stop game
  });
});
