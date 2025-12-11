using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mercado1.Api.Models
{
    public class CarritoItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductoId { get; set; }

        [Required]
        public int Cantidad { get; set; }

        // Relación con Usuario (opcional, si quieres carrito por usuario)
        public int UsuarioId { get; set; }

        // 👇 Propiedad de navegación hacia Producto
        [ForeignKey("ProductoId")]
        public Producto? Producto { get; set; }
    }
}