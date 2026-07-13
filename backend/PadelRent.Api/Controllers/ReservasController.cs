using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;
using PadelRent.Api.DTOs;
using PadelRent.Api.Enums;
using PadelRent.Api.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

    private int? GetUsuarioId()
    {
        var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (usuarioIdClaim == null)
        {
            return null;
        }

        return int.Parse(usuarioIdClaim);
    }

    [Authorize]
    [HttpGet("mis-reservas")]
    public async Task<IActionResult> GetMisReservas()
    {
        var usuarioId = GetUsuarioId();

        if (usuarioId == null)
        {
            return Unauthorized("No se pudo identificar al usuario.");
        }

        var reservas = await _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Pista)
            .Where(r => r.UsuarioId == usuarioId)
            .OrderBy(r => r.Fecha)
            .ThenBy(r => r.HoraInicio)
            .Select(r => new ReservaResponseDto
            {
                Id = r.Id,

                UsuarioId = r.UsuarioId,
                UsuarioNombre = r.Usuario.Nombre,

                PistaId = r.PistaId,
                PistaNombre = r.Pista.Nombre,

                Fecha = r.Fecha,
                HoraInicio = r.HoraInicio,
                HoraFin = r.HoraFin,

                DuracionMinutos = r.DuracionMinutos,
                PrecioPista = r.PrecioPista,

                Estado = r.Estado.ToString()
            })
            .ToListAsync();

        return Ok(reservas);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetReservas()
    {
        var reservas = await _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Pista)
            .OrderBy(r => r.Fecha)
            .ThenBy(r => r.HoraInicio)
            .Select(r => new ReservaResponseDto
            {
                Id = r.Id,

                UsuarioId = r.UsuarioId,
                UsuarioNombre = r.Usuario.Nombre,

                PistaId = r.PistaId,
                PistaNombre = r.Pista.Nombre,

                Fecha = r.Fecha,
                HoraInicio = r.HoraInicio,
                HoraFin = r.HoraFin,

                DuracionMinutos = r.DuracionMinutos,
                PrecioPista = r.PrecioPista,

                Estado = r.Estado.ToString()
            })
            .ToListAsync();

        return Ok(reservas);
    }

    [HttpPost]
    public async Task<IActionResult> CrearReserva(CrearReservaDto dto)
    {
        var usuarioidClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (usuarioidClaim == null)
        {
            return Unauthorized("No se pudo dientificar al usuario.");
        }

        var usuarioId = int.Parse(usuarioidClaim); 

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

        var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.Id == usuarioId);

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
            UsuarioId = usuarioId,
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

    [Authorize]
    [HttpPut("{id}/cancelar")]
    public async Task<IActionResult> CancelarReserva(int id)
    {
        var usuarioId = GetUsuarioId();

        if (usuarioId == null)
        {
            return Unauthorized("No se pudo identificar al usuario.");
        }

        var reserva = await _context.Reservas.FindAsync(id);

        if (reserva == null)
        {
            return NotFound("La reserva no existe.");
        }

        if (reserva.UsuarioId != usuarioId)
        {
            return Forbid();
        }

        if(reserva.Estado == EstadoReserva.Cancelada)
        {
            return BadRequest("La reserva ya esta cancelada.");
        }

        reserva.Estado = EstadoReserva.Cancelada;
        reserva.FechaCancelacion = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            reserva.Id,
            reserva.PistaId,
            reserva.Fecha,
            reserva.HoraInicio,
            reserva.HoraFin,
            Estado = reserva.Estado.ToString(),
            reserva.FechaCancelacion
        });
    }
}