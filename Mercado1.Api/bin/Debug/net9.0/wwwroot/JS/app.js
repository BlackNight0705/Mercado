
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
cargarSeccion("cuerpo", "cuerpo.html");
cargarSeccion("footer", "footer.html");

fetch('http://localhost:5000/api/productos')
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById('lista-productos');
        data.forEach(p => {
            const item = document.createElement('li');
            item.textContent = `${p.nombre} - $${p.precio}`;
            lista.appendChild(item);
        });
    })
    .catch(err => console.error('Error al cargar productos:', err));

document.getElementById("login-link").addEventListener("click", function () {
    window.location.href = "login.html";
});
