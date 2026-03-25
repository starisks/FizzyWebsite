const socket = io("http://localhost:3001"); // auto connect

let room = null;
let startTime = null;
let running = false;

// =====================
// JOIN ROOM
// =====================
function joinRoom() {
  room = document.getElementById("roomInput").value;

  socket.emit("joinRoom", room);

  socket.on("roomData", updatePlayers);
  socket.on("scramble", setScramble);
  socket.on("playerFinished", updatePlayers);
}

// =====================
// SCRAMBLE
// =====================
function setScramble(scramble) {
  document.getElementById("scramble").innerText = scramble;
}

// =====================
// PLAYER LIST
// =====================
function updatePlayers(data) {
  const el = document.getElementById("players");

  el.innerHTML = data.players.map(p => `
    <div class="card">
      <span>${p.id.slice(0,5)}</span>
      <span>${p.time ? p.time.toFixed(3)+"s" : "⏳"}</span>
    </div>
  `).join("");
}

// =====================
// TIMER
// =====================
document.addEventListener("keydown", (e)=>{
  if(e.code !== "Space") return;

  if(!running){
    startTime = Date.now();
    running = true;
  } else {
    const time = (Date.now() - startTime)/1000;
    running = false;

    document.getElementById("timer").innerText = time.toFixed(3);

    socket.emit("finish", { room, time });
  }
});