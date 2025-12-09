namespace Mercado1.Api.Models {
    public class Usuario
    {
        public int Id_U { get; set; }
        public string Codigo_U { get; set; } = string.Empty;
        public string Nombre_U { get; set; } = string.Empty;
        public string Correo_U { get; set; } = string.Empty;
        public string PasswordHash_U { get; set; } = string.Empty;
        public string PasswordSalt_U { get; set; } = string.Empty;
        public string Rol_U { get; set; } = "cliente";

        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
        public ICollection<Resena> Resenas { get; set; } = new List<Resena>();
        public ICollection<PromocionUsuario> PromocionesUsuarios { get; set; } = new List<PromocionUsuario>();
    }
}
