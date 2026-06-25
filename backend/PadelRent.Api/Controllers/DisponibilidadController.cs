using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;
using PadelRent.Api.Enums;

namespace PadelRent.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DisponibilidadController : ControllerBase
{
    private readonly AppDbContext _context;

    public DisponibilidadController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetDisponibilidad(DateOnly fecha, int duracion)
    {
        var horaApertura = new TimeOnly(10, 0);
        var horaCierre = new TimeOnly(21, 0);

        if (duracion != 60 && duracion != 90)
        {
            return BadRequest("La duración debe ser de 60 o 90 minutos.");
        }

        var horarios = new List<object>();

        var horaActual = horaApertura;

        var pistasActivas = await _context.Pistas.Where(p => p.Activa).ToListAsync();

        var reservasDelDia = await _context.Reservas.Where(r => r.Fecha == fecha && r.Estado != EstadoReserva.Cancelada).ToListAsync();

        while (horaActual.AddMinutes(duracion) <= horaCierre)
        {
            var horaFin = horaActual.AddMinutes(duracion);

            var pistasDisponibles = pistasActivas
                .Where(p => !reservasDelDia.Any(r =>
                    r.PistaId == p.Id &&
                    horaActual < r.HoraFin &&
                    horaFin > r.HoraInicio
                ))
                .Select(p => new
                {
                    p.Id,
                    p.Nombre
                })
                .ToList();

            horarios.Add(new
            {
                HoraInicio = horaActual,
                HoraFin = horaFin,
                PistasDisponibles = pistasDisponibles
            });

            horaActual = horaActual.AddHours(1);
        }

        return Ok(horarios);
    }
}