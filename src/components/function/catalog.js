export function initKatalog(products) {
  const WHATSAPP_NUMBER = '6281234567890'; // Ganti dengan nomor WhatsApp kamu
  
  let cart = [];
  let currentSort = 'all';

  // Elements
  const productGrid = document.getElementById('productGrid');
  const cartSidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  const cartToggle = document.getElementById('cartToggle');
  const closeCart = document.getElementById('closeCart');
  const cartItems = document.getElementById('cartItems');
  const totalPrice = document.getElementById('totalPrice');
  const cartBadge = document.getElementById('cartBadge');
  const orderBtn = document.getElementById('orderBtn');
  const sortBtns = document.querySelectorAll('.sort-btn');

  // Render Product Grid
  function renderProducts(sortType = 'all') {
    let sortedProducts = [...products];
    if (sortType === 'min') sortedProducts.sort((a, b) => a.price - b.price);
    else if (sortType === 'max') sortedProducts.sort((a, b) => b.price - a.price);

    productGrid.innerHTML = sortedProducts.map(product => `
      <div class="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all hover:-translate-y-1 border border-gray-700">
        <div class="relative">
          <img src="${product.img}" alt="${product.name}" class="w-full h-48 object-cover" />
          <div class="absolute top-2 right-2 bg-amber-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">HOT 🔥</div>
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-sm mb-2 text-gray-100 min-h-[2.5rem]">${product.name}</h3>
          <div class="text-2xl font-bold text-amber-400 mb-3">Rp ${product.price.toLocaleString('id-ID')}</div>
          <button data-id="${product.id}" class="add-cart w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Keranjang
          </button>
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.add-cart').forEach(btn => {
      btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
  }

  // Render Cart
  function renderCart() {
    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          <p class="text-gray-400">Keranjang kosong</p>
        </div>
      `;
      orderBtn.disabled = true;
    } else {
      cartItems.innerHTML = cart.map(item => `
        <div class="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <div class="flex gap-3">
            <img src="${item.img}" alt="${item.name}" class="w-16 h-16 rounded object-cover" />
            <div class="flex-1">
              <h3 class="font-semibold text-sm mb-1">${item.name}</h3>
              <p class="text-amber-400 font-bold">Rp ${item.price.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-3 bg-gray-800 rounded-lg p-1">
              <button data-id="${item.id}" data-delta="-1" class="qty-btn bg-amber-500 hover:bg-amber-600 text-gray-900 w-8 h-8 rounded flex items-center justify-center transition-colors">−</button>
              <span class="font-bold w-8 text-center">${item.qty}</span>
              <button data-id="${item.id}" data-delta="1" class="qty-btn bg-amber-500 hover:bg-amber-600 text-gray-900 w-8 h-8 rounded flex items-center justify-center transition-colors">+</button>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">Subtotal</p>
              <p class="font-bold text-amber-400">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      `).join('');
      orderBtn.disabled = false;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    totalPrice.textContent = 'Rp ' + total.toLocaleString('id-ID');

    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (itemCount > 0) {
      cartBadge.textContent = itemCount;
      cartBadge.classList.remove('hidden');
    } else {
      cartBadge.classList.add('hidden');
    }

    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), parseInt(btn.dataset.delta)));
    });
  }

  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(i => i.id === productId);
    existing ? existing.qty++ : cart.push({ ...product, qty: 1 });
    renderCart();
    openCart();
  }

  function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== productId);
    renderCart();
  }

  function openCart() {
    cartSidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeCartSidebar() {
    cartSidebar.classList.add('translate-x-full');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function sendToWhatsApp() {
    if (cart.length === 0) return alert('Keranjang kosong!');
    const orderDetails = cart.map(i => `${i.name} (${i.qty} pcs)`).join(', ');
    const message = encodeURIComponent(`Halo, saya ingin memesan ${orderDetails}. Apakah masih tersedia?`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  }

  // Listeners
  cartToggle.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartSidebar);
  overlay.addEventListener('click', closeCartSidebar);
  orderBtn.addEventListener('click', sendToWhatsApp);
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sortType = btn.dataset.sort;
      currentSort = sortType;
      document.querySelectorAll('.sort-btn').forEach(b => {
        b.classList.remove('bg-amber-500', 'text-gray-900', 'shadow-lg', 'shadow-amber-500/50');
        b.classList.add('bg-gray-800', 'text-gray-300');
      });
      btn.classList.add('bg-amber-500', 'text-gray-900', 'shadow-lg', 'shadow-amber-500/50');
      renderProducts(sortType);
    });
  });

  renderProducts();
  renderCart();
}
