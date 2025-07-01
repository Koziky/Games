document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const particles = [];
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
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(109,130,255,${1 - dist / 100})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  const CORS = "https://corsproxy.io/?";
  const API = "https://scriptblox.com/api/script";
  const container = document.getElementById("scriptsContainer");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const trendingBtn = document.getElementById("trendingBtn");
  const advancedBtn = document.getElementById("advancedBtn");
  const notification = document.getElementById("notification");
  const pageIndicator = document.getElementById("pageIndicator");
  const prevBtn = document.getElementById("prevPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");

  const advPanel = document.getElementById("advancedPanel");
  const filterKey = document.getElementById("filterKey");
  const filterVerified = document.getElementById("filterVerified");
  const filterUniversal = document.getElementById("filterUniversal");
  const applyFilters = document.getElementById("applyFilters");

  const popupOverlay = document.getElementById("popupOverlay");
  const popupClose = document.getElementById("popupClose");
  const popupTitle = document.getElementById("popupTitle");
  const popupImage = document.getElementById("popupImage");
  const popupDate = document.getElementById("popupDate");
  const popupViews = document.getElementById("popupViews");
  const popupCopyBtn = document.getElementById("popupCopyBtn");

  popupClose.onclick = () => {
    popupOverlay.style.display = "none";
  };

  advancedBtn.addEventListener("click", () => {
    advPanel.style.display = advPanel.style.display === "flex" ? "none" : "flex";
  });

  let page = 1;
  const perPage = 4;
  let mode = "fetch";
  let query = "";

  function setNotification(text) {
    notification.textContent = text;
    notification.classList.toggle("loading", text === "Loading...");
  }

  async function load() {
    setNotification("Loading...");
    container.innerHTML = "";

    let url;
    if (mode === "fetch") {
      url = `${API}/fetch?page=${page}&max=${perPage}`;
    } else {
      const filters = [];
      if (filterKey.checked) filters.push("key=1");
      if (filterVerified.checked) filters.push("verified=1");
      if (filterUniversal.checked) filters.push("universal=1");
      const filterStr = filters.length ? `&${filters.join("&")}` : "";
      url = `${API}/search?q=${encodeURIComponent(query)}&page=${page}&max=${perPage}${filterStr}`;
    }

    try {
      const res = await fetch(CORS + url);
      const data = await res.json();
      const list = data.result?.scripts || [];

      if (!list.length) {
        setNotification("No scripts found.");
        pageIndicator.textContent = "";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
      }

      render(list);

      const total = data.result?.totalPages ?? 1;
      pageIndicator.textContent = `Page ${page} of ${total}`;
      prevBtn.disabled = page <= 1;
      nextBtn.disabled = page >= total;
      setNotification("");
    } catch (error) {
      console.error("Fetch error:", error);
      setNotification("Failed to fetch scripts. Please try again.");
    }
  }

  function render(list) {
    container.innerHTML = "";
    list.forEach(s => {
      const card = document.createElement("div");
      card.className = "script-card";
      card.innerHTML = `
        <h4>${s.title || "Untitled Script"}</h4>
        <p>${s.game?.name || "Universal Script"}</p>
        <div class="bottom-row">
          <span class="key-status ${s.key ? 'has-key' : ''}">
            ${s.key ? '🔒 Key Required' : '✅ No Key'}
          </span>
        </div>
      `;
      card.addEventListener("click", () => {
        popupOverlay.style.display = "flex";
        popupTitle.textContent = s.title || "Untitled Script";
        popupImage.src = s.image || "https://via.placeholder.com/100";
        popupDate.textContent = new Date(s.createdAt).toLocaleDateString();
        popupViews.textContent = s.views ?? 0;

        popupCopyBtn.textContent = "Copy Script";
        popupCopyBtn.disabled = false;
        popupCopyBtn.onclick = async () => {
          try {
            popupCopyBtn.textContent = "Copying...";
            popupCopyBtn.disabled = true;

            const raw = await fetch(CORS + `${API}/raw/${s._id}`);
            const text = await raw.text();
            await navigator.clipboard.writeText(text);

            popupCopyBtn.textContent = "Copied!";
            setTimeout(() => {
              popupCopyBtn.textContent = "Copy Script";
              popupCopyBtn.disabled = false;
            }, 2000);
          } catch (e) {
            console.error(e);
            popupCopyBtn.textContent = "Copy Failed";
          }
        };
      });
      container.appendChild(card);
    });
  }

  searchBtn.addEventListener("click", () => {
    query = searchInput.value.trim();
    if (!query) {
      setNotification("Please enter a search term.");
      return;
    }
    mode = "search";
    page = 1;
    load();
  });

  trendingBtn.addEventListener("click", () => {
    query = "";
    searchInput.value = "";
    mode = "fetch";
    page = 1;
    load();
  });

  applyFilters.addEventListener("click", () => {
    query = searchInput.value.trim();
    mode = "search";
    page = 1;
    advPanel.style.display = "none";
    load();
  });

  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") searchBtn.click();
  });

  prevBtn.addEventListener("click", () => {
    if (page > 1) {
      page--;
      load();
    }
  });

  nextBtn.addEventListener("click", () => {
    page++;
    load();
  });

  load();
});
