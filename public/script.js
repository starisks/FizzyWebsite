
// =====================
// GLOBAL STATE
// =====================
let startTime = null;
let running = false;
let times = [];
let chart;

// =====================
// AUTH (LOGIN)
// =====================
async function login() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const text = await res.text();

  try {
    const data = JSON.parse(text);

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    alert("Logged in!");
  } catch {
    console.error("NOT JSON RESPONSE:", text);
    alert("Server error");
  }
}

// =====================
// SCRAMBLE GENERATOR
// =====================
function generateScramble() {
  const moves = ["R", "L", "U", "D", "F", "B"];
  const mods = ["", "'", "2"];
  let scramble = "";

  for (let i = 0; i < 20; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)];
    const mod = mods[Math.floor(Math.random() * mods.length)];
    scramble += move + mod + " ";
  }

  return scramble;
}

// =====================
// SAVE SOLVE
// =====================
async function saveSolve(time) {
  const token = localStorage.getItem("token");

  await fetch("/api/solves", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ time, cubeType: "3x3" })
  });
}

// =====================
// AVERAGES (AO5 / AO12)
// =====================
function calculateAverage(arr) {
  if (arr.length < 5) return "N/A";

  const sorted = [...arr].sort((a, b) => a - b);
  sorted.pop();
  sorted.shift();

  return (sorted.reduce((a, b) => a + b, 0) / sorted.length).toFixed(3);
}

function updateStats() {
  document.getElementById("ao5").innerText =
    "Ao5: " + calculateAverage(times.slice(-5));

  document.getElementById("ao12").innerText =
    "Ao12: " + calculateAverage(times.slice(-12));
}

// =====================
// TIMER (WCA STYLE)
// =====================
document.addEventListener("keydown", async (e) => {
  if (e.code === "Space") {
    if (!running) {
      startTime = Date.now();
      running = true;
    } else {
      const time = (Date.now() - startTime) / 1000;
      running = false;

      times.push(time);

      const timerEl = document.getElementById("timer");
      if (timerEl) timerEl.innerText = time.toFixed(3);

      const scrambleEl = document.getElementById("scramble");
      if (scrambleEl) scrambleEl.innerText = generateScramble();

      updateStats();
      await saveSolve(time);

      updateChart();
    }
  }
});

// =====================
// BLOG LOADER
// =====================
async function loadBlog() {
  const res = await fetch("/api/blog");
  const posts = await res.json();

  const el = document.getElementById("blog");
  if (!el) return;

  el.innerHTML = posts.map(p => `
    <article class="card">
      <h3>${p.title}</h3>
      <p>${p.content}</p>
    </article>
  `).join("");
}

// =====================
// LEADERBOARD
// =====================
async function loadLeaderboard() {
  const res = await fetch("/api/solves/leaderboard");
  const data = await res.json();

  const el = document.getElementById("leaderboard");
  if (!el) return;

  el.innerHTML = data.map((u, i) => `
    <div class="card">
      <span>#${i + 1}</span>
      <span>${u.bestTime.toFixed(3)}s</span>
    </div>
  `).join("");
}

// =====================
// COOKIE POPUP
// =====================
function acceptCookies() {
  localStorage.setItem("cookies", "yes");
  document.getElementById("cookiePopup")?.classList.add("hidden");
}

function declineCookies() {
  localStorage.setItem("cookies", "no");
  document.getElementById("cookiePopup")?.classList.add("hidden");
}

window.onload = () => {
  if (!localStorage.getItem("cookies")) {
    document.getElementById("cookiePopup")?.classList.remove("hidden");
  }
};

// =====================
// CHART (Chart.js)
// =====================
async function loadChart() {
  const res = await fetch("/api/solves");
  const solves = await res.json();

  const data = solves.map(s => s.time).slice(-20);

  const ctx = document.getElementById("chart");
  if (!ctx) return;

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_, i) => i + 1),
      datasets: [{
        label: "Solve Times",
        data: data
      }]
    }
  });
}

function updateChart() {
  loadChart();
}

// =====================
// 3D CUBE (Three.js)
// =====================
function initCube() {
  const container = document.getElementById("cube-container");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 400/400, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(400, 400);

  container.appendChild(renderer.domElement);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({ wireframe: true })
  );

  scene.add(cube);
  camera.position.z = 3;

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
}

// =====================
// INITIAL LOAD
// =====================
document.addEventListener("DOMContentLoaded", () => {
  loadBlog();
  loadLeaderboard();
  loadChart();
  initCube();

  const scrambleEl = document.getElementById("scramble");
  if (scrambleEl) scrambleEl.innerText = generateScramble();
});

// refresh periodically
setInterval(loadBlog, 5000);
setInterval(loadLeaderboard, 5000);
setInterval(loadChart, 5000);

// =====================
// EXPORTS (for testing)
// =====================
// This website is mostly frontend, but we export some functions for testing purposes,
// even though they aren't used directly in the HTML., this website is in early stages / beta
// expect some bugs and missing features. If you want to contribute, check out the GitHub repo!