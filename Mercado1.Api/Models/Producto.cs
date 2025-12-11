using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [ForeignKey("Categoria")]
        public int? Id_C { get; set; }
        public Categoria? Categoria { get; set; }

        public ICollection<Promocion> Promociones { get; set; } = new List<Promocion>();
        public ICollection<DetallePedido> DetallesPedidos { get; set; } = new List<DetallePedido>();
        public ICollection<Resena> Resenas { get; set; } = new List<Resena>();
        public ICollection<CarritoItem> CarritoItems { get; set; } = new List<CarritoItem>();

    }
}