let appData = {};

async function loadData() {
  const res = await fetch("data/data.json");
  appData = await res.json();

  renderMetrics(appData);
  renderSubscriptionTable(appData);
  renderSpendingChart(appData);       // must run before calendar so colorMap is ready
  renderUpcomingRenewals(appData);
  renderPaymentHistory(appData);
  updateCalendarWithRenewals(appData.subscriptions);
}

function renderMetrics(data) {
  const subs      = data.subscriptions;
  const active    = subs.filter(s => s.status === "Active");
  const cancelled = subs.filter(s => s.status === "Cancelled");

  const monthlyTotal = active.reduce((sum, s) => sum + s.amount, 0);
  const annualTotal  = monthlyTotal * 12;
  const savedTotal   = cancelled.reduce((sum, s) => sum + s.amount, 0);
  const categories   = new Set(active.map(s => s.category));

  document.getElementById("val-monthly").textContent      = "$" + monthlyTotal.toFixed(2);
  document.getElementById("val-active-count").textContent = active.length + " Active subscriptions";
  document.getElementById("val-annual").textContent       = "$" + annualTotal.toFixed(2);
  document.getElementById("val-active").textContent       = active.length;
  document.getElementById("val-categories").textContent   = "Across " + categories.size + " categories";
  document.getElementById("val-cancelled").textContent    = cancelled.length;
  document.getElementById("val-savings").textContent      = "Saves $" + savedTotal.toFixed(2) + " a Month";
}

function renderSubscriptionTable(data) {
  const tbody = document.getElementById("subscription-table-body");
  tbody.innerHTML = "";

  data.subscriptions.forEach(sub => {
    const isCancelled = sub.status === "Cancelled";

    const [y, m, d]  = sub.nextRenewal.split('-').map(Number);
    const renewal    = new Date(y, m - 1, d);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysAway  = (renewal - today) / (1000 * 60 * 60 * 24);
    const isDueSoon = daysAway <= 7 && daysAway >= 0;

    let statusClass = "status-active";
    let statusLabel = sub.status;

    if (!isCancelled && isDueSoon) {
      statusClass = "status-due-soon";
      statusLabel = "Due Soon";
    }

    if (isCancelled) {
      statusClass = "status-cancelled";
      statusLabel = "Cancelled";
    }

    const tr = document.createElement("tr");
    tr.className = isCancelled ? "row-cancelled" : "";

    tr.innerHTML = `
      <td>${sub.name}</td>
      <td>${sub.category}</td>
      <td>
        <span class="status-badge ${statusClass}">
          <span class="status-dot"></span>${statusLabel}
        </span>
      </td>
      <td>$${sub.amount.toFixed(2)}</td>
      <td>${sub.nextRenewal}</td>
      <td>
        ${
          isCancelled
            ? "" 
            : `<button class="btn-cancel-subscription" data-name="${sub.name}">Cancel</button>`
        }
      </td>
    `;

    tbody.appendChild(tr);
  });
}
document.addEventListener("DOMContentLoaded", loadData);


const toggleBtn = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️";
}

// Toggle click
toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  toggleBtn.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
};