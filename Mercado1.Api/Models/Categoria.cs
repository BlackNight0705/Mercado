using System.Collections.Generic;

namespace Mercado1.Api.Models
{
    public class Categoria
    {
        public int Id_C { get; set; }  // Clave primaria reconocida por convención
        public string Codigo_C { get; set; } = string.Empty;
        public string Nombre_C { get; set; } = string.Empty;
        public string? Descripcion_C { get; set; }

        public ICollection<Producto> Productos { get; set; } = new List<Producto>();
    }
}