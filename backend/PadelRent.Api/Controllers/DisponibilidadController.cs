using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;

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


        if(duracion != 60 && duracion != 90)
        {
            return BadRequest("La duración debe ser de 60 o 90 minutos.");

        }

        var horarios = new List<Object>();

        var horaActual = horaApertura;

        while(horaActual > horaCierre)
        {
            var horaFin = horaActual.AddMinutes(duracion);

            horarios.Add(new 
            {
                HoraInicio = horaActual,
                HoraFin= horaFin
            });

            horaActual = horaActual.AddHours(1);
        }

        return Ok("Duración válida");
    }
}