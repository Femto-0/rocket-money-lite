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

function renderSpendingChart(data) {
  const container = document.getElementById("spending-chart");
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);

  const categoryTotals = {};
  data.subscriptions.forEach(sub => {
    categoryTotals[sub.category] =
      (categoryTotals[sub.category] || 0) + sub.amount;
  });

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  labels.forEach((label, i) => {
    window.categoryColorMap[label] = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
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

function openFullScreenChart(labels, values) {
  const colors = labels.map(l => window.categoryColorMap[l]);
  const win = window.open("", "_blank");
  win.document.write(`
    <html>
    <head>
      <title>Spending Breakdown</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
    </head>
    <body style="padding:40px;">
      <canvas id="chart"></canvas>
      <script>
        new Chart(document.getElementById("chart"), {
          type: "bar",
          data: {
            labels: ${JSON.stringify(labels)},
            datasets: [{
              label: "Spending ($)",
              data: ${JSON.stringify(values)},
              backgroundColor: ${JSON.stringify(colors)}
            }]
          }
        });
      <\/script>
    </body>
    </html>
  `);
}
