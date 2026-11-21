// =========================================
// MOSS & MOCHA CAFE - script.js
// Home page + category pages (ek hi file mein)
// =========================================

// ---------- 1. Categories ----------
const CATS = [
  { id: 'hot-coffee',  name: 'Hot Coffee',  ico: '&#9749;',   line: 'Garam, taza aur khushbu wali' },
  { id: 'cold-coffee', name: 'Cold Coffee', ico: '&#129482;', line: 'Thanda, meetha aur mazedar' },
  { id: 'tea',         name: 'Tea & More',  ico: '&#127861;', line: 'Chai, matcha aur halki chuski' },
  { id: 'desserts',    name: 'Desserts',    ico: '&#127856;', line: 'Coffee ke saath meetha' },
  { id: 'snacks',      name: 'Snacks',      ico: '&#129360;', line: 'Halki bhook ke liye' }
];

// ---------- 2. Items (har category ke 3) ----------
// photo ka naam = id + .jpg  (jaise images/latte.jpg)
const ITEMS = [
  { id: 'espresso',   cat: 'hot-coffee',  name: 'Espresso',          price: 350, note: 'Strong, rich single shot' },
  { id: 'latte',      cat: 'hot-coffee',  name: 'Latte',             price: 480, note: 'Smooth milk with espresso', tag: 'Popular' },
  { id: 'cappuccino', cat: 'hot-coffee',  name: 'Cappuccino',        price: 450, note: 'Thick foam, bold taste' },

  { id: 'icedlatte',  cat: 'cold-coffee', name: 'Iced Latte',        price: 520, note: 'Thanda aur creamy' },
  { id: 'coldbrew',   cat: 'cold-coffee', name: 'Cold Brew',         price: 560, note: 'Steeped for 18 hours', tag: 'New' },
  { id: 'frappe',     cat: 'cold-coffee', name: 'Caramel Frappe',    price: 620, note: 'Blended, creamy, sweet', tag: 'Hot' },

  { id: 'matcha',     cat: 'tea',         name: 'Matcha Latte',      price: 580, note: 'Hari chai, doodh ke saath', tag: 'New' },
  { id: 'chai',       cat: 'tea',         name: 'Masala Chai',       price: 300, note: 'Desi spices, elaichi' },
  { id: 'greentea',   cat: 'tea',         name: 'Green Tea',         price: 280, note: 'Halki aur taza' },

  { id: 'brownie',    cat: 'desserts',    name: 'Warm Brownie',      price: 450, note: 'Garam, chocolate se bhara', tag: 'Popular' },
  { id: 'cheesecake', cat: 'desserts',    name: 'Cheesecake Slice',  price: 650, note: 'Creamy aur nafees' },
  { id: 'cookies',    cat: 'desserts',    name: 'Choc Chip Cookies', price: 350, note: '3 cookies, abhi ke baked' },

  { id: 'sandwich',   cat: 'snacks',      name: 'Club Sandwich',     price: 750, note: 'Teen layer, fries ke saath' },
  { id: 'croissant',  cat: 'snacks',      name: 'Butter Croissant',  price: 400, note: 'Crispy aur makhan wali', tag: 'Fresh' },
  { id: 'wrap',       cat: 'snacks',      name: 'Chicken Wrap',      price: 690, note: 'Grilled chicken, sauce' }
];

// ---------- 3. Chhote helpers ----------
const $ = (id) => document.getElementById(id);
const home = $('home');
const catPage = $('catPage');
const toast = $('toast');

const rs = (n) => 'Rs ' + n.toLocaleString('en-US');
const catOf = (id) => CATS.find((c) => c.id === id);
const itemOf = (id) => ITEMS.find((i) => i.id === id);

