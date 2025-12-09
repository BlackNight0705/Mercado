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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pedidos = await _db.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Estado)
                .Include(p => p.DetallesPedido)
                .ToListAsync();
            return Ok(pedidos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pedido = await _db.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Estado)
                .Include(p => p.DetallesPedido)
                .FirstOrDefaultAsync(p => p.Id_PE == id);

            return pedido is null ? NotFound() : Ok(pedido);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Pedido pedido)
        {
            _db.Pedidos.Add(pedido);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = pedido.Id_PE }, pedido);
        }
    }
}