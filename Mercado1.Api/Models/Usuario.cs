using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mercado1.Api.Models
{
    public class Usuario
    {
        [Key]
        public int Id_U { get; set; }

        // Esta columna es calculada en la base de datos, EF no debe modificarla
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public string Codigo_U { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre es obligatorio")]
        [MaxLength(100, ErrorMessage = "El nombre no puede superar los 100 caracteres")]
        public string Nombre_U { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de correo inválido")]
        [MaxLength(150, ErrorMessage = "El correo no puede superar los 150 caracteres")]
        public string Correo_U { get; set; } = string.Empty;

        // Guardarás el hash de la contraseña, nunca la contraseña en claro
        [Required(ErrorMessage = "La contraseña es obligatoria")]
        public string PasswordHash_U { get; set; } = string.Empty;

        // Salt para reforzar el hash
        public string PasswordSalt_U { get; set; } = string.Empty;

        [Required(ErrorMessage = "El rol es obligatorio")]
        [MaxLength(50, ErrorMessage = "El rol no puede superar los 50 caracteres")]
        public string Rol_U { get; set; } = "cliente";

        // Relaciones de navegación
        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
        public ICollection<Resena> Resenas { get; set; } = new List<Resena>();
        public ICollection<PromocionUsuario> PromocionesUsuarios { get; set; } = new List<PromocionUsuario>();
    }
}