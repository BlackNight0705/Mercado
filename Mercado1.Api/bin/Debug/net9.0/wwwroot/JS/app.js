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
cargarSeccion("header", "header.html");
cargarSeccion("hero", "hero.html");

// Esperar a que cuerpo.html esté cargado antes de pintar productos
cargarSeccion("cuerpo", "cuerpo.html").then(() => {
    fetch('http://localhost:5000/api/productos')
        .then(res => {
            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
            return res.json();
        })
        .then(data => {
            const productos = data.$values || data;
            if (!Array.isArray(productos)) throw new Error("La respuesta no es un array de productos.");

            const grid = document.getElementById('productsGrid');
            if (!grid) {
                console.error("Elemento 'productsGrid' no encontrado.");
                return;
            }

            productos.forEach(p => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${p.imagen}" alt="${p.nombre}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${p.nombre}</h3>
                        <p class="product-price">$${p.precio}</p>
                        <p class="product-description">${p.descripcion}</p>
                        <span class="product-badge ${p.badge === 'Disponible' ? 'available' : 'out-of-stock'}">
                            ${p.badge}
                        </span>
                         <button class="add-to-cart" data-id="${p.id}">Añadir al carrito</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        })
        .catch(err => console.error('Error al cargar productos:', err));
});

// Cargar el footer
cargarSeccion("footer", "footer.html");

// Esperar al DOM para manejar eventos como el login
window.addEventListener("DOMContentLoaded", () => {
    // Enlace de login
    const loginLink = document.getElementById("login-link");
    if (loginLink) {
        loginLink.addEventListener("click", function () {
            window.location.href = "login.html";
        });
    } else {
        console.warn("Elemento 'login-link' no encontrado.");
    }
});