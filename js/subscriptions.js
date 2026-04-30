let deleteName = null;

const $ = id => document.getElementById(id);
const show = id => $(id).style.display = "flex";
const hide = id => $(id).style.display = "none";


function updateCancelledMetrics(data) {
  const cancelledSubs = data.subscriptions.filter(
    sub => sub.status === "Cancelled"
  );

  const cancelledCount = cancelledSubs.length;

  const monthlySavings = cancelledSubs.reduce(
    (sum, sub) => sum + sub.amount,
    0
  );

  $("val-cancelled").textContent = cancelledCount;
  $("val-savings").textContent =
    `Saves $${monthlySavings.toFixed(2)} a Month`;
}

function refreshDashboard() {
  renderMetrics(appData);
  renderSubscriptionTable(appData);

  $("spending-chart").innerHTML = "";
  renderSpendingChart(appData);

  renderUpcomingRenewals(appData);
  renderPaymentHistory(appData);
  updateCalendarWithRenewals(appData.subscriptions);
  updateCancelledMetrics(appData);
}

document.addEventListener("click", e => {
  if (e.target.id === "btn-add-subscription") {
    show("add-popup");
  }
  if (e.target.id === "cancel-add-btn") {
    hide("add-popup");
  }

  if (e.target.id === "confirm-add-btn") {
    const name = $("add-name").value.trim();
    const category = $("add-category").value.trim();
    const amount = parseFloat($("add-amount").value);
    const nextRenewal = $("add-renewal").value;

    if (!name || !category || isNaN(amount) || !nextRenewal) {
      alert("Please fill out all fields.");
      return;
    }

    appData.subscriptions.push({
      name,
      category,
      status: "Active",
      amount,
      nextRenewal
    });

    refreshDashboard();

    ["add-name", "add-category", "add-amount", "add-renewal"].forEach(id => {
      $(id).value = "";
    });

    hide("add-popup");
  }

  if (e.target.classList.contains("btn-cancel-subscription")) {
    deleteName = e.target.dataset.name;
    show("delete-popup");
  }

  if (e.target.id === "cancel-delete-btn") {
    deleteName = null;
    hide("delete-popup");
  }

  if (e.target.id === "confirm-delete-btn") {
    const sub = appData.subscriptions.find(
    s => s.name === deleteName
    );

    if (sub) {
      sub.status = "Cancelled";
    }

    refreshDashboard();

    deleteName = null;
    hide("delete-popup");
  }
});