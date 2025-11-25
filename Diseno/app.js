fetch('http://localhost:5080/api/productos')
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