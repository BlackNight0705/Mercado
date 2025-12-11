using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mercado1.Api.Data;
using Mercado1.Api.Models;

namespace Mercado1.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PedidosController : ControllerBase
    {
        private readonly AppDbContext _db;
        public PedidosController(AppDbContext db) => _db = db;

        // Obtener todos los pedidos
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pedidos = await _db.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Estado)
                .Include(p => p.DetallesPedidos)
                    .ThenInclude(dp => dp.Producto)
                .Select(p => new {
                    orderNumber = p.Id_PE,
                    date = p.Fecha_PE,
                    status = p.Estado.Nombre_E,
                    total = p.DetallesPedidos.Sum(dp => dp.Cantidad_DP * dp.Producto.Precio_P),
                    items = p.DetallesPedidos.Select(dp => new {
                        id = dp.Producto.Id_P,
                        name = dp.Producto.Nombre_P,
                        image = dp.Producto.ImagenUrl_P,
                        quantity = dp.Cantidad_DP,
                        price = dp.Producto.Precio_P
                    })
                })
                .ToListAsync();

            return Ok(pedidos);
        }

        // Obtener pedido por Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pedido = await _db.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Estado)
                .Include(p => p.DetallesPedidos)
                    .ThenInclude(dp => dp.Producto)
                .Where(p => p.Id_PE == id)
                .Select(p => new {
                    orderNumber = p.Id_PE,
                    date = p.Fecha_PE,
                    status = p.Estado.Nombre_E,
                    total = p.DetallesPedidos.Sum(dp => dp.Cantidad_DP * dp.Producto.Precio_P),
                    items = p.DetallesPedidos.Select(dp => new {
                        id = dp.Producto.Id_P,
                        name = dp.Producto.Nombre_P,
                        image = dp.Producto.ImagenUrl_P,
                        quantity = dp.Cantidad_DP,
                        price = dp.Producto.Precio_P
                    })
                })
                .FirstOrDefaultAsync();

            return pedido is null ? NotFound() : Ok(pedido);
        }

        // Obtener pedidos por usuario
        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> GetByUsuario(int usuarioId)
        {
            var pedidos = await _db.Pedidos
                .Include(p => p.Estado)
                .Include(p => p.DetallesPedidos)
                    .ThenInclude(dp => dp.Producto)
                .Where(p => p.Id_U == usuarioId)
                .Select(p => new {
                    orderNumber = p.Id_PE,
                    date = p.Fecha_PE,
                    status = p.Estado.Nombre_E,
                    total = p.DetallesPedidos.Sum(dp => dp.Cantidad_DP * dp.Producto.Precio_P),
                    items = p.DetallesPedidos.Select(dp => new {
                        id = dp.Producto.Id_P,
                        name = dp.Producto.Nombre_P,
                        image = dp.Producto.ImagenUrl_P,
                        quantity = dp.Cantidad_DP,
                        price = dp.Producto.Precio_P
                    })
                })
                .ToListAsync();

            return Ok(pedidos);
        }

        // Crear pedido
        [HttpPost]
        public async Task<IActionResult> Create(PedidoCreateDto dto)
        {
            // Validar stock
            foreach (var detalle in dto.DetallesPedidos)
            {
                var producto = await _db.Productos.FindAsync(detalle.Id_P);
                if (producto == null)
                    return NotFound($"Producto {detalle.Id_P} no existe");

                if (producto.Stock_P < detalle.Cantidad_DP)
                    return BadRequest($"Stock insuficiente para {producto.Nombre_P}");
            }

            // Crear pedido
            var pedido = new Pedido
            {
                Codigo_PE = dto.Codigo_PE,
                Fecha_PE = dto.Fecha_PE,
                DireccionEnvio_PE = dto.DireccionEnvio_PE,
                Id_U = dto.Id_U,
                Id_E = dto.Id_E,
                DetallesPedidos = dto.DetallesPedidos.Select(d => new DetallePedido
                {
                    Id_P = d.Id_P,
                    Cantidad_DP = d.Cantidad_DP,
                    PrecioUnitario_DP = d.PrecioUnitario_DP
                }).ToList()
            };

            _db.Pedidos.Add(pedido);

            // Actualizar stock
            foreach (var detalle in dto.DetallesPedidos)
            {
                var producto = await _db.Productos.FindAsync(detalle.Id_P);
                producto.Stock_P -= detalle.Cantidad_DP;
            }

            // Vaciar carrito del usuario (si existe)
            var carritoItems = await _db.Carrito.Where(c => c.UsuarioId == dto.Id_U).ToListAsync();
            if (carritoItems.Any())
                _db.Carrito.RemoveRange(carritoItems);

            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = pedido.Id_PE }, new { pedido.Id_PE, pedido.Codigo_PE });
        }
    }
}