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

        var nombre = dto.Nombre.Trim();
        var telefono = dto.Telefono?.Trim();

        if (string.IsNullOrWhiteSpace(nombre))
        {
            return BadRequest("El nombre es obligatorio.");
        }

        if (nombre.Length > 100)
        {
            return BadRequest("El nombre no puede superar los 100 caracteres.");
        }

        if (!string.IsNullOrWhiteSpace(telefono) && telefono.Length > 20)
        {
            return BadRequest("El teléfono no puede superar los 20 caracteres.");
        }

        usuario.Nombre = nombre;
        usuario.Telefono = telefono;

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