document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("gameModal");
  const gameFrame = document.getElementById("gameFrame");
  const closeBtn = document.querySelector(".close");

  // Open modal on card click
  document.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => {
      const src = card.getAttribute("data-src");
      if (src) {
        gameFrame.src = src;
        modal.style.display = "flex";
      }
    });

    // Check release date for "NEW" badge
    const releaseDate = new Date(card.getAttribute("data-release"));
    const now = new Date();
    const daysSinceRelease = (now - releaseDate) / (1000 * 60 * 60 * 24);

    if (daysSinceRelease <= 7) {
      card.querySelector(".badge-new").style.display = "inline-block";
    }
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    gameFrame.src = ""; // stop the game
  });

  // Close modal if clicking outside iframe
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      gameFrame.src = "";
    }
  });
});
