let appData = {};

const CURRENCY_RATES = {
  "$":  { rate: 1,       label: "USD – US Dollar"  },
  "€":  { rate: 0.86,    label: "EUR – Euro"        },
  "£":  { rate: 0.74,    label: "GBP – Pound"       },
  "¥J": { rate: 160.28,  label: "JPY – Yen"         },
  "¥C": { rate: 6.84,    label: "CNY – Yuan"        },
};

window.activeCurrency = { symbol: "$", key: "$" };

// USD to others converter
function convertAmount(usdAmount) {
  const rate = CURRENCY_RATES[window.activeCurrency.key]?.rate || 1;
  return usdAmount * rate;
}

function fmt(usdAmount) {
  const sym = window.activeCurrency.symbol;
  return sym + convertAmount(usdAmount).toFixed(2);
}

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

function refreshAmounts() {
  renderMetrics(appData);
  renderSubscriptionTable(appData);
  renderUpcomingRenewals(appData);
  renderPaymentHistory(appData);
}

function renderMetrics(data) {
  const subs      = data.subscriptions;
  const active    = subs.filter(s => s.status === "Active");
  const cancelled = subs.filter(s => s.status === "Cancelled");

  const monthlyUSD = active.reduce((sum, s) => sum + s.amount, 0);
  const annualUSD  = monthlyUSD * 12;
  const savedUSD   = cancelled.reduce((sum, s) => sum + s.amount, 0);
  const categories = new Set(active.map(s => s.category));

  document.getElementById("val-monthly").textContent      = fmt(monthlyUSD);
  document.getElementById("val-active-count").textContent = active.length + " Active subscriptions";
  document.getElementById("val-annual").textContent       = fmt(annualUSD);
  document.getElementById("val-active").textContent       = active.length;
  document.getElementById("val-categories").textContent   = "Across " + categories.size + " categories";
  document.getElementById("val-cancelled").textContent    = cancelled.length;
  document.getElementById("val-savings").textContent      = "Saves " + fmt(savedUSD) + " a Month";
}

function renderSubscriptionTable(data) {
  const tbody = document.getElementById("subscription-table-body");
  tbody.innerHTML = "";

  data.subscriptions.forEach(sub => {
    const isCancelled = sub.status === "Cancelled";

    const [y, m, d] = sub.nextRenewal.split("-").map(Number);
    const renewal   = new Date(y, m - 1, d);
    const today     = new Date();
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
      <td>${fmt(sub.amount)}</td>
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