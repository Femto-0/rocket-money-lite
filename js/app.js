let appData = {};

// Load data once
async function loadData() {
  const res = await fetch("data/data.json");
  appData = await res.json();

  renderSpendingChart(appData);
  renderUpcomingRenewals(appData);
  renderPaymentHistory(appData);
}

document.addEventListener("DOMContentLoaded", loadData);