(function () {
  // ===== MANEJO DE TEMA OSCURO =====
  const themeSwitcher = document.getElementById('themeSwitcher');
  const html = document.documentElement;
  
  // Detectar preferencia guardada o preferencia del sistema
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      themeSwitcher.textContent = '☀️';
    } else {
      html.removeAttribute('data-theme');
      themeSwitcher.textContent = '🌙';
    }
  };

  if (themeSwitcher) {
    initTheme();

    themeSwitcher.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      if (newTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeSwitcher.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
      } else {
        html.removeAttribute('data-theme');
        themeSwitcher.textContent = '🌙';
        localStorage.setItem('theme', 'light');
      }
    });
  }

  const products = window.PALTAPPLE_PRODUCTS || [];
  const productGrid = document.getElementById('productGrid');
  const seriesFilters = document.getElementById('seriesFilters');
  const availableCount = document.getElementById('availableCount');
  const whatsappFloat = document.getElementById('whatsappFloat');

  // Cambia este número si deseas usar otro destino de WhatsApp.
  // 974014560 (Perú) => 51974014560 en formato internacional.
  const WHATSAPP_NUMBER = '51974014560';

  const series = [
    'Todos',
    ...new Set(products.map((product) => product.series).filter((value) => typeof value === 'string' && value.trim()))
  ];
  let activeSeries = 'Todos';

  const buildWhatsAppLink = (message) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const escapeHtml = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

  const safeImageUrl = (value) => {
    try {
      const parsed = new URL(String(value));
      return parsed.protocol === 'https:' ? parsed.toString() : '#';
    } catch {
      return '#';
    }
  };

  const clampRating = (stars) => {
    const parsed = Number(stars);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(0, Math.min(5, Math.round(parsed)));
  };

  const starRating = (stars) =>
    '<i class="fa-solid fa-star"></i>'.repeat(stars) +
    '<i class="fa-regular fa-star"></i>'.repeat(5 - stars);

  const formatPrice = (value) =>
    new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      maximumFractionDigits: 0
    }).format(value);

  function renderFilters() {
    seriesFilters.innerHTML = '';
    series.forEach((item) => {
      const button = document.createElement('button');
      button.className = `chip ${item === activeSeries ? 'active' : ''}`;
      button.type = 'button';
      button.textContent = item;
      button.addEventListener('click', () => {
        activeSeries = item;
        renderFilters();
        renderProducts();
      });
      seriesFilters.appendChild(button);
    });
  }

  function renderProducts() {
    const filtered =
      activeSeries === 'Todos'
        ? products
        : products.filter((product) => product.series === activeSeries);

    availableCount.textContent = filtered.length;

    productGrid.innerHTML = filtered
      .map(
        (product) => {
          const safeName = escapeHtml(product.name);
          const safeStorage = escapeHtml(product.storage);
          const safeColor = escapeHtml(product.color);
          const safeCondition = escapeHtml(product.condition);
          const safeSeller = escapeHtml(product.seller);
          const safeRating = clampRating(product.rating);
          const safePrice = formatPrice(product.price);
          const batteryHealth = product.batteryHealth || 'N/A';

          return `
          <article class="product-card">
            <img src="${safeImageUrl(product.image)}" alt="${safeName}" loading="lazy" />
            <div class="product-body">
              <div class="title-price">
                <h3>${safeName}</h3>
                <span class="price">${safePrice}</span>
              </div>
              <div class="badges">
                <span class="condition">${safeCondition}</span>
                ${product.freeShipping ? '<span class="free-shipping">Envío gratis</span>' : ''}
                <span class="battery" style="background: ${batteryHealth >= 90 ? '#16a34a' : batteryHealth >= 80 ? '#f59e0b' : '#ef4444'}">🔋 ${batteryHealth}%</span>
              </div>
              <div class="meta">
                <span><strong>Almacenamiento:</strong> ${safeStorage}</span>
                <span><strong>Color:</strong> ${safeColor}</span>
              </div>
              <p class="seller">Vendedor: ${safeSeller}</p>
              <p class="rating" aria-label="valoración ${safeRating} de 5">${starRating(safeRating)}</p>
              <a
                class="ask-btn"
                href="${buildWhatsAppLink(`Hola, me interesa el ${safeName}\n📦 Almacenamiento: ${safeStorage}\n🎨 Color: ${safeColor}\n💵 Precio: ${safePrice}\n🔋 Batería: ${batteryHealth}%\n¿Está disponible?`)}"
                target="_blank"
                rel="noopener noreferrer"
              >🛒 Preguntar por este iPhone</a>
            </div>
          </article>
        `;
        }
      )
      .join('');
  }

  whatsappFloat.href = buildWhatsAppLink('¡Hola! 👋 Quisiera recibir información sobre el stock disponible de iPhones verificados en PaltApple. Me interesa conocer más detalles sobre los modelos, precios y disponibilidad. 📱');

  renderFilters();
  renderProducts();
})();
