(function () {
  const products = window.PALTAPPLE_PRODUCTS || [];
  const productGrid = document.getElementById('productGrid');
  const seriesFilters = document.getElementById('seriesFilters');
  const availableCount = document.getElementById('availableCount');
  const whatsappFloat = document.getElementById('whatsappFloat');

  // Cambia este número si deseas usar otro destino de WhatsApp.
  const WHATSAPP_NUMBER = '974014560';

  const series = ['Todos', ...new Set(products.map((product) => product.series))];
  let activeSeries = 'Todos';

  const buildWhatsAppLink = (message) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const starRating = (stars) =>
    '<i class="fa-solid fa-star"></i>'.repeat(stars) +
    '<i class="fa-regular fa-star"></i>'.repeat(Math.max(0, 5 - stars));

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
        (product) => `
          <article class="product-card">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            <div class="product-body">
              <div class="title-price">
                <h3>${product.name}</h3>
                <span class="price">${formatPrice(product.price)}</span>
              </div>
              <div class="badges">
                <span class="condition">${product.condition}</span>
                ${product.freeShipping ? '<span class="free-shipping">Envío gratis</span>' : '<span></span>'}
              </div>
              <div class="meta">
                <span><strong>Almacenamiento:</strong> ${product.storage}</span>
                <span><strong>Color:</strong> ${product.color}</span>
              </div>
              <p class="seller">Vendedor: ${product.seller}</p>
              <p class="rating" aria-label="valoración ${product.rating} de 5">${starRating(product.rating)}</p>
              <a
                class="ask-btn"
                href="${buildWhatsAppLink(`Hola, me interesa el ${product.name} (${product.storage}, ${product.color}) por ${formatPrice(product.price)}.`)}"
                target="_blank"
                rel="noopener noreferrer"
              >Preguntar por este iPhone</a>
            </div>
          </article>
        `
      )
      .join('');
  }

  whatsappFloat.href = buildWhatsAppLink('Hola PaltApple, quiero información del stock de iPhones.');

  renderFilters();
  renderProducts();
})();
