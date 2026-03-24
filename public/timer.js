let startTime = null;
let solves = [];

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (!startTime) {
      startTime = Date.now();
    } else {
      const time = (Date.now() - startTime) / 1000;
      startTime = null;

      solves.push(time);

      document.getElementById("timer").innerText = time.toFixed(3);

      updateStats();
      saveSolve(time);
      updateChart();
    }
  }
});

function avg(arr) {
  if (arr.length < 5) return null;
  let sorted = [...arr].sort((a,b)=>a-b).slice(1,-1);
  return (sorted.reduce((a,b)=>a+b,0)/sorted.length).toFixed(3);
}

function updateStats() {
  document.getElementById("ao5").innerText = "Ao5: " + avg(solves.slice(-5));
  document.getElementById("ao12").innerText = "Ao12: " + avg(solves.slice(-12));
}

async function saveSolve(time) {
  const token = localStorage.getItem("token");

  await fetch("/api/solves", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer " + token
    },
    body: JSON.stringify({ time })
  });
}

// CHART
let chart;

function updateChart() {
  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: solves.map((_,i)=>i+1),
      datasets: [{
        label: "Solve Times",
        data: solves
      }]
    }
  });
}

// 3D CUBE (basic)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 400/400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(400,400);

document.getElementById("cube-container").appendChild(renderer.domElement);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ wireframe:true })
);

scene.add(cube);
camera.position.z = 3;

function animate(){
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene,camera);
}
animate();  