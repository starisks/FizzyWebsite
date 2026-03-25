// =====================
// GLOBAL STATE
// =====================
let startTime = null;
let running = false;
let times = [];
let chart = null;

// =====================
// AUTH (LOGIN)
// =====================
async function login(e) {
  e?.preventDefault();

  const email = document.getElementById("loginEmail")?.value;
  const password = document.getElementById("loginPassword")?.value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    localStorage.setItem("token", data.token);

    // ✅ redirect AFTER login
    window.location.href = "/timer.html";

  } catch (err) {
    console.error(err);
    alert(err.message || "Login failed");
  }
}

// =====================
// AUTH (REGISTER)
// =====================
async function register(e) {
  e?.preventDefault();

  const email = document.getElementById("regEmail")?.value;
  const password = document.getElementById("regPassword")?.value;

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    alert("Registered! Now login.");
    window.location.href = "/login.html";

  } catch (err) {
    console.error(err);
    alert(err.message || "Register failed");
  }
}

// =====================
// AUTH HELPERS
// =====================
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "/login.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

// =====================
// SCRAMBLE GENERATOR
// =====================
function generateScramble() {
  const moves = ["R", "L", "U", "D", "F", "B"];
  const mods = ["", "'", "2"];

  return Array.from({ length: 20 }, () => {
    const move = moves[Math.floor(Math.random() * moves.length)];
    const mod = mods[Math.floor(Math.random() * mods.length)];
    return move + mod;
  }).join(" ");
}

// =====================
// SAVE SOLVE
// =====================
async function saveSolve(time) {
  const token = localStorage.getItem("token");
  if (!token) return;

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
// AVERAGES
// =====================
function calculateAverage(arr) {
  if (arr.length < 5) return "N/A";

  const sorted = [...arr].sort((a, b) => a - b);
  sorted.shift();
  sorted.pop();

  return (sorted.reduce((a, b) => a + b, 0) / sorted.length).toFixed(3);
}

function updateStats() {
  const ao5 = document.getElementById("ao5");
  const ao12 = document.getElementById("ao12");

  if (ao5) ao5.innerText = "Ao5: " + calculateAverage(times.slice(-5));
  if (ao12) ao12.innerText = "Ao12: " + calculateAverage(times.slice(-12));
}

// =====================
// WCA TIMER
// =====================
let inspection = false;
let inspectionTime = 15;
let inspectionInterval;

document.addEventListener("keydown", (e) => {
  if (e.code !== "Space") return;

  if (!running && !inspection) {
    inspection = true;
    inspectionTime = 15;

    const timerEl = document.getElementById("timer");

    inspectionInterval = setInterval(() => {
      inspectionTime--;

      if (timerEl) timerEl.innerText = inspectionTime;

      if (inspectionTime === 0) timerEl.innerText = "+2";

      if (inspectionTime < -2) {
        timerEl.innerText = "DNF";
        clearInterval(inspectionInterval);
        inspection = false;
      }
    }, 1000);
  }
});

document.addEventListener("keyup", async (e) => {
  if (e.code !== "Space") return;

  if (inspection) {
    clearInterval(inspectionInterval);
    inspection = false;

    startTime = Date.now();
    running = true;
    return;
  }

  if (running) {
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
});

// =====================
// BLOG
// =====================
async function loadBlog() {
  const el = document.getElementById("blog");
  if (!el) return;

  const res = await fetch("/api/blog");
  const posts = await res.json();

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
  const el = document.getElementById("leaderboard");
  if (!el) return;

  const res = await fetch("/api/solves/leaderboard");
  const data = await res.json();

  el.innerHTML = data.map((u, i) => `
    <div class="card">
      <span>#${i + 1}</span>
      <span>${u.bestTime.toFixed(3)}s</span>
    </div>
  `).join("");
}

// =====================
// CHART
// =====================
async function loadChart() {
  const canvas = document.getElementById("chart");
  if (!canvas) return;

  const res = await fetch("/api/solves");
  const solves = await res.json();

  const data = solves.map(s => s.time).slice(-20);

  if (chart) chart.destroy();

  chart = new Chart(canvas, {
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
// 3D CUBE
// =====================
function initCube() {
  const container = document.getElementById("cube-container");
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

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
// COOKIE
// =====================
function acceptCookies() {
  localStorage.setItem("cookies", "yes");
  document.getElementById("cookiePopup")?.classList.add("hidden");
}

function declineCookies() {
  localStorage.setItem("cookies", "no");
  document.getElementById("cookiePopup")?.classList.add("hidden");
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
  loadBlog();
  loadLeaderboard();
  loadChart();
  initCube();

  const scrambleEl = document.getElementById("scramble");
  if (scrambleEl) scrambleEl.innerText = generateScramble();

  if (!localStorage.getItem("cookies")) {
    document.getElementById("cookiePopup")?.classList.remove("hidden");
  }

  // 🔥 AUTO PROTECT PAGES
  if (
    window.location.pathname.includes("timer") ||
    window.location.pathname.includes("profile") ||
    window.location.pathname.includes("stats")
  ) {
    requireAuth();
  }
});

// =====================
// INTERVALS
// =====================
setInterval(loadBlog, 10000);
setInterval(loadLeaderboard, 10000);
setInterval(loadChart, 10000);