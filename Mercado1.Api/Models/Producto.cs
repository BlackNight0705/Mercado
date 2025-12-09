namespace Mercado1.Api.Models
{
    public class Producto
    {
        public int Id_P { get; set; }
        public string Codigo_P { get; set; } = string.Empty;
        public string Nombre_P { get; set; } = string.Empty;
        public string? Descripcion_P { get; set; }
        public decimal Precio_P { get; set; }
        public int Stock_P { get; set; }
        public string? ImagenUrl_P { get; set; }

        public int? Id_C { get; set; }
        public Categoria? Categoria { get; set; }

        public ICollection<Promocion> Promociones { get; set; } = new List<Promocion>();
        public ICollection<DetallePedido> DetallesPedido { get; set; } = new List<DetallePedido>();
        public ICollection<Resena> Resenas { get; set; } = new List<Resena>();
    }
}