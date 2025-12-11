using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mercado1.Api.Data;
using Mercado1.Api.Models;
using System.Security.Cryptography;
using System.Text;

namespace Mercado1.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AuthController(AppDbContext db) => _db = db;

        // Registro
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _db.Usuarios.AnyAsync(u => u.Correo_U == request.Correo))
                return BadRequest(new { message = "El correo ya está registrado" });

            // Generar salt y hash
            var salt = GenerateSalt();
            var hash = HashPassword(request.Password, salt);

            var usuario = new Usuario
            {
                Nombre_U = request.Nombre,
                Correo_U = request.Correo,
                PasswordHash_U = hash,
                PasswordSalt_U = salt,
                Rol_U = "cliente"
            };

            _db.Usuarios.Add(usuario);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(Register), new { id = usuario.Id_U }, usuario);
        }

        // Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Correo_U == request.Correo);
            if (usuario is null) return Unauthorized(new { message = "Usuario no encontrado" });

            if (!VerifyPassword(request.Password, usuario.PasswordHash_U, usuario.PasswordSalt_U))
                return Unauthorized(new { message = "Contraseña incorrecta" });

            return Ok(new { message = "Login exitoso", usuario });
        }

        // Helpers para hash + salt
        private string GenerateSalt()
        {
            var rng = new byte[16];
            using var rngProvider = RandomNumberGenerator.Create();
            rngProvider.GetBytes(rng);
            return Convert.ToBase64String(rng);
        }

        private string HashPassword(string password, string salt)
        {
            using var sha256 = SHA256.Create();
            var combined = Encoding.UTF8.GetBytes(password + salt);
            var hash = sha256.ComputeHash(combined);
            return Convert.ToBase64String(hash);
        }

        private bool VerifyPassword(string password, string hash, string salt)
        {
            var hashOfInput = HashPassword(password, salt);
            return hash == hashOfInput;
        }
    }
}