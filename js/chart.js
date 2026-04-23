<<<<<<< HEAD
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
=======
function renderSpendingChart(data) {
  const container = document.getElementById("spending-chart");

>>>>>>> bcac4032391a82873c438ba18645e4b3060704ed
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);

  const categoryTotals = {};
<<<<<<< HEAD
=======

>>>>>>> bcac4032391a82873c438ba18645e4b3060704ed
  data.subscriptions.forEach(sub => {
    categoryTotals[sub.category] =
      (categoryTotals[sub.category] || 0) + sub.amount;
  });

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

<<<<<<< HEAD
  labels.forEach((label, i) => {
    window.categoryColorMap[label] = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
  });

=======
>>>>>>> bcac4032391a82873c438ba18645e4b3060704ed
  new Chart(canvas, {
    type: "pie",
    data: {
      labels,
      datasets: [{
<<<<<<< HEAD
        data: values,
        backgroundColor: labels.map(l => window.categoryColorMap[l]),
      }]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true
=======
        data: values
      }]
>>>>>>> bcac4032391a82873c438ba18645e4b3060704ed
    }
  });

  canvas.onclick = () => openFullScreenChart(labels, values);
}

<<<<<<< HEAD
function openFullScreenChart(labels, values) {
  const colors = labels.map(l => window.categoryColorMap[l]);
  const win = window.open("", "_blank");
=======
// FULL SCREEN VIEW
function openFullScreenChart(labels, values) {
  const win = window.open("", "_blank");

>>>>>>> bcac4032391a82873c438ba18645e4b3060704ed
  win.document.write(`
    <html>
    <head>
      <title>Spending Breakdown</title>
<<<<<<< HEAD
      <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
    </head>
    <body style="padding:40px;">
=======
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </head>
    <body>
>>>>>>> bcac4032391a82873c438ba18645e4b3060704ed
      <canvas id="chart"></canvas>
      <script>
        new Chart(document.getElementById("chart"), {
          type: "bar",
          data: {
            labels: ${JSON.stringify(labels)},
            datasets: [{
<<<<<<< HEAD
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
=======
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
>>>>>>> bcac4032391a82873c438ba18645e4b3060704ed
