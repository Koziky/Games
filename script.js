// Category Filtering
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".nav-links button");
  const cards = document.querySelectorAll(".game-card");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class
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
});
