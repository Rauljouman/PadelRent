using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;
using PadelRent.Api.DTOs;
using PadelRent.Api.Models;
using PadelRent.Api.Services;
using System.Security.Cryptography;

namespace PadelRent.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var nombre = dto.Nombre.Trim();
        var email = dto.Email.Trim().ToLower();
        var password = dto.Password.Trim();
        var telefono = dto.Telefono?.Trim();

        if (string.IsNullOrWhiteSpace(nombre) ||
            string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(password))
        {
            return BadRequest("Nombre, email y contraseña son obligatorios.");
        }

        if (nombre.Length > 100)
        {
            return BadRequest("El nombre no puede superar los 100 caracteres.");
        }

        if (email.Length > 150 || !email.Contains("@"))
        {
            return BadRequest("El email no tiene un formato válido.");
        }

        if (password.Length < 6 || password.Length > 100)
        {
            return BadRequest("La contraseña debe tener entre 6 y 100 caracteres.");
        }

        if (!string.IsNullOrWhiteSpace(telefono) && telefono.Length > 20)
        {
            return BadRequest("El teléfono no puede superar los 20 caracteres.");
        }

        var emailExiste = await _context.Usuarios.AnyAsync(u => u.Email == email);

        if (emailExiste)
        {
            return BadRequest("Ya existe un usuario con ese email.");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

        var usuario = new Usuario
        {
            Nombre = nombre,
            Email = email,
            PasswordHash = passwordHash,
            Telefono = telefono,
            FechaCreacion = DateTime.UtcNow
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(usuario);

        return Ok(new AuthResponseDto
        {
            Token = token,
            UsuarioId = usuario.Id,
            Nombre = usuario.Nombre,
            Email = usuario.Email
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var email = dto.Email.Trim().ToLower();
        var password = dto.Password.Trim();

        if (string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(password))
        {
            return BadRequest("Email y contraseña son obligatorios.");
        }

        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email);

        if (usuario == null)
        {
            return Unauthorized("Credenciales incorrectas.");
        }

        var passwordCorrecta = BCrypt.Net.BCrypt.Verify(password, usuario.PasswordHash);

        if (!passwordCorrecta)
        {
            return Unauthorized("Credenciales incorrectas.");
        }

        var token = _jwtService.GenerateToken(usuario);

        return Ok(new AuthResponseDto
        {
            Token = token,
            UsuarioId = usuario.Id,
            Nombre = usuario.Nombre,
            Email = usuario.Email
        });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
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
            return Ok(new
            {
                Mensaje = "Si el email existe, se generará un enlace de recuperación."
            });
        }

        var tokenBytes = RandomNumberGenerator.GetBytes(32);
        var token = Convert.ToBase64String(tokenBytes)
            .Replace("+", "")
            .Replace("/", "")
            .Replace("=", "");

        usuario.PasswordResetToken = token;
        usuario.PasswordResetTokenExpiracion = DateTime.UtcNow.AddMinutes(15);

        await _context.SaveChangesAsync();

        var resetLink = $"http://localhost:5173/reset-password?token={token}";

        return Ok(new
        {
            Mensaje = "Enlace de recuperación generado correctamente.",
            ResetLink = resetLink,
            Token = token
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
    {
        var token = dto.Token.Trim();
        var nuevaPassword = dto.NuevaPassword.Trim();

        if (string.IsNullOrWhiteSpace(token) ||
            string.IsNullOrWhiteSpace(nuevaPassword))
        {
            return BadRequest("Token y nueva contraseña son obligatorios.");
        }

        if (nuevaPassword.Length < 6 || nuevaPassword.Length > 100)
        {
            return BadRequest("La nueva contraseña debe tener entre 6 y 100 caracteres.");
        }

        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u =>
                u.PasswordResetToken == token &&
                u.PasswordResetTokenExpiracion != null &&
                u.PasswordResetTokenExpiracion > DateTime.UtcNow
            );

        if (usuario == null)
        {
            return BadRequest("El token no es válido o ha expirado.");
        }

        usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(nuevaPassword);
        usuario.PasswordResetToken = null;
        usuario.PasswordResetTokenExpiracion = null;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            Mensaje = "Contraseña actualizada correctamente."
        });
    }
}