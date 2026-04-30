function renderUpcomingRenewals(data) {
  const container = document.getElementById("upcoming-renewals-list");
  const today = new Date();

  const upcoming = data.subscriptions
    .filter(sub => {
      if (sub.status === "Cancelled") return false;

      const [y, m, d] = sub.nextRenewal.split('-').map(Number);
      const renewalDate = new Date(y, m - 1, d);

      return renewalDate >= today;
    })
    .sort((a, b) => {
      const [y1, m1, d1] = a.nextRenewal.split('-').map(Number);
      const [y2, m2, d2] = b.nextRenewal.split('-').map(Number);

      return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });

  container.innerHTML = "";

  upcoming.forEach(sub => {
    const div = document.createElement("div");

    div.innerHTML = `
      <strong>${sub.name}</strong> — ${fmt(sub.amount)}
      <br/>
      <small>Renews on ${sub.nextRenewal}</small>
    `;

    container.appendChild(div);
  });
}