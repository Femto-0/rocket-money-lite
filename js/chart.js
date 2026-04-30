const CATEGORY_COLORS = [
  '#FF6384', 
  '#36A2EB', 
  '#FFCE56', 
  '#4BC0C0', 
  '#9966FF', 
  '#FF9F40', 
  '#C9CBCF', 
];

window.categoryColorMap = {};

// Sync Chart.js text colors with dark/light mode
function updateChartDefaults() {
  const isDark = document.body.classList.contains('dark-mode');
  const textColor = isDark ? '#e0e0e0' : '#666';

  Chart.defaults.color = textColor;
}

function renderSpendingChart(data) {
  updateChartDefaults();
  const container = document.getElementById("spending-chart");
  container.innerHTML = ""; // IMPORTANT: prevent duplicate canvases

  const canvas = document.createElement("canvas");
  container.appendChild(canvas);

  const categoryTotals = {};

  data.subscriptions.forEach(sub => {

    if (sub.status === "Cancelled") return;

    categoryTotals[sub.category] =
      (categoryTotals[sub.category] || 0) + sub.amount;
  });

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  labels.forEach((label, i) => {
    window.categoryColorMap[label] =
      CATEGORY_COLORS[i % CATEGORY_COLORS.length];
  });

  new Chart(canvas, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: labels.map(l => window.categoryColorMap[l]),
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true
    }
  });

  canvas.onclick = () => openFullScreenChart(labels, values);
}

let fullChartInstance = null;

function openFullScreenChart(labels, values) {
  const modal = document.getElementById("chart-modal");
  const canvas = document.getElementById("fullscreen-chart");

  const colors = labels.map(l => window.categoryColorMap[l]);

  modal.classList.remove("hidden");

  if (fullChartInstance) {
    fullChartInstance.destroy();
  }

  fullChartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Spending ($)",
        data: values,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

document.getElementById("close-modal").onclick = () => {
  document.getElementById("chart-modal").classList.add("hidden");
};

document.querySelector(".modal-backdrop").onclick = () => {
  document.getElementById("chart-modal").classList.add("hidden");
};