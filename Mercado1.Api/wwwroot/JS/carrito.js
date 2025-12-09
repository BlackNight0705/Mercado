        // Datos de ejemplo del carrito - Reemplazar con datos de tu API
    let cartData = [];

        // Cargar carrito al iniciar
        window.addEventListener('DOMContentLoaded', () => {
        loadCart();
        });

    // Cargar carrito desde API o localStorage
    async function loadCart() {
            try {
                // OPCIÓN 1: Desde API
                // const response = await fetch('TU_API_URL/cart', {
                //     headers: {
                //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                //     }
                // });
                // cartData = await response.json();

                // OPCIÓN 2: Desde localStorage (para desarrollo)
                const savedCart = localStorage.getItem('cart');
    cartData = savedCart ? JSON.parse(savedCart) : [];

    renderCart();
            } catch (error) {
        console.error('Error cargando carrito:', error);
            }
        }

    // Renderizar carrito
    function renderCart() {
            const cartList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    const itemCount = document.getElementById('itemCount');

    if (cartData.length === 0) {
        emptyCart.style.display = 'block';
    cartSummary.style.display = 'none';
    itemCount.textContent = '0 artículos';
    return;
            }

    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';

            cartList.innerHTML = cartData.map((item, index) => `
    <div class="cart-item" data-index="${index}">
        <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}" class="item-image">

            <div class="item-details">
                <div class="item-title" onclick="goToProduct('${item.id}')">${item.name}</div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
                <div class="item-stock ${item.stock > 0 ? '' : 'out-of-stock'}">
                    ${item.stock > 0 ? `En stock (${item.stock} disponibles)` : 'Agotado'}
                </div>

                <div class="item-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button class="action-link" onclick="removeItem(${index})">Eliminar</button>
                    <button class="action-link" onclick="saveForLater(${index})">Guardar para después</button>
                </div>
            </div>

            <div style="text-align: right;">
                <div style="font-size: 18px; font-weight: 700; color: #0F1111;">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
    </div>
    `).join('');

    itemCount.textContent = `${cartData.length} artículo${cartData.length > 1 ? 's' : ''}`;
    updateSummary();
        }

    // Actualizar cantidad
    async function updateQuantity(index, change) {
            const item = cartData[index];
    const newQuantity = item.quantity + change;

    if (newQuantity < 1) {
        removeItem(index);
    return;
            }

            if (newQuantity > item.stock) {
        alert(`Solo hay ${item.stock} unidades disponibles`);
    return;
            }

    cartData[index].quantity = newQuantity;

            // Actualizar en API
            // await fetch(`TU_API_URL/cart/${item.id}`, {
        //     method: 'PUT',
        //     body: JSON.stringify({ quantity: newQuantity })
        // });

        // Guardar en localStorage
        localStorage.setItem('cart', JSON.stringify(cartData));
    renderCart();
        }

    // Eliminar item
    async function removeItem(index) {
            if (confirm('¿Eliminar este producto del carrito?')) {
                const item = cartData[index];

                // Eliminar de API
                // await fetch(`TU_API_URL/cart/${item.id}`, {method: 'DELETE' });

    cartData.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartData));
    renderCart();
            }
        }

    // Guardar para después
    function saveForLater(index) {
        alert('Funcionalidad: Guardar para después');
            // Implementar según necesidad
        }

    // Actualizar resumen
    function updateSummary() {
            const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = subtotal > 50 ? 0 : 5.99;
    const discount = 0; // Aplicar descuentos aquí
    const total = subtotal + shipping - discount;

    document.getElementById('summaryItemCount').textContent = cartData.length;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
        }

    // Aplicar código promocional
    async function applyPromoCode() {
            const code = document.getElementById('promoCode').value.trim();

    if (!code) {
        alert('Ingresa un código promocional');
    return;
            }

    try {
        // Validar código con API
        // const response = await fetch('TU_API_URL/promo/validate', {
        //     method: 'POST',
        //     body: JSON.stringify({ code })
        // });
        // const result = await response.json();

        // Simulación
        alert('Código aplicado: ' + code);
    document.getElementById('discountRow').style.display = 'flex';
    document.getElementById('discount').textContent = '-$10.00';
    updateSummary();
            } catch (error) {
        alert('Código inválido');
            }
        }

    // Proceder al pago
    function proceedToCheckout() {
            if (cartData.length === 0) {
        alert('Tu carrito está vacío');
    return;
            }

    // Redirigir a página de checkout/pedidos
    window.location.href = 'pedidos.html';
        }

    // Ir a página de producto
    function goToProduct(productId) {
        window.location.href = `producto.html?id=${productId}`;
        }

    // EJEMPLO: Agregar productos de prueba (Eliminar en producción)
    function addSampleProducts() {
        cartData = [
            {
                id: '1',
                name: 'Auriculares Inalámbricos Premium',
                price: 79.99,
                quantity: 1,
                stock: 15,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" fill="%23999" font-size="12" text-anchor="middle" dy=".3em"%3EProducto%3C/text%3E%3C/svg%3E'
            },
            {
                id: '2',
                name: 'Teclado Mecánico RGB',
                price: 89.99,
                quantity: 2,
                stock: 8,
                image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" fill="%23999" font-size="12" text-anchor="middle" dy=".3em"%3EProducto%3C/text%3E%3C/svg%3E'
            }
        ];
    localStorage.setItem('cart', JSON.stringify(cartData));
    renderCart();
        }

// Descomentar para testing:
// addSampleProducts();