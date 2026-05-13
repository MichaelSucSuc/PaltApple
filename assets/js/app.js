(function () {
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
      currency: 'USD',
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
              </div>
              <div class="meta">
                <span><strong>Almacenamiento:</strong> ${safeStorage}</span>
                <span><strong>Color:</strong> ${safeColor}</span>
              </div>
              <p class="seller">Vendedor: ${safeSeller}</p>
              <p class="rating" aria-label="valoración ${safeRating} de 5">${starRating(safeRating)}</p>
              <a
                class="ask-btn"
                href="${buildWhatsAppLink(`Hola, me interesa el ${safeName} (${safeStorage}, ${safeColor}) por ${safePrice}.`)}"
                target="_blank"
                rel="noopener noreferrer"
              >Preguntar por este iPhone</a>
            </div>
          </article>
        `;
        }
      )
      .join('');
  }

  whatsappFloat.href = buildWhatsAppLink('Hola PaltApple, quiero información del stock de iPhones.');

  renderFilters();
  renderProducts();
})();
