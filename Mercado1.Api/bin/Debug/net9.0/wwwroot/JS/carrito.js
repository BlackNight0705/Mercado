const API_BASE = "http://localhost:5080/api/carrito";
let cartData = [];

// Cargar carrito al iniciar
window.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

// Cargar carrito desde API o localStorage
async function loadCart() {
    try {
        // OPCIÓN 1: Desde API
        const response = await fetch(API_BASE, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        if (response.ok) {
            cartData = await response.json();
        } else {
            // fallback a localStorage si falla
            const savedCart = localStorage.getItem('cart');
            cartData = savedCart ? JSON.parse(savedCart) : [];
        }
        renderCart();
    } catch (error) {
        console.error('Error cargando carrito:', error);
        const savedCart = localStorage.getItem('cart');
        cartData = savedCart ? JSON.parse(savedCart) : [];
        renderCart();
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
    await fetch(`${API_BASE}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
    });

    localStorage.setItem('cart', JSON.stringify(cartData));
    renderCart();
}

// Eliminar item
async function removeItem(index) {
    if (confirm('¿Eliminar este producto del carrito?')) {
        const item = cartData[index];

        await fetch(`${API_BASE}/${item.id}`, { method: 'DELETE' });

        cartData.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cartData));
        renderCart();
    }
}

// Guardar para después
function saveForLater(index) {
    alert('Funcionalidad: Guardar para después');
}

// Actualizar resumen
function updateSummary() {
    const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const discount = 0;
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
        const response = await fetch("http://localhost:5080/api/promociones/validate", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const result = await response.json();

        if (response.ok) {
            alert('Código aplicado: ' + code);
            document.getElementById('discountRow').style.display = 'flex';
            document.getElementById('discount').textContent = `-$${result.discount.toFixed(2)}`;
            updateSummary();
        } else {
            alert(result.message || 'Código inválido');
        }
    } catch (error) {
        alert('Error validando código');
    }
}

// Proceder al pago
function proceedToCheckout() {
    if (cartData.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    window.location.href = 'pedidos.html';
}

// Ir a página de producto
function goToProduct(productId) {
    window.location.href = `producto.html?id=${productId}`;
}