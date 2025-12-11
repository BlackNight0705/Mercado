using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mercado1.Api.Data;
using Mercado1.Api.Models;

namespace Mercado1.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PromocionesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PromocionesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/promociones/hero
        [HttpGet("hero")]
        public async Task<IActionResult> GetHeroPromos()
        {
            var hoy = DateTime.Now;

            var promociones = await _context.Promociones
                .Include(p => p.Producto)
                .Where(p => p.Activo_PR && p.FechaInicio_PR <= hoy && p.FechaFin_PR >= hoy)
                .Select(p => new
                {
                    p.Id_PR,
                    p.Codigo_PR,
                    p.Titulo_PR,
                    p.Descripcion_PR,
                    Imagen = p.ImagenUrl_PR,
                    Link = $"producto.html?id={p.Id_P}",
                    ProductoNombre = p.Producto.Nombre_P
                })
                .ToListAsync();

            return Ok(promociones);
        }

        // POST: api/promociones
        [HttpPost]
        public async Task<IActionResult> CrearPromocion([FromBody] Promocion nueva)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Promociones.Add(nueva);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHeroPromos), new { id = nueva.Id_PR }, nueva);
        }

        // PUT: api/promociones/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarPromocion(int id, [FromBody] Promocion actualizada)
        {
            if (id != actualizada.Id_PR)
                return BadRequest();

            _context.Entry(actualizada).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/promociones/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarPromocion(int id)
        {
            var promo = await _context.Promociones.FindAsync(id);
            if (promo == null)
                return NotFound();

            _context.Promociones.Remove(promo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}