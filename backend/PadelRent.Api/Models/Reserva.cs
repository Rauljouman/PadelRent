using PadelRent.Api.Enums;

namespace PadelRent.Api.Models;

public class Reserva
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public int PistaId { get; set; }
    public Pista Pista { get; set; } = null!;

    public DateOnly Fecha { get; set; }

    public TimeOnly HoraInicio { get; set; }

    public TimeOnly HoraFin { get; set; }

    public int DuracionMinutos { get; set; }

    public decimal PrecioPista { get; set; }

    public EstadoReserva Estado { get; set; } = EstadoReserva.Pendiente;

    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

    public DateTime? FechaCancelacion { get; set; }

    public Pago? Pago { get; set; }

    public FacturaSimple? FacturaSimple { get; set; }
}