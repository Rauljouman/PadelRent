using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PadelRent.Api.Data;
using System.Security.Claims;
using PadelRent.Api.DTOs;

namespace PadelRent.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsuariosController(AppDbContext context)
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

    [HttpGet("me")]
    public async Task<IActionResult> GetMiPerfil()
    {
        var usuarioId = GetUsuarioId();

        if (usuarioId == null)
        {
            return Unauthorized("No se pudo identificar al usuario.");
        }

        var usuario = await _context.Usuarios.FindAsync(usuarioId.Value);

        if (usuario == null)
        {
            return NotFound("El usuario no existe.");
        }

        return Ok(new
        {
            usuario.Id,
            usuario.Nombre,
            usuario.Email,
            usuario.Telefono,
            usuario.FechaCreacion
        });
    }

    [HttpPut("me")]
    public async Task<IActionResult> ActualizarMiPerfil(ActualizarPerfilDto dto)
    {
        var usuarioId = GetUsuarioId();

        if (usuarioId == null)
        {
            return Unauthorized("No se pudo identificar al usuario.");
        }

        var usuario = await _context.Usuarios.FindAsync(usuarioId.Value);

        if (usuario == null)
        {
            return NotFound("El usuario no existe.");
        }

        if (string.IsNullOrWhiteSpace(dto.Nombre))
        {
            return BadRequest("El nombre es obligatorio.");
        }

        usuario.Nombre = dto.Nombre;
        usuario.Telefono = dto.Telefono;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            usuario.Id,
            usuario.Nombre,
            usuario.Email,
            usuario.Telefono,
            usuario.FechaCreacion
        });
    }
}