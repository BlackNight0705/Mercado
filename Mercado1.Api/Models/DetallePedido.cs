namespace Mercado1.Api.Models
{
    public class DetallePedido
    {
        public int Id_DP { get; set; }
        public string Codigo_DP { get; set; } = string.Empty;
        public int Cantidad_DP { get; set; }
        public decimal PrecioUnitario_DP { get; set; }

        public int Id_PE { get; set; }
        public Pedido Pedido { get; set; } = null!;

        public int Id_P { get; set; }
        public Producto Producto { get; set; } = null!;
    }
}