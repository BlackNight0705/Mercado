using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mercado1.Api.Data;
using Mercado1.Api.Models;

namespace Mercado1.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly AppDbContext _db;
        public ProductosController(AppDbContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var productos = await _db.Productos
                .Include(p => p.Categoria)
                .Select(p => new {
                    id = p.Id_P,
                    nombre = p.Nombre_P,
                    precio = p.Precio_P,
                    imagen = p.ImagenUrl_P ?? "imagenes/placeholder.jpg",
                    descripcion = p.Descripcion_P ?? "Sin descripción disponible.",
                    caracteristicas = new List<string> {
                $"Stock: {p.Stock_P}",
                $"Categoría: {p.Categoria.Nombre_C}"
                    },
                    rating = 4,
                    reviews = 10,
                    precioAnterior = (decimal?)null,
                    badge = p.Stock_P > 0 ? "Disponible" : "Agotado"
                })
                .ToListAsync();

            return Ok(productos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var producto = await _db.Productos
                .Include(p => p.Categoria)
                .Select(p => new
                {
                    id = p.Id_P,
                    nombre = p.Nombre_P,
                    precio = p.Precio_P,
                    imagen = p.ImagenUrl_P,
                    descripcion = p.Descripcion_P,
                    caracteristicas = new List<string> {
                "Stock: " + p.Stock_P,
                "Categoría: " + p.Categoria.Nombre_C
                    },
                    rating = 4,
                    reviews = 10,
                    precioAnterior = (decimal?)null,
                    badge = p.Stock_P > 0 ? "Disponible" : "Agotado"
                })
                .FirstOrDefaultAsync(p => p.id == id);

            return producto is null ? NotFound() : Ok(producto);
        }
    }
}