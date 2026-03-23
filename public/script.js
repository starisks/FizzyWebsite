// -------------------- COOKIE --------------------
if (localStorage.cookies === undefined) {
  document.getElementById("cookie-popup").style.display = "block";
}

function setCookie(choice) {
  localStorage.cookies = choice;
  document.getElementById("cookie-popup").style.display = "none";
}

// -------------------- AUTH --------------------
async function login() {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();
  localStorage.token = data.token;
  alert("Logged in!");
}

async function register() {
  await fetch("/api/auth/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  });

  alert("Registered!");
}

// -------------------- TIMER --------------------
let running = false;
let startTime;
let inspection = false;
let inspectionTime = 15;

document.addEventListener("keydown", async (e) => {
  if (e.code === "Space") {
    if (!inspection && !running) {
      inspection = true;
      let countdown = setInterval(() => {
        inspectionTime--;
        document.getElementById("inspection").innerText = inspectionTime;

        if (inspectionTime <= 0) {
          clearInterval(countdown);
          inspection = false;
        }
      }, 1000);
    } else if (!running) {
      startTime = Date.now();
      running = true;
    } else {
      const time = (Date.now() - startTime) / 1000;
      document.getElementById("timer").innerText = time.toFixed(3);
      running = false;

      await fetch("/api/solves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.token
        },
        body: JSON.stringify({ time, cubeType: "3x3" })
      });
    }
  }
});

// -------------------- LEADERBOARD --------------------
async function loadLeaderboard() {
  const res = await fetch("/api/solves/leaderboard");
  const data = await res.json();

  const container = document.getElementById("leaderboard");
  container.innerHTML = "<h2>Leaderboard</h2>";

  data.forEach(s => {
    container.innerHTML += `<p>${s.time}s</p>`;
  });
}