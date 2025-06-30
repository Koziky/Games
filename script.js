document.addEventListener("DOMContentLoaded", () => {
  // ===== Particle Background =====
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles = [];
  const connectDist = 100;
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.7,
      dy: (Math.random() - 0.5) * 0.7,
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
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
        if (dist < connectDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(109,130,255,${1 - dist / connectDist})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ===== ScriptBlox Script Hub =====
  const CORS_PROXY = "https://corsproxy.io/?";
  const API_BASE = "https://scriptblox.com/api/script";
  const scriptsContainer = document.getElementById("scriptsContainer");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const trendingBtn = document.getElementById("trendingBtn");
  const notification = document.getElementById("notification");
  const pageIndicator = document.getElementById("pageIndicator");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");

  let mode = "fetch"; // fetch | search | trending
  let query = "";
  let page = 1;
  const scriptsPerPage = 4;

  function setNotification(msg) {
    notification.textContent = msg;
  }

  async function fetchScripts() {
    setNotification("Loading...");
    scriptsContainer.innerHTML = "";

    let endpoint = "";
    if (mode === "fetch") {
      endpoint = `${API_BASE}/fetch?page=${page}&max=${scriptsPerPage}`;
    } else if (mode === "search") {
      endpoint = `${API_BASE}/search?q=${encodeURIComponent(query)}&page=${page}&max=${scriptsPerPage}`;
    } else if (mode === "trending") {
      endpoint = `${API_BASE}/trending?max=${scriptsPerPage}`;
    }

    try {
      const res = await fetch(`${CORS_PROXY}${endpoint}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();

      const scripts = data.result?.scripts || [];

      if (!scripts.length) {
        setNotification("No scripts found.");
        pageIndicator.textContent = "";
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        return;
      }

      renderScripts(scripts);

      if (mode === "trending") {
        pageIndicator.textContent = `Trending (${scripts.length})`;
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
      } else {
        const totalPages = data.result?.totalPages || 1;
        pageIndicator.textContent = `Page ${page} of ${totalPages}`;
        prevPageBtn.disabled = page <= 1;
        nextPageBtn.disabled = page >= totalPages;
      }

      setNotification("");
    } catch (err) {
      console.error(err);
      setNotification("Failed to fetch scripts.");
      pageIndicator.textContent = "";
      prevPageBtn.disabled = true;
      nextPageBtn.disabled = true;
    }
  }

  function renderScripts(scripts) {
    scriptsContainer.innerHTML = "";
    scripts.forEach(script => {
      const card = document.createElement("div");
      card.className = "script-card";
      card.innerHTML = `
        <h4>${script.title}</h4>
        <p>${script.game?.name || "Unknown Game"}</p>
        <button class="btn small">Copy Script</button>
      `;

      const copyBtn = card.querySelector("button");
      copyBtn.addEventListener("click", async () => {
        try {
          const rawRes = await fetch(`${CORS_PROXY}${API_BASE}/raw/${script._id}`);
          if (!rawRes.ok) throw new Error(`HTTP error ${rawRes.status}`);

          const scriptText = await rawRes.text();
          await navigator.clipboard.writeText(scriptText);
          alert(`Script "${script.title}" copied to clipboard!`);
        } catch (err) {
          alert("Failed to copy script.");
        }
      });

      scriptsContainer.appendChild(card);
    });
  }

  searchBtn.addEventListener("click", () => {
    query = searchInput.value.trim();
    if (!query) return;
    mode = "search";
    page = 1;
    fetchScripts();
  });

  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  prevPageBtn.addEventListener("click", () => {
    if (page > 1) {
      page--;
      fetchScripts();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    page++;
    fetchScripts();
  });

  trendingBtn.addEventListener("click", () => {
    mode = "trending";
    page = 1;
    fetchScripts();
  });

  // Initial load
  fetchScripts();
});
