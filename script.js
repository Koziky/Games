// ===== Particle Background =====
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

const particles = [];
const connectionDistance = 100;

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.7,
    dy: (Math.random() - 0.5) * 0.7,
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#6d82ff";
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < connectionDistance) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(109,130,255, ${1 - dist / connectionDistance})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  resizeCanvas();
  renderScripts();
});

// ===== Script Hub =====
const scripts = [
  {
    name: "Infinite Yield",
    description: "Powerful admin commands for Roblox.",
    code: `loadstring(game:HttpGet("https://infiniteyield.xyz"))()`,
  },
  {
    name: "Dex Explorer",
    description: "Game exploration and manipulation tool.",
    code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/ScriptExplorer/Dex/master/Dex.lua"))()`,
  },
  {
    name: "Simple Spy",
    description: "Remote spy to check remote calls.",
    code: `loadstring(game:HttpGet("https://raw.githubusercontent.com/Spy-Simple/Spy/master/SimpleSpy.lua"))()`,
  },
  {
    name: "CMD-X",
    description: "Command executor with lots of commands.",
    code: `loadstring(game:HttpGet("https://pastebin.com/raw/cmdx"))()`,
  },
  {
    name: "JJSploit",
    description: "Classic script executor with GUI.",
    code: `loadstring(game:HttpGet("https://jjsploit.com/script"))()`,
  },
];

const scriptsContainer = document.getElementById("scriptsContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const notification = document.getElementById("notification");
const pageIndicator = document.getElementById("pageIndicator");

const nextPageBtn = document.getElementById("nextPageBtn");
const prevPageBtn = document.getElementById("prevPageBtn");

let currentPage = 1;
const scriptsPerPage = 3;
let filteredScripts = [...scripts];

function renderScripts() {
  scriptsContainer.innerHTML = "";
  notification.textContent = "";

  const startIndex = (currentPage - 1) * scriptsPerPage;
  const endIndex = startIndex + scriptsPerPage;
  const pageScripts = filteredScripts.slice(startIndex, endIndex);

  if (pageScripts.length === 0) {
    notification.textContent = "No scripts found.";
    return;
  }

  pageScripts.forEach(script => {
    const card = document.createElement("div");
    card.className = "script-card";

    const btn = document.createElement("button");
    btn.className = "btn small";
    btn.textContent = "Copy";
    btn.onclick = () => {
      navigator.clipboard.writeText(script.code);
      alert(`Copied ${script.name} to clipboard!`);
    };

    card.innerHTML = `
      <h4>${script.name}</h4>
      <p>${script.description}</p>
    `;
    card.appendChild(btn);
    scriptsContainer.appendChild(card);
  });

  const totalPages = Math.ceil(filteredScripts.length / scriptsPerPage);
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
}

function searchScripts() {
  const query = searchInput.value.trim().toLowerCase();
  filteredScripts = scripts.filter(script =>
    script.name.toLowerCase().includes(query) ||
    script.description.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderScripts();
}

function goToNextPage() {
  const totalPages = Math.ceil(filteredScripts.length / scriptsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderScripts();
  }
}

function goToPrevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderScripts();
  }
}

searchBtn?.addEventListener("click", searchScripts);
searchInput?.addEventListener("keypress", e => {
  if (e.key === "Enter") searchScripts();
});

nextPageBtn?.addEventListener("click", goToNextPage);
prevPageBtn?.addEventListener("click", goToPrevPage);

renderScripts();
