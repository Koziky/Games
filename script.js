document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("game-iframe");
  const buttons = document.querySelectorAll("#game-list button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const src = button.getAttribute("data-src");
      iframe.src = src;
    });
  });
});
