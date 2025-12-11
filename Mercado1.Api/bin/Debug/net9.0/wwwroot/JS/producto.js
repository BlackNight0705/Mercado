let productData = null;
let currentImageIndex = 0;

// Cargar producto al iniciar
window.addEventListener('DOMContentLoaded', () => {
    loadProduct();
});

// Obtener ID del producto desde URL
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Cargar producto desde API
async function loadProduct() {
    const productId = getProductId();

    if (!productId) {
        showError('No se especificó un producto');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/productos/${productId}`);

        if (response.ok) {
            const data = await response.json(); // ✅ primero declaramos 'data'

            console.log('Respuesta completa:', data);
            console.log('Tipo de caracteristicas:', typeof data.caracteristicas);
            console.log('Contenido de caracteristicas:', data.caracteristicas);
            console.log('Contenido de $values:', data.caracteristicas?.$values);

            // Extraer valores de caracteristicas.$values
            const values = data.caracteristicas?.$values || [];

            productData = {
                id: data.id,
                name: data.nombre,
                description: data.descripcion,
                price: data.precio,
                oldPrice: data.precioAnterior,
                stock: values.length > 0 ? parseInt(values[0].split(': ')[1]) : 0,
                rating: data.rating,
                reviewCount: data.reviews,
                images: [data.imagen],
                features: values,
                badge: data.badge
            };

            renderProduct();
        }
    } catch (error) {
        console.error('Error cargando producto:', error);
        showError('Error al cargar el producto');
    }
}

// Renderizar producto
function renderProduct() {
    const container = document.getElementById('productContent');

    container.innerHTML = `
        <div class="product-detail">
            <div class="product-image">
                <img id="mainImage" src="${productData.images[0]}" alt="${productData.name}">
                <span class="product-badge">${productData.badge}</span>
            </div>
            <div class="product-info">
                <h2 class="product-title">${productData.name}</h2>
                <p class="product-description">${productData.description}</p>
                <div class="product-rating">
                    <span class="stars">${generateStars(productData.rating)}</span>
                    <span class="reviews-count">(${productData.reviewCount} reseñas)</span>
                </div>
                <div class="product-price">
                    $${productData.price}
                    ${productData.oldPrice ? `<span class="product-old-price">$${productData.oldPrice}</span>` : ""}
                </div>
                <div class="product-stock">Disponibles: ${productData.stock}</div>
                <div class="quantity-control">
                    <button onclick="changeQuantity(-1)">-</button>
                    <input id="quantity" type="number" value="1" min="1" max="${productData.stock}">
                    <button onclick="changeQuantity(1)">+</button>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart()">Agregar al carrito</button>
                <button class="buy-now-btn" onclick="buyNow()">Comprar ahora</button>
            </div>
        </div>
    `;
}

// Cambiar imagen principal
function changeImage(index) {
    currentImageIndex = index;
    document.getElementById('mainImage').src = productData.images[index];

    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Generar estrellas de rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '½';
    stars += '☆'.repeat(5 - Math.ceil(rating));
    return stars;
}

// Cambiar cantidad
function changeQuantity(change) {
    const input = document.getElementById('quantity');
    let quantity = parseInt(input.value);
    quantity += change;

    if (quantity < 1) quantity = 1;
    if (quantity > productData.stock) quantity = productData.stock;

    input.value = quantity;
}

// Agregar al carrito
function addToCart() {
    const quantity = parseInt(document.getElementById('quantity').value);

    try {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === productData.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productData.id,
                name: productData.name,
                price: productData.price,
                image: productData.images[0],
                quantity: quantity,
                stock: productData.stock
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`✓ ${quantity} ${quantity > 1 ? 'productos agregados' : 'producto agregado'} al carrito`);
    } catch (error) {
        console.error('Error agregando al carrito:', error);
        alert('Error al agregar al carrito');
    }
}

// Comprar ahora
function buyNow() {
    addToCart();
    setTimeout(() => {
        window.location.href = 'carrito.html';
    }, 500);
}

// Mostrar error
function showError(message) {
    document.getElementById('productContent').innerHTML = `
        <div class="loading">
            <h3 style="color: #B12704; margin-bottom: 15px;">❌ ${message}</h3>
            <a href="index.html" class="btn btn-primary" style="display: inline-block; text-decoration: none;">
                Volver a la tienda
            </a>
        </div>
    `;
}