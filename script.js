document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("gameModal");
  const gameFrame = document.getElementById("gameFrame");
  const closeBtn = document.querySelector(".close");

  // Open modal on card click
  document.querySelectorAll(".game-card").forEach(card => {
    card.addEventListener("click", () => {
      const gameId = card.getAttribute("data-src");
      let affiliateId = "A1000-10";
      if (affiliateId === "A1000-10") {
        affiliateId += (Math.random() >= 0.5) ? "A" : "B";
      }
      gameFrame.src = `https://play.famobi.com/${gameId}/${affiliateId}`;
      modal.style.display = "flex";
    });
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    gameFrame.src = ""; // stop game when closing
  });

  // Close on outside click
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
      gameFrame.src = "";
    }
  });

  // Category filtering
  document.querySelectorAll("nav button").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      document.querySelectorAll(".game-card").forEach(card => {
        if (category === "all" || card.getAttribute("data-category") === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});
