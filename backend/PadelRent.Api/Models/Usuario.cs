using System.ComponentModel.DataAnnotations;

namespace PadelRent.Api.Models;

public class Usuario
{
    [Required]
    [MaxLength(100)]
    public string Nombre {get;set;} = string.Empty

    [Required]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Telefono { get; set; }

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public List<Reserva> Reservas { get; set; } = new();
}
