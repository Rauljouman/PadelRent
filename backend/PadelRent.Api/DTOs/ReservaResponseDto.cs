namespace PadelRent.Api.DTOs;

public class ReservaResponseDto
{
    public int Id { get; set; }

    public int UsuarioId { get; set; }
    public string UsuarioNombre { get; set; } = string.Empty;

    public int PistaId { get; set; }
    public string PistaNombre { get; set; } = string.Empty;

    public DateOnly Fecha { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFin { get; set; }

    public int DuracionMinutos { get; set; }
    public decimal PrecioPista { get; set; }

    public string Estado { get; set; } = string.Empty;
}