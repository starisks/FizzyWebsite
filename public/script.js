async function login() {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const text = await res.text(); // 👈 read raw response first

  console.log("SERVER RESPONSE:", text); // 👈 DEBUG

  try {
    const data = JSON.parse(text);

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.token = data.token;
    alert("Logged in!");
  } catch (err) {
    console.error("NOT JSON RESPONSE:", text);
    alert("Server returned invalid response (not JSON)");
  }
}
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
let times = [];

async function saveSolve(time) {
  await fetch("/api/solves", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.token
    },
    body: JSON.stringify({ time, cubeType: "3x3" })
  });
}

function calculateAverage(arr) {
  if (arr.length < 3) return "N/A";

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

document.addEventListener("keydown", async (e) => {
  if (e.code === "Space") {
    if (!running) {
      startTime = Date.now();
      running = true;
    } else {
      const time = (Date.now() - startTime) / 1000;
      running = false;

      times.push(time);

      document.getElementById("timer").innerText = time.toFixed(3);
      document.getElementById("scramble").innerText = generateScramble();

      updateStats();
      await saveSolve(time);
    }
  }
});
async function loadLeaderboard() {
  const res = await fetch("/api/solves");
  const data = await res.json();

  const container = document.getElementById("leaderboard");
  container.innerHTML = "<h2>Leaderboard</h2>";

  data.forEach((s, i) => {
    container.innerHTML += `<p>#${i + 1} - ${s.time}s</p>`;
  });
}
// Smooth fade-in
document.querySelectorAll("section, .card").forEach(el => {
  el.style.opacity = 0;
  el.style.transform = "translateY(20px)";

  setTimeout(() => {
    el.style.transition = "all 0.6s ease";
    el.style.opacity = 1;
    el.style.transform = "translateY(0)";
  }, 100);
});
document.addEventListener("DOMContentLoaded", () => {
  const s = document.getElementById("scramble");
  if (s) s.innerText = generateScramble();
});
async function loadLeaderboard() {
  const res = await fetch("/api/solves");
  const data = await res.json();

  const container = document.getElementById("leaderboard");
  container.innerHTML = "";

  data.forEach((s, i) => {
    container.innerHTML += `<p>#${i + 1} - ${s.time}s</p>`;
  });
}

async function loadLeaderboard() {
  const res = await fetch("/api/solves/leaderboard");
  const data = await res.json();

  const el = document.getElementById("leaderboard");
  if (!el) return;

  el.innerHTML = data.map((u, i) => `
    <div class="card">
      <span>#${i+1}</span>
      <span>${u.bestTime.toFixed(3)}s</span>
    </div>
  `).join("");
}

setInterval(loadLeaderboard, 5000);
loadLeaderboard();
// COOKIE
function acceptCookies() {
  localStorage.setItem("cookies","yes");
  document.getElementById("cookiePopup").classList.add("hidden");
}

function declineCookies() {
  localStorage.setItem("cookies","no");
  document.getElementById("cookiePopup").classList.add("hidden");
}

// AUTH
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/auth/login", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  localStorage.setItem("token", data.token);
}

// TIMER
let startTime;

document.addEventListener("keydown", (e)=>{
  if(e.code==="Space"){
    if(!startTime){
      startTime = Date.now();
    } else {
      const time = (Date.now()-startTime)/1000;
      document.getElementById("timer").innerText = time.toFixed(3);
      saveSolve(time);
      startTime=null;
    }
  }
});

async function saveSolve(time){
  const token = localStorage.getItem("token");

  await fetch("/api/solves", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer " + token
    },
    body: JSON.stringify({ time, cubeType:"3x3" })
  });
}

// BLOG
async function loadBlog(){
  const res = await fetch("/api/blog");
  const posts = await res.json();

  const el = document.getElementById("blog");
  if(!el) return;

  el.innerHTML = posts.map(p=>`
    <div class="card">
      <h3>${p.title}</h3>
      <p>${p.content}</p>
    </div>
  `).join("");
}

setInterval(loadBlog,5000);
loadBlog();
let chart;

async function loadChart() {
  const res = await fetch("/api/solves");
  const solves = await res.json();

  const times = solves.map(s => s.time).slice(-20);

  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times.map((_, i) => i+1),
      datasets: [{
        label: "Solve Times",
        data: times
      }]
    }
  });
}

setInterval(loadChart, 5000);
loadChart();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(400, 400);

document.getElementById("cube-container").appendChild(renderer.domElement);

// Cube geometry (simple representation)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 3;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
// COOKIE
function acceptCookies() {
  localStorage.setItem("cookies", "yes");
  document.getElementById("cookiePopup").classList.add("hidden");
}

function declineCookies() {
  localStorage.setItem("cookies", "no");
  document.getElementById("cookiePopup").classList.add("hidden");
}

window.onload = () => {
  if (!localStorage.getItem("cookies")) {
    document.getElementById("cookiePopup").classList.remove("hidden");
  }
};

// BLOG LOADER (SEO friendly dynamic enhancement)
async function loadBlog() {
  const res = await fetch("/api/blog");
  const posts = await res.json();

  const el = document.getElementById("blog");

  el.innerHTML = posts.map(p => `
    <article class="card">
      <h3>${p.title}</h3>
      <p>${p.content}</p>
    </article>
  `).join("");
}

setInterval(loadBlog, 5000);
loadBlog();
// alert("This site is in early development. Expect bugs and downtime. If you find any issues, please report them to me on Discord: Fizzy#0001");