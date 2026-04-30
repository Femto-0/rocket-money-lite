const menuBtn  = document.getElementById('menu-btn');
const Menu = document.getElementById('menu');

menuBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = Menu.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
});
document.addEventListener('click', function (e) {
    if (!Menu.contains(e.target) && e.target !== menuBtn) {
    Menu.classList.remove('open');
    menuBtn.classList.remove('open');
    }
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
    Menu.classList.remove('open');
    menuBtn.classList.remove('open');
    }
});

const currencyItem    = document.getElementById('currency');
const currencySubmenu = document.getElementById('currency-submenu');
const currencySub     = document.getElementById('currency-sub');

currencyItem.addEventListener('click', function (e) {
    e.stopPropagation();
    currencySubmenu.classList.toggle('open');
});

document.querySelectorAll('.currency-option').forEach(btn => {
    btn.addEventListener('click', function (e) {
    e.stopPropagation();

    document.querySelectorAll('.currency-option').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    window.activeCurrency = { symbol: this.dataset.symbol, key: this.dataset.key };
    currencySub.textContent = this.dataset.label;

    const hint = document.getElementById('add-currency-hint');
    const currencyNames = {
    "$": "USD",
    "€": "Euros",
    "£": "GBP",
    "¥J": "JPY",
    "¥C": "CNY"
    };

    hint.textContent = 'Entering amount in ' + currencyNames[this.dataset.key];
    if (typeof refreshAmounts === 'function') refreshAmounts();

    currencySubmenu.classList.remove('open');
    });
});

let isDark = false;
const themeIcon = document.getElementById('theme-icon');
const themeSub  = document.getElementById('theme-sub');

document.getElementById('appearance').addEventListener('click', function (e) {
    e.stopPropagation();
    isDark = !isDark;
    document.body.classList.toggle('dark-mode', isDark);
    themeIcon.textContent = isDark ? '🌑' : '☀️';
    themeSub.textContent  = isDark ? 'Dark mode' : 'Light mode';
});

document.getElementById('signout').addEventListener('click', () => {
    alert('Sign out — coming soon!');
});