// Datos de pedidos - Reemplazar con datos de tu API/Base de datos
let ordersData = [];

// Cargar pedidos al iniciar
window.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});

// Cargar pedidos desde API
async function loadOrders() {
    try {
        // CONECTAR CON TU API/BASE DE DATOS
        const response = await fetch('TU_API_URL/orders', {
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

// Datos de ejemplo (ELIMINAR EN PRODUCCIÓN - esto vendrá de tu base de datos)
function getSampleOrders() {
    return [
        {
            id: '1',
            orderNumber: '2024-001234',
            date: '2024-12-05T10:30:00',
            total: 169.98,
            status: 'processing', // Solo 'processing' o 'delivered'
            items: [
                {
                    id: 'p1',
                    name: 'Auriculares Inalámbricos Premium con Cancelación de Ruido',
                    price: 79.99,
                    quantity: 1,
                    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" fill="%23999" font-size="10" text-anchor="middle" dy=".3em"%3EProducto 1%3C/text%3E%3C/svg%3E'
                },
                {
                    id: 'p2',
                    name: 'Teclado Mecánico RGB Gaming con Switches Azules',
                    price: 89.99,
                    quantity: 1,
                    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" fill="%23999" font-size="10" text-anchor="middle" dy=".3em"%3EProducto 2%3C/text%3E%3C/svg%3E'
                }
            ]
        },
        {
            id: '2',
            orderNumber: '2024-001199',
            date: '2024-11-28T15:45:00',
            total: 129.99,
            status: 'delivered',
            items: [
                {
                    id: 'p3',
                    name: 'Smartwatch Deportivo con Monitor de Frecuencia Cardíaca',
                    price: 129.99,
                    quantity: 1,
                    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" fill="%23999" font-size="10" text-anchor="middle" dy=".3em"%3EProducto 3%3C/text%3E%3C/svg%3E'
                }
            ]
        },
        {
            id: '3',
            orderNumber: '2024-001156',
            date: '2024-11-15T09:20:00',
            total: 59.99,
            status: 'delivered',
            items: [
                {
                    id: 'p4',
                    name: 'Cámara Web HD 1080p con Micrófono Dual Integrado',
                    price: 59.99,
                    quantity: 1,
                    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" fill="%23999" font-size="10" text-anchor="middle" dy=".3em"%3EProducto 4%3C/text%3E%3C/svg%3E'
                }
            ]
        }
    ];
}

/*
ESTRUCTURA DE DATOS ESPERADA DESDE TU API/BASE DE DATOS:

[
    {
        id: 'unique_id',
        orderNumber: '2024-001234',
        date: '2024-12-05T10:30:00',  // ISO 8601 format
        total: 169.98,
        status: 'processing' o 'delivered',  // SOLO ESTOS DOS ESTADOS
        items: [
            {
                id: 'product_id',
                name: 'Nombre del producto',
                price: 79.99,
                quantity: 1,
                image: 'url_de_imagen'
            }
        ]
    }
]
*/