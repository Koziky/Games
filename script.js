document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("gameModal");
  const gameFrame = document.getElementById("gameFrame");
  const closeBtn = document.querySelector(".close");

  // Open game on card click
  document.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => {
      const src = card.getAttribute("data-src");
      if (src) {
        gameFrame.src = src;
        modal.style.display = "flex";
      }
    });
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    gameFrame.src = "";
  });

  // Close if clicking outside iframe
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      gameFrame.src = "";
    }
  });
});
