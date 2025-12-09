namespace Mercado1.Api.Models
{
    public class Resena
    {
        public int Id_R { get; set; }
        public string Codigo_R { get; set; } = string.Empty;
        public string? Comentario_R { get; set; }
        public int Calificacion_R { get; set; }
        public DateTime Fecha_R { get; set; } = DateTime.Now;

        public int Id_U { get; set; }
        public Usuario Usuario { get; set; } = null!;

        public int Id_P { get; set; }
        public Producto Producto { get; set; } = null!;
    }
}