using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mercado1.Api.Models
{
    public class Pedido
    {
        [Key]
        public int Id_PE { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)] // 👈 EF no intentará insertarla
        public string Codigo_PE { get; set; } = string.Empty;

        public DateTime Fecha_PE { get; set; }
        public string DireccionEnvio_PE { get; set; } = string.Empty;

        public int Id_U { get; set; }
        public Usuario Usuario { get; set; } = null!;

        public int Id_E { get; set; }
        public EstadoPedido Estado { get; set; } = null!;

        public ICollection<DetallePedido> DetallesPedidos { get; set; } = new List<DetallePedido>();
        public ICollection<PromocionUsuario> PromocionesUsuarios { get; set; } = new List<PromocionUsuario>();
    }
}