// ====== src/scripts/products.js ======

const WHATSAPP_NUMBER = '6281327370987';
let cart = [];
let currentSort = 'all';
let currentPage = 1;
const PRODUCTS_PER_PAGE = 8;

// Ambil data produk dari elemen global (window)
const PRODUCTS = window.PRODUCTS || [];

document.addEventListener("DOMContentLoaded", () => {
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

document.addEventListener("DOMContentLoaded", () => {
  const discardAllBtn = document.getElementById("discardAllBtn");
  const confirmModal = document.getElementById("confirmModal");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");

  if (discardAllBtn && confirmModal && confirmYes && confirmNo) {
    // Ketika tombol discard diklik → tampilkan modal konfirmasi
    discardAllBtn.addEventListener("click", () => {
      confirmModal.classList.remove("hidden");
    });

    // Jika user menekan tombol "Ya"
    confirmYes.addEventListener("click", () => {
      // kosongkan keranjang (callback bisa kamu isi sesuai logic cart-mu)
      localStorage.removeItem("cart");
      renderCart(); // pastikan fungsi renderCart ada
      confirmModal.classList.add("hidden");
    });

    // Jika user menekan tombol "Batal"
    confirmNo.addEventListener("click", () => {
      confirmModal.classList.add("hidden");
    });
  }
});


  // Render produk
  function renderProducts(sortType = 'all', page = 1) {
    let sortedProducts = [...PRODUCTS];

    if (sortType === 'min') sortedProducts.sort((a, b) => a.price - b.price);
    else if (sortType === 'max') sortedProducts.sort((a, b) => b.price - a.price);

    const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const paginatedProducts = sortedProducts.slice(start, end);

    productGrid.innerHTML = paginatedProducts.map(product => `
      <div class="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all hover:-translate-y-1 border border-gray-700">
        <div class="relative">
          <img src="${product.img}" alt="${product.name}" class="w-full h-48 object-cover" />
          <div class="absolute top-2 right-2 bg-amber-500 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">Varian Baru</div>
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-sm mb-2 text-gray-100 min-h-[2.5rem]">${product.name}</h3>
          <div class="text-2xl font-bold text-amber-400 mb-3">Rp ${product.price.toLocaleString('id-ID')}</div>
          <button data-id="${product.id}" class="add-cart-btn w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Keranjang
          </button>
        </div>
      </div>
    `).join('');

    productGrid.querySelectorAll(".add-cart-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        addToCart(Number(btn.dataset.id));
      });
    });

    renderPagination(totalPages, page);
  }

  function renderPagination(totalPages, activePage) {
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = `px-4 py-2 rounded-lg font-medium transition-all ${
        i === activePage ? 'bg-amber-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`;
      btn.addEventListener('click', () => {
        currentPage = i;
        renderProducts(currentSort, currentPage);
      });
      paginationContainer.appendChild(btn);
    }

    if (!productGrid.parentNode.contains(paginationContainer)) {
      productGrid.parentNode.appendChild(paginationContainer);
    }
  }

  function renderCart() {
    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
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
              <button data-id="${item.id}" data-delta="-1" class="qty-btn bg-amber-500 hover:bg-amber-600 text-gray-900 w-8 h-8 rounded flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
              </button>
              <span class="font-bold w-8 text-center">${item.qty}</span>
              <button data-id="${item.id}" data-delta="1" class="qty-btn bg-amber-500 hover:bg-amber-600 text-gray-900 w-8 h-8 rounded flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              </button>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">Subtotal</p>
              <p class="font-bold text-amber-400">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      `).join('') + `
        <div class="mt-6">
          <button id="discardAll" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition">
            Hapus Semua
          </button>
        </div>
      `;

      document.getElementById("discardAll").addEventListener("click", () => {
        confirmModal.classList.remove("hidden");
      });
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
  }

  function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });
    renderCart();
    openCart();
  }

  cartItems.addEventListener("click", e => {
    if (e.target.closest(".qty-btn")) {
      const btn = e.target.closest(".qty-btn");
      const id = Number(btn.dataset.id);
      const delta = Number(btn.dataset.delta);
      const item = cart.find(i => i.id === id);
      if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        renderCart();
      }
    }
  });

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
    if (cart.length === 0) return alert("Keranjang kosong!");
    const orderDetails = cart.map(item => `${item.name} (${item.qty} pcs)`).join(", ");
    const message = `Halo, saya ingin memesan ${orderDetails}. Apakah masih tersedia?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  }

  cartToggle.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartSidebar);
  overlay.addEventListener('click', closeCartSidebar);
  orderBtn.addEventListener('click', sendToWhatsApp);

  sortBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      currentSort = this.dataset.sort;
      sortBtns.forEach(b => b.classList.remove('bg-amber-500', 'text-gray-900'));
      this.classList.add('bg-amber-500', 'text-gray-900');
      renderProducts(currentSort, currentPage);
    });
  });

  renderProducts();
  renderCart();
});
