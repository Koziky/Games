// Simple demo script for progress bar
document.addEventListener("DOMContentLoaded", () => {
  const progress = document.querySelector(".braflix-progress-indicator");

  let percent = 40;
  setInterval(() => {
    percent = (percent + 10) % 110;
    progress.style.width = percent + "%";
  }, 2000);
});
