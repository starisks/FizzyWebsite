const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {};

// scramble generator
function scramble() {
  const moves = ["R","L","U","D","F","B"];
  const mods = ["","'","2"];
  return Array.from({length:20},()=>{
    return moves[Math.floor(Math.random()*6)] +
           mods[Math.floor(Math.random()*3)];
  }).join(" ");
}

io.on("connection", (socket) => {

  socket.on("joinRoom", (room) => {
    socket.join(room);

    if (!rooms[room]) {
      rooms[room] = {
        players: [],
        scramble: scramble()
      };
    }

    rooms[room].players.push({
      id: socket.id,
      time: null
    });

    io.to(room).emit("scramble", rooms[room].scramble);
    io.to(room).emit("roomData", rooms[room]);
  });

  socket.on("finish", ({ room, time }) => {
    const r = rooms[room];
    if (!r) return;

    const player = r.players.find(p => p.id === socket.id);
    if (player) player.time = time;

    io.to(room).emit("playerFinished", r);
  });

  socket.on("disconnect", () => {
    for (const room in rooms) {
      rooms[room].players =
        rooms[room].players.filter(p => p.id !== socket.id);

      io.to(room).emit("roomData", rooms[room]);
    }
  });

});

server.listen(3001, () => {
  console.log("Socket server running on port 3001");
});