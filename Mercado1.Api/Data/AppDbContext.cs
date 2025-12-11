using Microsoft.EntityFrameworkCore;
using Mercado1.Api.Models;

namespace Mercado1.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Promocion> Promociones { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<DetallePedido> DetallesPedidos { get; set; } // plural correcto
        public DbSet<Resena> Resenas { get; set; }
        public DbSet<PromocionUsuario> PromocionesUsuarios { get; set; }
        public DbSet<EstadoPedido> EstadosPedido { get; set; }
        public DbSet<CarritoItem> Carrito { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Categoría
            modelBuilder.Entity<Categoria>().HasKey(c => c.Id_C);

            // Pedido
            modelBuilder.Entity<Pedido>().HasKey(p => p.Id_PE);
            modelBuilder.Entity<Pedido>()
                .HasMany(p => p.DetallesPedidos)
                .WithOne(d => d.Pedido)
                .HasForeignKey(d => d.Id_PE);

            // Producto
            modelBuilder.Entity<Producto>().HasKey(p => p.Id_P);
            modelBuilder.Entity<Producto>()
                .HasMany(p => p.DetallesPedidos)
                .WithOne(d => d.Producto)
                .HasForeignKey(d => d.Id_P);

            // DetallePedido
            modelBuilder.Entity<DetallePedido>().HasKey(dp => dp.Id_DP);
            modelBuilder.Entity<DetallePedido>()
                .HasOne(dp => dp.Pedido)
                .WithMany(p => p.DetallesPedidos)
                .HasForeignKey(dp => dp.Id_PE);
            modelBuilder.Entity<DetallePedido>()
                .HasOne(dp => dp.Producto)
                .WithMany(p => p.DetallesPedidos)
                .HasForeignKey(dp => dp.Id_P);

            // EstadoPedido
            modelBuilder.Entity<EstadoPedido>().HasKey(e => e.Id_E);

            // Promoción
            modelBuilder.Entity<Promocion>().HasKey(pr => pr.Id_PR);

            // Pedido ↔ Usuario
            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Usuario)
                .WithMany(u => u.Pedidos) // asegúrate de tener ICollection<Pedido> en Usuario
                .HasForeignKey(p => p.Id_U);

            // Pedido ↔ EstadoPedido
            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Estado)
                .WithMany(e => e.Pedidos) // asegúrate de tener ICollection<Pedido> en EstadoPedido
                .HasForeignKey(p => p.Id_E);

            // PromociónUsuario
            modelBuilder.Entity<PromocionUsuario>().HasKey(pu => pu.Id_PU);
            modelBuilder.Entity<PromocionUsuario>()
                .HasOne(pu => pu.Usuario)
                .WithMany(u => u.PromocionesUsuarios)
                .HasForeignKey(pu => pu.Id_U);
            modelBuilder.Entity<PromocionUsuario>()
                .HasOne(pu => pu.Pedido)
                .WithMany(p => p.PromocionesUsuarios)
                .HasForeignKey(pu => pu.Id_PE);
            modelBuilder.Entity<PromocionUsuario>()
                .HasOne(pu => pu.Promocion)
                .WithMany(pr => pr.PromocionesUsuarios)
                .HasForeignKey(pu => pu.Id_PR);

            // Reseña
            modelBuilder.Entity<Resena>().HasKey(r => r.Id_R);
            modelBuilder.Entity<Resena>()
                .HasOne(r => r.Usuario)
                .WithMany(u => u.Resenas)
                .HasForeignKey(r => r.Id_U);
            modelBuilder.Entity<Resena>()
                .HasOne(r => r.Producto)
                .WithMany(p => p.Resenas)
                .HasForeignKey(r => r.Id_P);

            // Usuario
            modelBuilder.Entity<Usuario>().HasKey(u => u.Id_U);

            modelBuilder.Entity<CarritoItem>()
                .HasOne(ci => ci.Producto)
                .WithMany(p => p.CarritoItems)
                .HasForeignKey(ci => ci.ProductoId)
                .HasPrincipalKey(p => p.Id_P);

            modelBuilder.Entity<Promocion>()
             .HasOne(p => p.Producto)
             .WithMany(p => p.Promociones) // asegúrate de tener ICollection<Promocion> en Producto
             .HasForeignKey(p => p.Id_P)   // usa la columna real
             .HasPrincipalKey(p => p.Id_P);
        }
    }
}