let deleteName = null;

const $  = id => document.getElementById(id);
const show = id => $(id).style.display = "flex";
const hide = id => $(id).style.display = "none";

function refreshDashboard() {
  renderMetrics(appData);
  renderSubscriptionTable(appData);

  $("spending-chart").innerHTML = "";
  renderSpendingChart(appData);

  renderUpcomingRenewals(appData);
  renderPaymentHistory(appData);
  updateCalendarWithRenewals(appData.subscriptions);
}

document.addEventListener("click", e => {
  if (e.target.id === "btn-add-subscription") {
    show("add-popup");
  }
  if (e.target.id === "cancel-add-btn") {
    hide("add-popup");
  }

  if (e.target.id === "confirm-add-btn") {
    const name        = $("add-name").value.trim();
    const category    = $("add-category").value.trim();
    const nextRenewal = $("add-renewal").value;

    const enteredAmount = parseFloat($("add-amount").value);
    const rate = (window.activeCurrency?.key)
      ? (CURRENCY_RATES[window.activeCurrency.key]?.rate || 1)
      : 1;
    const amountUSD = enteredAmount / rate;

    if (!name || !category || isNaN(enteredAmount) || !nextRenewal) {
      alert("Please fill out all fields.");
      return;
    }

    appData.subscriptions.push({ name, category, status: "Active", amount: amountUSD, nextRenewal });
    refreshDashboard();
    ["add-name", "add-category", "add-amount", "add-renewal"].forEach(id => $(id).value = "");
    hide("add-popup");
  }

  if (e.target.classList.contains("btn-cancel-subscription")) {
    deleteName = e.target.dataset.name;
    $("delete-popup-text").textContent = `Are you sure you want to cancel "${deleteName}"?`;
    show("delete-popup");
  }

  if (e.target.id === "cancel-delete-btn") {
    deleteName = null;
    hide("delete-popup");
  }

  if (e.target.id === "confirm-delete-btn") {
    appData.subscriptions = appData.subscriptions.filter(
      sub => sub.name !== deleteName
    );

    refreshDashboard();

    deleteName = null;
    hide("delete-popup");
  }
});