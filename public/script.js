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

// initial load
loadLeaderboard();

// "realtime" updates every 5 seconds
setInterval(loadLeaderboard, 5000);
// alert("This site is in early development. Expect bugs and downtime. If you find any issues, please report them to me on Discord: Fizzy#0001");