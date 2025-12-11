async function cargarPromocionesHero() {
    try {
        const response = await fetch("http://localhost:5000/api/promociones/hero");
        if (!response.ok) throw new Error("Error cargando promociones");

        const data = await response.json();
        const promos = Array.isArray(data.$values) ? data.$values : [];

        const heroBanner = document.getElementById("heroBanner");
        if (!heroBanner) {
            console.error("❌ No se encontró el contenedor #heroBanner");
            return;
        }

        heroBanner.innerHTML = promos.map((p, index) => {
            const imagen = p.imagen || "imagenes/placeholder.jpg";
            const titulo = p.titulo || "Promoción destacada";
            const descripcion = p.descripcion || "";
            const link = p.link || "#";

            return `
                <div class="hero-slide ${index === 0 ? 'active' : ''}" 
                     style="background-image: url('${imagen}')">
                    <div class="hero-content">
                        <h2 class="hero-title">${titulo}</h2>
                        <p class="hero-description">${descripcion}</p>
                        <a href="${link}" class="hero-button">Ver más</a>
                    </div>
                </div>
            `;
        }).join('');

        // Rotación automática
        let current = 0;
        const slides = heroBanner.querySelectorAll(".hero-slide");
        setInterval(() => {
            slides[current].classList.remove("active");
            current = (current + 1) % slides.length;
            slides[current].classList.add("active");
        }, 5000); // cambia cada 5 segundos
    } catch (error) {
        console.error("❌ Error al cargar promociones hero:", error);
    }
}