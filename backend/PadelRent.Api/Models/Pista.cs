using System.ComponentModel.DataAnnotations;

namespace PadelRent.Api.Models;

public class Pista
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Nombre { get; set; } = string.Empty;

    public bool Activa { get; set; } = true;

    public List<Reserva> Reservas { get; set; } = new();
}