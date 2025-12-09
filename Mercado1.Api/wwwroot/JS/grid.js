const API_URL = "http://localhost:5080/api/productos";

// Función para generar estrellas (ejemplo simple)
function generarEstrellas(rating) {
    const r = Math.max(0, Math.min(5, rating || 0)); // asegura entre 0 y 5
    return "★".repeat(r) + "☆".repeat(5 - r);
}

// Función para cargar productos desde la API
async function cargarProductos(productsGrid) {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const productos = await response.json();

        if (!Array.isArray(productos)) {
            console.error("La respuesta no es un array:", productos);
            return;
        }

        // Limpiar grid
        productsGrid.innerHTML = '';

        // Renderizar cada producto
        productos.forEach(producto => {
            const card = `
                <div class="product-card">
                    ${producto.badge ? `<span class="product-badge">${producto.badge}</span>` : ''}
                    <div class="product-image">
                        <img src="${producto.imagen || 'imagenes/placeholder.jpg'}" alt="${producto.nombre || 'Producto'}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${producto.nombre || 'Sin nombre'}</h3>
                        <div class="product-rating">
                            <span class="stars">${generarEstrellas(producto.rating)}</span>
                            <span class="reviews-count">(${producto.reviews || 0})</span>
                        </div>
                        <div>
                            <span class="product-price">
                                <span class="product-price-currency">$</span>${producto.precio ?? '0.00'}
                            </span>
                            ${producto.precioAnterior ? `<span class="product-old-price">$${producto.precioAnterior}</span>` : ''}
                        </div>
                    </div>
                    <div class="product-description-overlay">
                        <h4 class="description-title">Descripción del Producto</h4>
                        <p class="description-text">${producto.descripcion || 'Sin descripción disponible.'}</p>
                        <ul class="description-features">
                            ${(producto.caracteristicas || []).map(c => `<li>${c}</li>`).join('')}
                        </ul>
                        <button class="add-to-cart-btn" onclick="agregarAlCarrito('${producto.id}')">Agregar al carrito</button>
                    </div>
                </div>
            `;
            productsGrid.innerHTML += card;
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.error("Elemento 'productsGrid' no encontrado en el DOM");
        return;
    }
    cargarProductos(productsGrid);
});