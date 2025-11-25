using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var productos = new[] {
            new { Id = 1, Nombre = "Manzana", Precio = 0.5 },
            new { Id = 2, Nombre = "Pan", Precio = 1.0 },
            new { Id = 3, Nombre = "Leche", Precio = 1.5 }
        };
        return Ok(productos);
    }
}