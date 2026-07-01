using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;
using PadelRent.Api.DTOs;
using PadelRent.Api.Enums;
using PadelRent.Api.Models;

namespace PadelRent.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservasController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReservasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CrearReserva(CrearReservaDto dto)
    {
        if (dto.DuracionMinutos != 60 && dto.DuracionMinutos != 90)
        {
            return BadRequest("La duración debe ser de 60 o 90 minutos.");
        }

        var horaApertura = new TimeOnly(10, 0);
        var horaCierre = new TimeOnly(21, 0);

        var horaFin = dto.HoraInicio.AddMinutes(dto.DuracionMinutos);

        if (dto.HoraInicio < horaApertura || horaFin > horaCierre)
        {
            return BadRequest("La reserva está fuera del horario permitido.");
        }

        var pista = await _context.Pistas.FindAsync(dto.PistaId);

        if (pista == null)
        {
            return NotFound("La pista no existe.");
        }

        if (!pista.Activa)
        {
            return BadRequest("La pista no está activa.");
        }

        var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.Id == dto.UsuarioId);

        if (!usuarioExiste)
        {
            return NotFound("El usuario no existe.");
        }

        var existeSolapamiento = await _context.Reservas.AnyAsync(r =>
            r.PistaId == dto.PistaId &&
            r.Fecha == dto.Fecha &&
            r.Estado != EstadoReserva.Cancelada &&
            dto.HoraInicio < r.HoraFin &&
            horaFin > r.HoraInicio
        );

        if (existeSolapamiento)
        {
            return BadRequest("La pista ya está reservada en ese horario.");
        }

        var reserva = new Reserva
        {
            UsuarioId = dto.UsuarioId,
            PistaId = dto.PistaId,
            Fecha = dto.Fecha,
            HoraInicio = dto.HoraInicio,
            HoraFin = horaFin,
            DuracionMinutos = dto.DuracionMinutos,
            PrecioPista = dto.DuracionMinutos == 60 ? 20 : 28,
            Estado = EstadoReserva.Pendiente
        };

        _context.Reservas.Add(reserva);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            reserva.Id,
            reserva.UsuarioId,
            reserva.PistaId,
            reserva.Fecha,
            reserva.HoraInicio,
            reserva.HoraFin,
            reserva.DuracionMinutos,
            reserva.PrecioPista,
            reserva.Estado
        });;
    }
}