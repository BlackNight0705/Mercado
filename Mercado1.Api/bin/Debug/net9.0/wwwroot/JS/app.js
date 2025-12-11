// Función para cargar fragmentos HTML
async function cargarSeccion(id, archivo) {
    const contenedor = document.getElementById(id);
    try {
        const respuesta = await fetch(archivo);
        if (!respuesta.ok) throw new Error("No se pudo cargar " + archivo);
        const contenido = await respuesta.text();
        contenedor.innerHTML = contenido;
    } catch (error) {
        contenedor.innerHTML = `<p>Error al cargar ${archivo}</p>`;
        console.error(error);
    }
}

// Llamadas a cada sección
cargarSeccion("header", "header.html").then(() => {
    const userName = localStorage.getItem("userName");
    const usuarioId = localStorage.getItem("userId");
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");

    if (userName && loginLink) {
        const loginLabel = loginLink.querySelector(".nav-item-label");
        const loginMain = loginLink.querySelector(".nav-item-main");
        loginLabel.textContent = `Hola, ${userName}`;
        loginMain.textContent = "Mi cuenta";
        loginLink.href = "perfil.html";

        if (logoutLink) {
            logoutLink.style.display = "inline-block";
            logoutLink.addEventListener("click", (e) => {
                e.preventDefault();
                logout();
            });
        }
    } else {
        if (loginLink) loginLink.href = "login.html";
        if (logoutLink) logoutLink.style.display = "none";
    }

    // Actualizar carrito si hay usuario
    if (usuarioId) {
        fetch(`http://localhost:5000/api/carrito/${usuarioId}`)
            .then(res => res.json())
            .then(data => {
                const cartCount = document.querySelector(".cart-count");
                if (cartCount) {
                    const items = data.$values || data;
                    cartCount.textContent = Array.isArray(items) ? items.length : 0;
                    cartCount.style.display = items.length > 0 ? 'inline-block' : 'none';
                }
            })
            .catch(err => console.error("Error al cargar carrito:", err));
    }
});

// 👇 función global de logout
function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("cart"); // opcional
    window.location.href = "login.html";
}

cargarSeccion("hero", "hero.html").then(() => {
    cargarPromocionesHero();
});

// Esperar a que cuerpo.html esté cargado antes de pintar productos
cargarSeccion("cuerpo", "cuerpo.html").then(() => {
    fetch('http://localhost:5000/api/productos')
        .then(res => {
            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
            return res.json();
        })
        .then(data => {
            const productos = Array.isArray(data.$values) ? data.$values : Array.isArray(data) ? data : [];
            if (!Array.isArray(productos)) throw new Error("La respuesta no es un array de productos.");

            const grid = document.getElementById('productsGrid');
            if (!grid) {
                console.error("Elemento 'productsGrid' no encontrado.");
                return;
            }

            grid.innerHTML = ""; // limpiar antes de pintar

            productos.forEach(producto => {
                const caracteristicas = Array.isArray(producto.caracteristicas?.$values)
                    ? producto.caracteristicas.$values
                    : [];

                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
                    ${producto.badge ? `<span class="product-badge">${producto.badge}</span>` : ''}
                    <div class="product-image">
                        <img src="${producto.imagen || 'imagenes/placeholder.jpg'}" alt="${producto.nombre || 'Producto'}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${producto.nombre || 'Sin nombre'}</h3>
                        <div class="product-rating">
                            <span class="stars">★★★★★</span>
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
                            ${caracteristicas.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                        <button class="add-to-cart-btn" onclick="agregarAlCarrito('${producto.id}')">Añadir al carrito</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        })
        .catch(err => console.error('Error al cargar productos:', err));
});

// ✅ Función para añadir al carrito
async function agregarAlCarrito(productoId) {
    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
        alert("Debes iniciar sesión para añadir productos al carrito");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/carrito/add/${usuarioId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            },
            body: JSON.stringify({
                productoId: productoId,
                cantidad: 1 // 👈 por defecto añade 1 unidad
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al añadir producto al carrito");
        }

        const data = await response.json();
        const items = data.$values || data;

        // Actualizar contador en el header
        actualizarContadorCarrito(items);

        alert("Producto añadido al carrito ✅");

    } catch (error) {
        console.error("Error al añadir al carrito:", error);
        alert("No se pudo añadir el producto al carrito");
    }
}

// ✅ Función para actualizar el contador del carrito
function actualizarContadorCarrito(items) {
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) {
        const cantidad = Array.isArray(items) ? items.length : 0;
        cartCount.textContent = cantidad;
        cartCount.style.display = cantidad > 0 ? "inline-block" : "none";
    }
}

// Cargar el footer
cargarSeccion("footer", "footer.html");