// =========================================
// MOSS & MOCHA CAFE - script.js
// Home page + category pages + cart
// =========================================

// ---------- 1. Categories ----------
const CATS = [
  { id: 'hot-coffee',  name: 'Hot Coffee',  ico: '&#9749;',   line: 'Hot, fresh and full of aroma' },
  { id: 'cold-coffee', name: 'Cold Coffee', ico: '&#129482;', line: 'Cold, sweet and refreshing' },
  { id: 'tea',         name: 'Tea & More',  ico: '&#127861;', line: 'Chai, matcha and light sips' },
  { id: 'desserts',    name: 'Desserts',    ico: '&#127856;', line: 'Something sweet with your coffee' },
  { id: 'snacks',      name: 'Snacks',      ico: '&#129360;', line: 'For a light bite' }
];

// ---------- 2. Items (3 in every category) ----------
// photo name = id + .jpg  (for example images/latte.jpg)
const ITEMS = [
  { id: 'espresso',   cat: 'hot-coffee',  name: 'Espresso',          price: 350, note: 'Strong, rich single shot' },
  { id: 'latte',      cat: 'hot-coffee',  name: 'Latte',             price: 480, note: 'Smooth milk with espresso', tag: 'Popular' },
  { id: 'cappuccino', cat: 'hot-coffee',  name: 'Cappuccino',        price: 450, note: 'Thick foam, bold taste' },

  { id: 'icedlatte',  cat: 'cold-coffee', name: 'Iced Latte',        price: 520, note: 'Cold and creamy' },
  { id: 'coldbrew',   cat: 'cold-coffee', name: 'Cold Brew',         price: 560, note: 'Steeped for 18 hours', tag: 'New' },
  { id: 'frappe',     cat: 'cold-coffee', name: 'Caramel Frappe',    price: 620, note: 'Blended, creamy, sweet', tag: 'Hot' },

  { id: 'matcha',     cat: 'tea',         name: 'Matcha Latte',      price: 580, note: 'Green tea with steamed milk', tag: 'New' },
  { id: 'chai',       cat: 'tea',         name: 'Masala Chai',       price: 300, note: 'Desi spices and cardamom' },
  { id: 'greentea',   cat: 'tea',         name: 'Green Tea',         price: 280, note: 'Light and fresh' },

  { id: 'brownie',    cat: 'desserts',    name: 'Warm Brownie',      price: 450, note: 'Warm and full of chocolate', tag: 'Popular' },
  { id: 'cheesecake', cat: 'desserts',    name: 'Cheesecake Slice',  price: 650, note: 'Rich and creamy' },
  { id: 'cookies',    cat: 'desserts',    name: 'Choc Chip Cookies', price: 350, note: '3 cookies, freshly baked' },

  { id: 'sandwich',   cat: 'snacks',      name: 'Club Sandwich',     price: 750, note: 'Triple layer, served with fries' },
  { id: 'croissant',  cat: 'snacks',      name: 'Butter Croissant',  price: 400, note: 'Crispy and buttery', tag: 'Fresh' },
  { id: 'wrap',       cat: 'snacks',      name: 'Chicken Wrap',      price: 690, note: 'Grilled chicken with sauce' }
];

// ---------- 3. Small helpers ----------
const $ = (id) => document.getElementById(id);
const home = $('home');
const catPage = $('catPage');
const toast = $('toast');

const rs = (n) => 'Rs ' + n.toLocaleString('en-US');
const catOf = (id) => CATS.find((c) => c.id === id);
const itemOf = (id) => ITEMS.find((i) => i.id === id);

const liked = new Set();
const cart = {};          // { itemId: quantity }
let toastTimer;

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---------- 4. Building a category page ----------
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

// ---------- 6. Changing pages (#hot-coffee, #tea, #home ...) ----------
function route() {
  const id = (location.hash || '#home').slice(1);
  const cat = catOf(id);

  home.hidden = !!cat;        // hide home when a category is open
  catPage.hidden = !cat;      // show the category page
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

// ---------- 7. Hearts and cart ----------
const cartDrawer = $('cartDrawer');

function cartQty() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function renderCart() {
  const ids = Object.keys(cart);
  $('cartCount').textContent = cartQty();

  if (!ids.length) {
    $('cartList').innerHTML = '<p class="cart-empty">Your cart is empty.<br>Add something delicious!</p>';
    $('cartTotal').textContent = rs(0);
    return;
  }

  let total = 0;
  $('cartList').innerHTML = ids.map((id) => {
    const it = itemOf(id);
    const q = cart[id];
    total += it.price * q;
    return `
      <div class="cart-item">
        <div><b>${it.name}</b><br><small>${rs(it.price)} each</small></div>
        <strong>${rs(it.price * q)}</strong>
        <div class="qty">
          <button data-minus="${id}" aria-label="Less">&minus;</button>
          <span>${q}</span>
          <button data-plus="${id}" aria-label="More">+</button>
        </div>
      </div>`;
  }).join('');
  $('cartTotal').textContent = rs(total);
}

function openCart() {
  renderCart();
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
}

document.addEventListener('click', (e) => {
  // heart
  const heart = e.target.closest('[data-heart]');
  if (heart) {
    const id = heart.dataset.heart;
    const on = !liked.has(id);
    on ? liked.add(id) : liked.delete(id);
    heart.classList.toggle('on', on);
    heart.innerHTML = on ? '&#9829;' : '&#9825;';
    heart.classList.remove('pop');
    void heart.offsetWidth;
    heart.classList.add('pop');
    showToast(itemOf(id).name + (on ? ' added to favourites' : ' removed'));
    return;
  }

  // add to cart
  const add = e.target.closest('[data-cart]');
  if (add) {
    const id = add.dataset.cart;
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    showToast(itemOf(id).name + ' added to cart');
    return;
  }

  // plus and minus inside the cart
  const plus = e.target.closest('[data-plus]');
  if (plus) {
    cart[plus.dataset.plus]++;
    renderCart();
    return;
  }
  const minus = e.target.closest('[data-minus]');
  if (minus) {
    const id = minus.dataset.minus;
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
    renderCart();
  }
});

$('cartBtn').addEventListener('click', openCart);
$('cartClose').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

$('orderBtn').addEventListener('click', () => {
  if (!cartQty()) { showToast('Add something first'); return; }
  Object.keys(cart).forEach((k) => delete cart[k]);
  renderCart();
  closeCart();
  showToast('Order placed! (demo only)');
});

renderCart();

// ---------- 8. If a photo is missing, show a green box ----------
document.addEventListener('error', (e) => {
  const img = e.target;
  if (img.tagName !== 'IMG') return;
  const box = document.createElement('div');
  box.className = 'ph';
  box.innerHTML = '<span>' + (img.dataset.ico || '&#9749;') + '</span><small>' + (img.alt || '') + '</small>';
  img.replaceWith(box);
}, true);

// ---------- 9. Footer year ----------
$('year').textContent = new Date().getFullYear();