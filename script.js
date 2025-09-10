// Open Game in Modal
function openGame(title, url) {
  const modal = document.getElementById("gameModal");
  const frame = document.getElementById("gameFrame");
  const titleEl = document.getElementById("gameTitle");

  frame.src = url;
  titleEl.textContent = title;

  modal.classList.remove("hidden");
}

// Close Game
function closeGame() {
  const modal = document.getElementById("gameModal");
  const frame = document.getElementById("gameFrame");

  modal.classList.add("hidden");
  frame.src = "";
}

// Attach click to all game cards
document.querySelectorAll(".game-card").forEach(card => {
  card.addEventListener("click", () => {
    openGame(card.querySelector("h3").textContent, card.getAttribute("data-url"));
  });
});

// Category filter
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const category = link.getAttribute("data-category");
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
document.getElementById("searchInput").addEventListener("input", e => {
  const search = e.target.value.toLowerCase();
  document.querySelectorAll(".game-card").forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(search) ? "block" : "none";
  });
});
