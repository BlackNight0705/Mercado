namespace Mercado1.Api.Models
{
    public class Promocion
    {
        public int Id_PR { get; set; }
        public string Codigo_PR { get; set; } = string.Empty;
        public string Titulo_PR { get; set; } = string.Empty;
        public string? Descripcion_PR { get; set; }
        public string? ImagenUrl_PR { get; set; }
        public DateTime FechaInicio_PR { get; set; }
        public DateTime FechaFin_PR { get; set; }
        public bool Activo_PR { get; set; } = true;

        public int Id_P { get; set; }
        public Producto Producto { get; set; } = null!;

        public ICollection<PromocionUsuario> PromocionesUsuarios { get; set; } = new List<PromocionUsuario>();
    }
}