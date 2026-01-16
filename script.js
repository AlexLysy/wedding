'use strict';

/** ====== НАСТРОЙКИ (меняй под себя) ====== */
const SETTINGS = {
  weddingDateISO: '2026-02-26T13:00:00+03:00', // дата/время свадьбы
  calendar: { year: 2026, monthIndex: 1, highlightDay: 26 }, // 0=янв, 1=фев
  wishes: [
    'Будем очень признательны, если Вы воздержитесь от криков «Горько». Но в случае непреодолимого желания-приготовьте наличные.',
    'Пожалуйста, не дарите нам цветы! Мы не успеем насладиться их красотой и ароматом. Если хотите подарить ценный и нужный подарок — будем благодарны за вклад в бюджет нашей молодой семьи.',
    'Самый лучший подарок — ваше присутствие и хорошее настроение. Давайте сделаем этот день тёплым и душевным.'
  ]
};

/** ====== КАЛЕНДАРЬ ====== */
const calRoot = document.getElementById('calendar');
const calMonth = document.getElementById('calMonth');

const MONTHS_RU = [
  'ЯНВАРЬ','ФЕВРАЛЬ','МАРТ','АПРЕЛЬ','МАЙ','ИЮНЬ',
  'ИЮЛЬ','АВГУСТ','СЕНТЯБРЬ','ОКТЯБРЬ','НОЯБРЬ','ДЕКАБРЬ'
];
// Пн..Вс как на скрине
const WEEKDAYS_RU = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

function daysInMonth(year, monthIndex){
  // monthIndex: 0..11
  return new Date(year, monthIndex + 1, 0).getDate();
}

// JS: 0=Вс..6=Сб. Нам нужно Пн=0..Вс=6
function firstWeekdayMon0(year, monthIndex){
  const js = new Date(year, monthIndex, 1).getDay(); // 0..6 (Вс..Сб)
  return (js + 6) % 7; // сдвиг: Пн=0
}

function renderCalendar(){
  if (!calRoot || !calMonth) return;

  const { year, monthIndex, highlightDay } = SETTINGS.calendar;
  calMonth.textContent = MONTHS_RU[monthIndex];

  calRoot.innerHTML = '';

  // заголовок дней недели
  for (const wd of WEEKDAYS_RU){
    const el = document.createElement('div');
    el.className = 'calHead';
    el.textContent = wd;
    calRoot.appendChild(el);
  }

  const blanks = firstWeekdayMon0(year, monthIndex);
  for (let i = 0; i < blanks; i++){
    const empty = document.createElement('div');
    empty.className = 'calEmpty';
    calRoot.appendChild(empty);
  }

  const total = daysInMonth(year, monthIndex);
  for (let d = 1; d <= total; d++){
    const day = document.createElement('div');
    day.className = 'calDay';
    day.textContent = String(d);

    if (d === highlightDay){
      day.classList.add('calHeart');
    }
    calRoot.appendChild(day);
  }
}

/** ====== ОТСЧЁТ ДО СВАДЬБЫ ====== */
const cdDays = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMinutes = document.getElementById('cdMinutes');
const cdSeconds = document.getElementById('cdSeconds');

function pad2(n){ return String(n).padStart(2, '0'); }

function updateCountdown(){
  const target = new Date(SETTINGS.weddingDateISO).getTime();
  const now = Date.now();
  let diff = target - now;
  if (diff < 0) diff = 0;

  const sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  if (cdDays) cdDays.textContent = pad2(days);
  if (cdHours) cdHours.textContent = pad2(hours);
  if (cdMinutes) cdMinutes.textContent = pad2(minutes);
  if (cdSeconds) cdSeconds.textContent = pad2(seconds);
}

/** ====== ПОЖЕЛАНИЯ (СЛАЙДЕР) ====== */
const wishText = document.getElementById('wishText');
const wishPrev = document.getElementById('wishPrev');
const wishNext = document.getElementById('wishNext');
const wishIndex = document.getElementById('wishIndex');
const wishTotal = document.getElementById('wishTotal');

let wishPos = 0;

function renderWish(){
  const total = SETTINGS.wishes.length;
  if (wishTotal) wishTotal.textContent = String(total);
  if (wishIndex) wishIndex.textContent = String(wishPos + 1);
  if (wishText) wishText.textContent = SETTINGS.wishes[wishPos] ?? '';
}

function prevWish(){
  const total = SETTINGS.wishes.length;
  wishPos = (wishPos - 1 + total) % total;
  renderWish();
}
function nextWish(){
  const total = SETTINGS.wishes.length;
  wishPos = (wishPos + 1) % total;
  renderWish();
}

/** ====== МОДАЛКА ПОДАРКОВ ====== */
const giftsModal = document.getElementById('giftsModal');
const openGifts = document.getElementById('openGifts');
const closeGifts = document.getElementById('closeGifts');

function openModal(){
  if (!giftsModal) return;
  giftsModal.classList.add('isOpen');
  giftsModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  if (!giftsModal) return;
  giftsModal.classList.remove('isOpen');
  giftsModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/** ====== ИНИЦИАЛИЗАЦИЯ ====== */
renderCalendar();
renderWish();
updateCountdown();
setInterval(updateCountdown, 1000);

if (wishPrev) wishPrev.addEventListener('click', prevWish);
if (wishNext) wishNext.addEventListener('click', nextWish);

if (openGifts) openGifts.addEventListener('click', openModal);
if (closeGifts) closeGifts.addEventListener('click', closeModal);

if (giftsModal){
  giftsModal.addEventListener('click', (e) => {
    const t = /** @type {HTMLElement} */(e.target);
    if (t && t.dataset && t.dataset.close === 'true') closeModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});