namespace Mercado1.Api.Models
{
    public class Pedido
    {
        public int Id_PE { get; set; }
        public string Codigo_PE { get; set; } = string.Empty;
        public DateTime Fecha_PE { get; set; }
        public string DireccionEnvio_PE { get; set; } = string.Empty;

        public int Id_U { get; set; }
        public Usuario Usuario { get; set; } = null!;

        public int Id_E { get; set; }
        public EstadoPedido Estado { get; set; } = null!;

        public ICollection<DetallePedido> DetallesPedido { get; set; } = new List<DetallePedido>();
        public ICollection<PromocionUsuario> PromocionesUsuarios { get; set; } = new List<PromocionUsuario>();
    }
}