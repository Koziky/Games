// Game Data (using free thumbnail placeholders)
const games = [
  {
    title: "Cars Arena",
    category: "cars",
    thumbnail: "https://via.placeholder.com/400x200/111111/ffffff?text=Cars+Arena",
    url: "https://ubg77.github.io/edit/cars-arena/"
  },
  {
    title: "Bubble Tower 3D",
    category: "tower",
    thumbnail: "https://via.placeholder.com/400x200/222222/ffffff?text=Bubble+Tower+3D",
    url: "https://ubg77.github.io/edit/bubble-tower-3d/"
  },
  {
    title: "Run Sausage Run",
    category: "running",
    thumbnail: "https://via.placeholder.com/400x200/333333/ffffff?text=Run+Sausage+Run",
    url: "https://ubg77.github.io/edit/run-sausage-run/"
  }
];

// Render Games
function renderGames(filter = "all", search = "") {
  const grid = document.getElementById("gameGrid");
  grid.innerHTML = "";

  const filtered = games.filter(game =>
    (filter === "all" || game.category === filter) &&
    game.title.toLowerCase().includes(search.toLowerCase())
  );

  filtered.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.innerHTML = `
      <img src="${game.thumbnail}" alt="${game.title}">
      <h3>${game.title}</h3>
    `;
    card.onclick = () => openGame(game);
    grid.appendChild(card);
  });
}

// Open Game in Modal
function openGame(game) {
  const modal = document.getElementById("gameModal");
  const frame = document.getElementById("gameFrame");
  const title = document.getElementById("gameTitle");

  frame.src = game.url;
  title.textContent = game.title;

  modal.classList.remove("hidden");
}

// Close Game
function closeGame() {
  const modal = document.getElementById("gameModal");
  const frame = document.getElementById("gameFrame");

  modal.classList.add("hidden");
  frame.src = "";
}

// Event Listeners
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const category = link.getAttribute("data-category");
    renderGames(category, document.getElementById("searchInput").value);
  });
});

document.getElementById("searchInput").addEventListener("input", e => {
  renderGames("all", e.target.value);
});

// Initial Render
renderGames();
