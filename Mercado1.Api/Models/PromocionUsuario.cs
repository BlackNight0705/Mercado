namespace Mercado1.Api.Models
{
    public class PromocionUsuario
    {
        public int Id_PU { get; set; }
        public DateTime FechaUso { get; set; } = DateTime.Now;

        public int Id_U { get; set; }
        public Usuario Usuario { get; set; } = null!;

        public int Id_PE { get; set; }
        public Pedido Pedido { get; set; } = null!;

        public int Id_PR { get; set; }
        public Promocion Promocion { get; set; } = null!;
    }
}