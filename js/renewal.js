function renderUpcomingRenewals(data) {
  const container = document.getElementById("upcoming-renewals-list");

  const today = new Date();

  const upcoming = data.subscriptions
    .filter(sub => new Date(sub.nextRenewal) >= today)
    .sort((a, b) => new Date(a.nextRenewal) - new Date(b.nextRenewal));

  container.innerHTML = "";

  upcoming.forEach(sub => {
    const div = document.createElement("div");

    div.innerHTML = `
      <strong>${sub.name}</strong> - $${sub.amount}
      <br/>
      <small>Renews on ${sub.nextRenewal}</small>
    `;

    container.appendChild(div);
  });
}