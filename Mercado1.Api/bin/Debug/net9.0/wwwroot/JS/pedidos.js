const API_BASE = "http://localhost:5080/api/pedidos";
let ordersData = [];

// Cargar pedidos al iniciar
window.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});

// Cargar pedidos desde API
async function loadOrders() {
    try {
        const response = await fetch(API_BASE, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.ok) {
            ordersData = await response.json();
        }

        renderOrders();
    } catch (error) {
        console.error('Error cargando pedidos:', error);
        renderOrders();
    }
}

// Renderizar pedidos
function renderOrders() {
    const ordersList = document.getElementById('ordersList');

    if (ordersData.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders">
                <h3>📦 No tienes pedidos</h3>
                <p>Cuando realices una compra, tus pedidos aparecerán aquí</p>
                <a href="index.html" class="shop-button">Comenzar a comprar</a>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = ordersData.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <div class="info-item">
                        <span class="info-label">Pedido</span>
                        <span class="info-value order-number">#${order.orderNumber}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Fecha</span>
                        <span class="info-value">${formatDate(order.date)}</span>
                    </div>
                </div>
                <div class="order-status status-${order.status}">
                    ${order.status === 'processing' ? '⏳ En proceso' : '✅ Entregado'}
                </div>
            </div>

            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <h3 onclick="goToProduct('${item.id}')">${item.name}</h3>
                            <div class="item-quantity">Cantidad: ${item.quantity}</div>
                        </div>
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>

            <div class="order-total">
                <span class="total-label">Total del pedido:</span>
                <span class="total-amount">$${order.total.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

// Ir a página de producto
function goToProduct(productId) {
    window.location.href = `producto.html?id=${productId}`;
}