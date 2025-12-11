using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mercado1.Api.Data;
using Mercado1.Api.Models;

namespace Mercado1.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarritoController : ControllerBase
    {
        private readonly AppDbContext _db;
        public CarritoController(AppDbContext db) => _db = db;

        // Añadir/actualizar cantidad en el carrito y devolver carrito actualizado
        [HttpPost("add/{usuarioId}")]
        public async Task<IActionResult> AddItem(int usuarioId, [FromBody] CarritoItem item)
        {
            var existingItem = await _db.Carrito
                .FirstOrDefaultAsync(c => c.UsuarioId == usuarioId && c.ProductoId == item.ProductoId);

            if (existingItem != null)
            {
                existingItem.Cantidad = item.Cantidad; // establece la cantidad recibida
            }
            else
            {
                item.UsuarioId = usuarioId;
                _db.Carrito.Add(item);
            }

            await _db.SaveChangesAsync();

            var carrito = await _db.Carrito
                .Where(c => c.UsuarioId == usuarioId)
                .Include(c => c.Producto)
                .Select(c => new {
                    id = c.Id, // 👈 ID del CarritoItem (para eliminar)
                    productId = c.ProductoId, // 👈 ID del producto (para mostrar)
                    name = c.Producto != null ? c.Producto.Nombre_P : "Producto",
                    image = c.Producto != null ? c.Producto.ImagenUrl_P : null,
                    price = c.Producto != null ? c.Producto.Precio_P : 0,
                    stock = c.Producto != null ? c.Producto.Stock_P : 0,
                    quantity = c.Cantidad
                })
                .ToListAsync();

            return Ok(carrito);
        }

        // Eliminar item y devolver carrito actualizado
        [HttpDelete("remove/{usuarioId}/{itemId}")]
        public async Task<IActionResult> RemoveItem(int usuarioId, int itemId)
        {
            var item = await _db.Carrito
                .FirstOrDefaultAsync(c => c.Id == itemId && c.UsuarioId == usuarioId);

            if (item == null)
                return NotFound(new { error = $"Item {itemId} no encontrado en el carrito del usuario {usuarioId}" });

            _db.Carrito.Remove(item);
            await _db.SaveChangesAsync();

            var carrito = await _db.Carrito
                .Where(c => c.UsuarioId == usuarioId)
                .Include(c => c.Producto)
                .Select(c => new {
                    id = c.Id, // 👈 ID del CarritoItem (para eliminar)
                    productId = c.ProductoId, // 👈 ID del producto (para mostrar)
                    name = c.Producto != null ? c.Producto.Nombre_P : "Producto",
                    image = c.Producto != null ? c.Producto.ImagenUrl_P : null,
                    price = c.Producto != null ? c.Producto.Precio_P : 0,
                    stock = c.Producto != null ? c.Producto.Stock_P : 0,
                    quantity = c.Cantidad
                })
                .ToListAsync();

            return Ok(carrito);
        }

        // Vaciar carrito y devolver lista vacía
        [HttpDelete("clear/{usuarioId}")]
        public async Task<IActionResult> ClearCarrito(int usuarioId)
        {
            var items = await _db.Carrito.Where(c => c.UsuarioId == usuarioId).ToListAsync();

            if (!items.Any())
                return NotFound(new { error = $"No se encontraron items para el usuario {usuarioId}" });

            _db.Carrito.RemoveRange(items);
            await _db.SaveChangesAsync();

            return Ok(Array.Empty<object>());
        }

        // Obtener carrito completo (proyección a DTO para evitar $id/$values)
        [HttpGet("{usuarioId}")]
        public async Task<IActionResult> GetCarrito(int usuarioId)
        {
            var carrito = await _db.Carrito
                .Where(c => c.UsuarioId == usuarioId)
                .Include(c => c.Producto)
                .Select(c => new {
                    id = c.Id, // 👈 ID del CarritoItem (para eliminar)
                    productId = c.ProductoId, // 👈 ID del producto (para mostrar)
                    name = c.Producto != null ? c.Producto.Nombre_P : "Producto",
                    image = c.Producto != null ? c.Producto.ImagenUrl_P : null,
                    price = c.Producto != null ? c.Producto.Precio_P : 0,
                    stock = c.Producto != null ? c.Producto.Stock_P : 0,
                    quantity = c.Cantidad
                })
                .ToListAsync();

            return Ok(carrito);
        }
    }
}