const liked = new Set();
let cart = 0;
let toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---------- 4. Category page banana ----------
function itemCard(it, i) {
  const c = catOf(it.cat);
  const on = liked.has(it.id);
  return `
    <article class="card" style="--i:${i}">
      <button class="heart ${on ? 'on' : ''}" data-heart="${it.id}" aria-label="Favourite">${on ? '&#9829;' : '&#9825;'}</button>
      ${it.tag ? `<span class="badge">${it.tag}</span>` : ''}
      <div class="pic">
        <img src="images/${it.id}.jpg" alt="${it.name}" data-ico="${c.ico}" loading="lazy">
      </div>
      <h3>${it.name}</h3>
      <p>${it.note}</p>
      <div class="row">
        <strong>${rs(it.price)}</strong>
        <button class="btn mini" data-cart="${it.id}">Add to cart</button>
      </div>
    </article>`;
}

function categoryPage(cat) {
  const list = ITEMS.filter((it) => it.cat === cat.id);
  return `
    <div class="cat-page">
      <div class="cat-head">
        <p class="eyebrow">${list.length} items</p>
        <h2>${cat.name}</h2>
        <p>${cat.line}</p>
      </div>
      <div class="grid">${list.map(itemCard).join('')}</div>
    </div>`;
}

// ---------- 5. Left side menu ----------
const drawer = $('drawer');
const overlay = $('overlay');
const menuBtn = $('menuBtn');

$('drawerLinks').innerHTML =
  `<a href="#home" style="--i:0">Home</a>` +
  CATS.map((c, i) => {
    const n = ITEMS.filter((it) => it.cat === c.id).length;
    return `<a href="#${c.id}" style="--i:${i + 1}">${c.name} <small>${n} items</small></a>`;
  }).join('');

function openDrawer() {
  drawer.classList.add('open');
  overlay.classList.add('show');
  menuBtn.setAttribute('aria-expanded', 'true');
}
function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('show');
  menuBtn.setAttribute('aria-expanded', 'false');
}
menuBtn.addEventListener('click', openDrawer);
overlay.addEventListener('click', closeDrawer);
$('closeBtn').addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

// ---------- 6. Page badalna (#hot-coffee, #tea, #home ...) ----------
function route() {
  const id = (location.hash || '#home').slice(1);
  const cat = catOf(id);

  home.hidden = !!cat;        // category ho to home chhupao
  catPage.hidden = !cat;      // category ho to uska page dikhao
  if (cat) catPage.innerHTML = categoryPage(cat);

  document.querySelectorAll('.drawer-links a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + (cat ? cat.id : 'home'));
  });
  document.title = (cat ? cat.name + ' | ' : '') + 'Moss & Mocha Cafe';
  window.scrollTo(0, 0);
  closeDrawer();
}
window.addEventListener('hashchange', route);
route();

// ---------- 7. Heart aur Add to cart ----------
document.addEventListener('click', (e) => {
  const heart = e.target.closest('[data-heart]');
  if (heart) {
    const id = heart.dataset.heart;
    const on = !liked.has(id);
    on ? liked.add(id) : liked.delete(id);
    heart.classList.toggle('on', on);
    heart.innerHTML = on ? '&#9829;' : '&#9825;';
    heart.classList.remove('pop');
    void heart.offsetWidth;                 // animation dobara chalane ke liye
    heart.classList.add('pop');
    showToast(itemOf(id).name + (on ? ' added to favourites' : ' removed'));
    return;
  }

  const add = e.target.closest('[data-cart]');
  if (add) {
    cart++;
    $('cartCount').textContent = cart;
    showToast(itemOf(add.dataset.cart).name + ' added to cart');
  }
});

$('cartBtn').addEventListener('click', () => {
  showToast(cart ? 'Cart mein ' + cart + ' item(s) hain' : 'Cart abhi khali hai');
});

// ---------- 8. Photo na mile to hara dabba dikhao ----------
document.addEventListener('error', (e) => {
  const img = e.target;
  if (img.tagName !== 'IMG') return;
  const box = document.createElement('div');
  box.className = 'ph';
  box.innerHTML = '<span>' + (img.dataset.ico || '&#9749;') + '</span><small>' + (img.alt || '') + '</small>';
  img.replaceWith(box);
}, true);

// ---------- 9. Footer ka saal ----------
$('year').textContent = new Date().getFullYear();