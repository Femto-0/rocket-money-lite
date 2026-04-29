let deleteName = null;

const $ = id => document.getElementById(id);
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
    appData.subscriptions = appData.subscriptions.filter(
      sub => sub.name !== deleteName
    );

    refreshDashboard();

    deleteName = null;
    hide("delete-popup");
  }
});