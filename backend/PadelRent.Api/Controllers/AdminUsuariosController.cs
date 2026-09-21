using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;
using PadelRent.Api.DTOs;
using PadelRent.Api.Enums;
using System.Security.Claims;

namespace PadelRent.Api.Controllers;

[ApiController]
[Route("api/admin/usuarios")]
[Authorize(Roles = "Admin")]
public class AdminUsuariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminUsuariosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPut("promover-admin")]
    public async Task<IActionResult> PromoverAdmin(PromoverAdminDto dto)
    {
        var email = dto.Email.Trim().ToLower();

        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest("El email es obligatorio.");
        }

        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email);

        if (usuario == null)
        {
            return NotFound("No existe ningún usuario con ese email.");
        }

        if (usuario.Rol == RolUsuario.Admin)
        {
            return BadRequest("Este usuario ya es administrador.");
        }

        usuario.Rol = RolUsuario.Admin;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            usuario.Id,
            usuario.Nombre,
            usuario.Email,
            Rol = usuario.Rol.ToString()
        });
    }

    [HttpPut("quitar-admin")]
    public async Task<IActionResult> QuitarAdmin(PromoverAdminDto dto)
    {
        var email = dto.Email.Trim().ToLower();

        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest("El email es obligatorio.");
        }

        var usuarioIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (usuarioIdClaim == null)
        {
            return Unauthorized("No se pudo identificar al usuario.");
        }

        var adminActualId = int.Parse(usuarioIdClaim);

        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email);

        if (usuario == null)
        {
            return NotFound("No existe ningún usuario con ese email.");
        }

        if (usuario.Id == adminActualId)
        {
            return BadRequest("No puedes quitarte el rol de administrador a ti mismo.");
        }

        if (usuario.Rol == RolUsuario.Usuario)
        {
            return BadRequest("Este usuario no es administrador.");
        }

        usuario.Rol = RolUsuario.Usuario;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            usuario.Id,
            usuario.Nombre,
            usuario.Email,
            Rol = usuario.Rol.ToString()
        });
    }
}