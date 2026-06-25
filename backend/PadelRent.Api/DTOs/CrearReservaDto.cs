namespace PadelRent.Api.DTOs;

public class CrearReservaDto
{
    public int UsuarioId { get; set; }

    public int PistaId { get; set; }

    public DateOnly Fecha { get; set; }

    public TimeOnly HoraInicio { get; set; }

    public int DuracionMinutos { get; set; }
}