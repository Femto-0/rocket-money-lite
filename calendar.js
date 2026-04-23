const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtnElement = document.getElementById('prevBtn');
const nextBtnElement = document.getElementById('nextBtn');

let currentDate = new Date();

const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay(); // Day of the week (0-6) of the first day of the month
    const lastDayIndex = lastDay.getDay(); // Day of the week (0-6) of the last day of the month

    const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    monthYearElement.textContent = monthYearString;

    let datesHTML = '';

    // Display dates from previous month
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    const daysFromPrevMonth = firstDayIndex; // Number of days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        const prevDate = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
        datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
    }

    // Display dates for the current month
    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
        datesHTML += `<div class="date ${activeClass}">${i}</div>`;
    }

    // Display dates from next month
    const daysFromNextMonth = 6 - lastDayIndex; // Number of days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
        const nextDate = new Date(currentYear, currentMonth + 1, i);
        datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }

    datesElement.innerHTML = datesHTML;
}

prevBtnElement.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    updateCalendar();
})

nextBtnElement.addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    updateCalendar();
})

updateCalendar();