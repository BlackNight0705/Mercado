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

        [Required]
        [MaxLength(100)]
        public string Nombre_U { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Correo_U { get; set; } = string.Empty;

        [Required]
        public string PasswordHash_U { get; set; } = string.Empty;

        public string PasswordSalt_U { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Rol_U { get; set; } = "cliente";

        // Relaciones
        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
        public ICollection<Resena> Resenas { get; set; } = new List<Resena>();
        public ICollection<PromocionUsuario> PromocionesUsuarios { get; set; } = new List<PromocionUsuario>();
    }
}