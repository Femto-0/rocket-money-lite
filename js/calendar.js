const monthYearElement = document.getElementById('monthYear');
const datesElement     = document.getElementById('dates');
const prevBtnElement   = document.getElementById('prevBtn');
const nextBtnElement   = document.getElementById('nextBtn');

let currentDate = new Date();

function updateCalendarWithRenewals(subscriptions) {
  window._calendarSubs = subscriptions;
  updateCalendar();
}

const updateCalendar = () => {
  const currentYear  = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDay    = new Date(currentYear, currentMonth, 1);
  const lastDay     = new Date(currentYear, currentMonth + 1, 0);
  const totalDays   = lastDay.getDate();
  const firstDayIdx = firstDay.getDay();

  monthYearElement.textContent = currentDate.toLocaleString('default', {
    month: 'long', year: 'numeric'
  });

  const dayColorMap = {};

  if (window._calendarSubs) {
    window._calendarSubs.forEach(sub => {

      if (sub.status === "Cancelled") return;

      const [year, month, day] = sub.nextRenewal.split('-').map(Number);

      if (year === currentYear && month === currentMonth + 1) {
        if (!dayColorMap[day]) dayColorMap[day] = [];

        const color = (window.categoryColorMap && window.categoryColorMap[sub.category])
          ? window.categoryColorMap[sub.category]
          : '#e74c3c';

        dayColorMap[day].push(color);
      }
    });
  }

  let datesHTML = '';
  let cellCount = 0;

  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

  for (let i = firstDayIdx - 1; i >= 0; i--) {
    datesHTML += `
      <div class="date inactive">
        <span class="date-num">${prevMonthLastDay - i}</span>
      </div>`;
    cellCount++;
  }

  for (let i = 1; i <= totalDays; i++) {
    const isToday = new Date(currentYear, currentMonth, i).toDateString()
      === new Date().toDateString();

    const colors = dayColorMap[i] || [];

    const dots = colors.map(c =>
      `<span class="renewal-dot" style="background:${c};"></span>`
    ).join('');

    const bgStyle = colors.length
      ? `style="background:${colors[0]};"`
      : '';

    datesHTML += `
      <div class="date ${isToday ? 'active' : ''}" ${bgStyle}>
        <span class="date-num">${i}</span>
        ${dots ? `<span class="dot-row">${dots}</span>` : ''}
      </div>`;

    cellCount++;
  }

  const remaining = 42 - cellCount;

  for (let i = 1; i <= remaining; i++) {
    datesHTML += `
      <div class="date inactive">
        <span class="date-num">${i}</span>
      </div>`;
  }

  datesElement.innerHTML = datesHTML;
};

prevBtnElement.addEventListener('click', () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  updateCalendar();
});

nextBtnElement.addEventListener('click', () => {
  currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  updateCalendar();
});

updateCalendar();