using System.ComponentModel.DataAnnotations;
using PadelRent.Api.Enums;

namespace PadelRent.Api.Models;

public class Pago
{
    public int Id { get; set; }

    public int ReservaId { get; set; }
    public Reserva Reserva { get; set; } = null!;

    public string? StripeSessionId { get; set; }

    public string? StripePaymentIntentId { get; set; }

    public decimal Importe { get; set; }

    [MaxLength(3)]
    public string Moneda { get; set; } = "eur";

    public EstadoPago Estado { get; set; } = EstadoPago.Pendiente;

    public DateTime? FechaPago { get; set; }
}