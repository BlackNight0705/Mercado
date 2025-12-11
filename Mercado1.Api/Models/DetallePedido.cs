using System.ComponentModel.DataAnnotations.Schema;
namespace Mercado1.Api.Models
{
    [Table("DetallePedido")]
    public class DetallePedido
    {
        public int Id_DP { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)] // 👈 EF no intentará insertarla
        public string Codigo_DP { get; set; } = string.Empty;
        public int Cantidad_DP { get; set; }
        public decimal PrecioUnitario_DP { get; set; }

        public int Id_PE { get; set; }
        public Pedido Pedido { get; set; } = null!;

        public int Id_P { get; set; }
        public Producto Producto { get; set; } = null!;
    }

    public class PedidoCreateDto
    {
        public string Codigo_PE { get; set; } = string.Empty;
        public DateTime Fecha_PE { get; set; }
        public string DireccionEnvio_PE { get; set; } = string.Empty;
        public int Id_U { get; set; }
        public int Id_E { get; set; }
        public List<DetallePedidoCreateDto> DetallesPedidos { get; set; } = new();
    }

    public class DetallePedidoCreateDto
    {
        public int Id_P { get; set; }
        public int Cantidad_DP { get; set; }
        public decimal PrecioUnitario_DP { get; set; }
    }
}