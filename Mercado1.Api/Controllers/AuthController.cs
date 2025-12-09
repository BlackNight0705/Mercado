using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mercado1.Api.Data;
using Mercado1.Api.Models;

namespace Mercado1.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AuthController(AppDbContext db) => _db = db;

        [HttpPost("register")]
        public async Task<IActionResult> Register(Usuario usuario)
        {
            // Aquí deberías hashear la contraseña antes de guardar
            _db.Usuarios.Add(usuario);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Register), new { id = usuario.Id_U }, usuario);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(string correo, string password)
        {
            var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Correo_U == correo);
            if (usuario is null) return Unauthorized();

            // Aquí deberías verificar el hash de la contraseña
            return Ok(new { message = "Login exitoso", usuario });
        }
    }
}