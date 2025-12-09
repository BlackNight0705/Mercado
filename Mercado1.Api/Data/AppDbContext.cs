using Microsoft.EntityFrameworkCore;
using Mercado1.Api.Models;

namespace Mercado1.Api.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<Usuario> Usuarios { get; set; }
		public DbSet<Categoria> Categorias { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<Categoria>().HasKey(c => c.Id_C);
		}
		public DbSet<Producto> Productos { get; set; }
		public DbSet<Promocion> Promociones { get; set; }
		public DbSet<Pedido> Pedidos { get; set; }
		public DbSet<DetallePedido> DetallePedidos { get; set; }
		public DbSet<Resena> Resenas { get; set; }
		public DbSet<PromocionUsuario> PromocionesUsuarios { get; set; }
		public DbSet<EstadoPedido> EstadosPedido { get; set; }
	}
}