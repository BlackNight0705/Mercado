const API_BASE = "http://localhost:5000/api/pedidos";
let ordersData = [];

window.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});

async function loadOrders() {
    try {
        const response = await fetch(API_BASE, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        if (response.ok) {
            const result = await response.json();

            // Si viene con $values, extraerlos
            if (result.$values) {
                ordersData = result.$values.map(order => ({
                    orderNumber: order.orderNumber,
                    date: order.date,
                    status: order.status,
                    total: order.total,
                    items: order.items?.$values || [] // 👈 extraer items
                }));
            } else {
                ordersData = Array.isArray(result) ? result : [];
            }
        }


        renderOrders();
    } catch (error) {
        console.error('Error cargando pedidos:', error);
        ordersData = [];
        renderOrders();
    }
}

function renderOrders() {
    const ordersList = document.getElementById('ordersList');

    if (!Array.isArray(ordersData) || ordersData.length === 0) {
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
                ${Array.isArray(order.items) ? order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <h3 onclick="goToProduct('${item.id}')">${item.name}</h3>
                            <div class="item-quantity">Cantidad: ${item.quantity}</div>
                        </div>
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('') : ''}
            </div>

            <div class="order-total">
                <span class="total-label">Total del pedido:</span>
                <span class="total-amount">$${(order.total || 0).toFixed(2)}</span>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function goToProduct(productId) {
    window.location.href = `producto.html?id=${productId}`;
}