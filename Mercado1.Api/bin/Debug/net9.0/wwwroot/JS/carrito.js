const API_BASE = "http://localhost:5000/api/carrito";
let cartData = [];

window.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

async function loadCart() {
    const usuarioId = localStorage.getItem("userId");
    try {
        if (!usuarioId) {
            const savedCart = localStorage.getItem('cart');
            cartData = savedCart ? JSON.parse(savedCart) : [];
            renderCart();
            return;
        }

        const response = await fetch(`${API_BASE}/${usuarioId}`);
        if (response.ok) {
            const result = await response.json();
            cartData = Array.isArray(result.$values) ? result.$values : Array.isArray(result) ? result : [];
        } else {
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

function renderCart() {
    const cartList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const cartSummary = document.getElementById('cartSummary');
    const itemCount = document.getElementById('itemCount');

    if (!Array.isArray(cartData) || cartData.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        if (itemCount) itemCount.textContent = '0 artículos';
        if (cartList && emptyCart) {
            cartList.innerHTML = emptyCart.outerHTML;
        } else if (cartList) {
            cartList.innerHTML = '<p>Tu carrito está vacío.</p>';
        }
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';

    if (cartList) {
        cartList.innerHTML = cartData.map((item, index) => `
            <div class="cart-item" data-index="${index}">
                <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <div class="item-title" onclick="goToProduct('${item.productId}')">${item.name}</div>
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
    }

    if (itemCount) itemCount.textContent = `${cartData.length} artículo${cartData.length > 1 ? 's' : ''}`;
    updateSummary();
}

async function updateQuantity(index, change) {
    const usuarioId = localStorage.getItem("userId");
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

    try {
        const response = await fetch(`${API_BASE}/add/${usuarioId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productoId: item.productId, cantidad: newQuantity })
        });

        if (response.ok) {
            const result = await response.json();
            cartData = Array.isArray(result.$values) ? result.$values : Array.isArray(result) ? result : cartData;
            localStorage.setItem('cart', JSON.stringify(cartData));
            renderCart();
        } else {
            console.error("Error al actualizar cantidad");
        }
    } catch (err) {
        console.error("Error al actualizar carrito:", err);
    }
}

async function removeItem(index) {
    const usuarioId = localStorage.getItem("userId");
    if (confirm('¿Eliminar este producto del carrito?')) {
        const item = cartData[index];

        try {
            const response = await fetch(`${API_BASE}/remove/${usuarioId}/${item.id}`, { method: 'DELETE' });
            if (response.ok) {
                cartData.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cartData));
                renderCart();
            } else {
                console.error("Error al eliminar item");
            }
        } catch (err) {
            console.error("Error al eliminar carrito:", err);
        }
    }
}

function saveForLater(index) {
    alert('Funcionalidad: Guardar para después');
}

function updateSummary() {
    const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const discount = 0;
    const total = subtotal + shipping - discount;

    const summaryItemCount = document.getElementById('summaryItemCount');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    if (summaryItemCount) summaryItemCount.textContent = cartData.length;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

async function applyPromoCode() {
    const code = document.getElementById('promoCode').value.trim();
    if (!code) {
        alert('Ingresa un código promocional');
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/promociones/validate", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const result = await response.json();

        if (response.ok) {
            alert('Código aplicado: ' + code);
            const discountRow = document.getElementById('discountRow');
            const discountEl = document.getElementById('discount');
            if (discountRow) discountRow.style.display = 'flex';
            if (discountEl) discountEl.textContent = `-$${result.discount.toFixed(2)}`;
            updateSummary();
        } else {
            alert(result.message || 'Código inválido');
        }
    } catch (error) {
        alert('Error validando código');
    }
}

async function proceedToCheckout() {
    if (cartData.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
        alert('Debes iniciar sesión para hacer un pedido');
        return;
    }

    try {
        // 1. Construir pedido desde el carrito
        const pedido = {
            Fecha_PE: new Date().toISOString(),
            DireccionEnvio_PE: "Calle 123, Ciudad", // 👈 puedes reemplazar con input del usuario
            Id_U: usuarioId,
            Id_E: 1, // estado inicial (ej. pendiente)
            DetallesPedidos: cartData.map(item => ({
                Id_P: item.productId || item.id,
                Cantidad_DP: item.quantity,
                PrecioUnitario_DP: item.price
            }))
        };

        // 2. Crear pedido en backend
        const response = await fetch("http://localhost:5000/api/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(pedido)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error creando pedido");
        }

        // 3. Vaciar carrito en backend
        await fetch(`${API_BASE}/clear/${usuarioId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        // 4. Vaciar carrito en frontend
        localStorage.removeItem('cart');
        cartData = [];
        renderCart();

        // 5. Redirigir a pedidos
        window.location.href = "pedidos.html";

    } catch (error) {
        console.error("Error en checkout:", error);
        alert("No se pudo completar el pedido");
    }
}

function goToProduct(productId) {
    window.location.href = `producto.html?id=${productId}`;
}