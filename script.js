// Game filtering
const cards = document.querySelectorAll(".game-card");
const modal = document.getElementById("gameModal");
const modalFrame = document.getElementById("gameFrame");
const closeModal = document.getElementById("closeModal");
const filters = document.querySelectorAll(".nav-center a");
const searchBar = document.getElementById("searchBar");

// Category filtering
filters.forEach(filter => {
  filter.addEventListener("click", (e) => {
    e.preventDefault();
    const category = filter.getAttribute("data-category");

    cards.forEach(card => {
      if (category === "all" || card.getAttribute("data-category") === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Search filtering
searchBar.addEventListener("keyup", () => {
  const searchTerm = searchBar.value.toLowerCase();
  cards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    if (title.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

// Modal open
cards.forEach(card => {
  card.addEventListener("click", () => {
    const src = card.getAttribute("data-src");
    modalFrame.src = src;
    modal.classList.remove("hidden");
  });
});

// Modal close
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modalFrame.src = "";
});
