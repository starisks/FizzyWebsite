async function loadData() {
  const res = await fetch("/api/solves/user", {
    headers: {
      Authorization: localStorage.token
    }
  });

  return await res.json();
}

async function renderChart() {
  const data = await loadData();

  const times = data.map(s => s.time);
  const labels = data.map((_, i) => i + 1);

  new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Solve Times",
        data: times
      }]
    }
  });
}

renderChart();