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

  new Chart(canvas, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: values
      }]
    }
  });

  canvas.onclick = () => openFullScreenChart(labels, values);
}

// FULL SCREEN VIEW
function openFullScreenChart(labels, values) {
  const win = window.open("", "_blank");

  win.document.write(`
    <html>
    <head>
      <title>Spending Breakdown</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
      <canvas id="chart"></canvas>
      <script>
        new Chart(document.getElementById("chart"), {
          type: "bar",
          data: {
            labels: ${JSON.stringify(labels)},
            datasets: [{
              label: "Spending",
              data: ${JSON.stringify(values)}
            }]
          }
        });
      </script>
    </body>
    </html>
  `);
}1