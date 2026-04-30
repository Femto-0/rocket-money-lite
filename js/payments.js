function renderPaymentHistory(data) {
  const container = document.getElementById("payment-history-list");

  const payments = [...data.payments].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  container.innerHTML = "";

  payments.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${p.service}</strong> — ${fmt(p.amount)}
      <br/>
      <small>${p.date}</small>
    `;
    container.appendChild(div);
  });
}
