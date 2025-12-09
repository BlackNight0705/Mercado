using Microsoft.AspNetCore.Mvc;

namespace Mercado1.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarritoController : ControllerBase
    {
        // Aquí podrías manejar un carrito temporal en memoria o vinculado a DB
        [HttpPost("add")]
        public IActionResult AddItem(int productoId, int cantidad)
        {
            // Lógica para agregar al carrito
            return Ok(new { message = "Producto agregado al carrito", productoId, cantidad });
        }

        [HttpDelete("remove/{productoId}")]
        public IActionResult RemoveItem(int productoId)
        {
            // Lógica para eliminar del carrito
            return Ok(new { message = "Producto eliminado del carrito", productoId });
        }
    }
}