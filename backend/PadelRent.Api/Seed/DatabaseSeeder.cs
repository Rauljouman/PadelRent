using PadelRent.Api.Data;
using PadelRent.Api.Models;

namespace PadelRent.Api.Data.Seed;

public static class DatabaseSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Pistas.Any())
        {
            var pistas = new List<Pista>();

            for (int i = 1; i <= 8; i++)
            {
                pistas.Add(new Pista
                {
                    Nombre = $"Pista {i}",
                    Activa = true
                });
            }

            context.Pistas.AddRange(pistas);
            context.SaveChanges();
        }
    }
}