using System.ComponentModel.DataAnnotations;
using PadelRent.Api.Enums;

namespace PadelRent.Api.Models;

public class FacturaSimple
{
    public int Id { get; set; }

    [Required]
    public int ReservaId { get; set; }

    public Reserva Reserva { get; set; } = null!;

    [Required]
    [MaxLength(50)]
    public string Numero { get; set; } = string.Empty;

    public DateTime FechaEmision { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(100)]
    public string ClienteNombre { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string ClienteEmail { get; set; } = string.Empty;

    public decimal Subtotal { get; set; }

    public decimal Iva { get; set; }

    public decimal Total { get; set; }

    public EstadoFactura Estado { get; set; } = EstadoFactura.Emitida;
}