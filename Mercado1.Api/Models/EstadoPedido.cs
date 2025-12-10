namespace Mercado1.Api.Models
{
    public class EstadoPedido
    {
        public int Id_E { get; set; }
        public string Nombre_E { get; set; } = string.Empty;

        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    }
}