document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("gameModal");
  const gameFrame = document.getElementById("gameFrame");
  const closeBtn = document.querySelector(".close");
  const searchBar = document.getElementById("searchBar");

  // Open modal when clicking a game
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

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      gameFrame.src = "";
    }
  });

  // Category filter
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

  // Search filter
  searchBar.addEventListener("input", () => {
    const search = searchBar.value.toLowerCase();
    document.querySelectorAll(".game-card").forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = title.includes(search) ? "block" : "none";
    });
  });
});
