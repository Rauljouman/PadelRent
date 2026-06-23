using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Models;

namespace PadelRent.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Pista> Pistas => Set<Pista>();
    public DbSet<Reserva> Reservas => Set<Reserva>();
    public DbSet<Pago> Pagos => Set<Pago>();
    public DbSet<FacturaSimple> FacturasSimples => Set<FacturaSimple>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}