// Ejemplo de cómo llenar el grid desde tu API
const productsGrid = document.getElementById('productsGrid');

// Limpiar productos de ejemplo
productsGrid.innerHTML = '';

// Llenar con datos de tu API
productos.forEach(producto => {
    const card = `
        <div class="product-card">
            ${producto.badge ? `<span class="product-badge">${producto.badge}</span>` : ''}
            <div class="product-image">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${producto.nombre}</h3>
                <div class="product-rating">
                    <span class="stars">${generarEstrellas(producto.rating)}</span>
                    <span class="reviews-count">(${producto.reviews})</span>
                </div>
                <div>
                    <span class="product-price">
                        <span class="product-price-currency">$</span>${producto.precio}
                    </span>
                    ${producto.precioAnterior ? `<span class="product-old-price">$${producto.precioAnterior}</span>` : ''}
                </div>
            </div>
            <div class="product-description-overlay">
                <h4 class="description-title">Descripción del Producto</h4>
                <p class="description-text">${producto.descripcion}</p>
                <ul class="description-features">
                    ${producto.caracteristicas.map(c => `<li>${c}</li>`).join('')}
                </ul>
                <button class="add-to-cart-btn" onclick="agregarAlCarrito('${producto.id}')">Agregar al carrito</button>
            </div>
        </div>
    `;
    productsGrid.innerHTML += card;
});