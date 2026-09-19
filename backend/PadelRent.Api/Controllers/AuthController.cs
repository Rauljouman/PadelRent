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
    private readonly EmailService _emailService;
    private readonly IConfiguration _configuration;

    public AuthController(
        AppDbContext context,
        JwtService jwtService,
        EmailService emailService,
        IConfiguration configuration
    )
    {
        _context = context;
        _jwtService = jwtService;
        _emailService = emailService;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
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

        if (!string.IsNullOrWhiteSpace(telefono) && telefono.Length != 9)
        {
            return BadRequest("El teléfono debe tener exactamente 9 dígitos.");
        }

        if (!string.IsNullOrWhiteSpace(telefono) && !telefono.All(char.IsDigit))
        {
            return BadRequest("El teléfono solo puede contener números.");
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

        try
        {
            var contenidoBienvenida = $@"
                <h2>Bienvenido a PadelRent</h2>
                <p>Hola {usuario.Nombre},</p>
                <p>Tu cuenta se ha creado correctamente.</p>
                <p>Ya puedes iniciar sesión y reservar tu pista de pádel.</p>
            ";

            await _emailService.EnviarEmailAsync(
                usuario.Email,
                "Cuenta creada en PadelRent",
                contenidoBienvenida
            );
        }
        catch
        {
            // No bloqueamos el registro si falla el email de bienvenida.
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

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
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
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
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
                mensaje = "Si el email existe, recibirás instrucciones para recuperar tu contraseña."
            });
        }

        var tokenBytes = RandomNumberGenerator.GetBytes(64);
        var token = Convert.ToBase64String(tokenBytes);

        usuario.PasswordResetToken = token;
        usuario.PasswordResetTokenExpiracion = DateTime.UtcNow.AddMinutes(30);

        await _context.SaveChangesAsync();

        var frontendUrl = (
            _configuration["Email:FrontendUrl"] ??
            "https://padelrent.vercel.app"
        ).TrimEnd('/');

        var resetLink = $"{frontendUrl}/reset-password?token={Uri.EscapeDataString(token)}";

        var contenidoHtml = $@"
            <h2>Recuperar contraseña</h2>
            <p>Hola {usuario.Nombre},</p>
            <p>Has solicitado cambiar tu contraseña en PadelRent.</p>
            <p>Pulsa en el siguiente enlace para crear una nueva contraseña:</p>
            <p>
                <a href='{resetLink}'>Cambiar contraseña</a>
            </p>
            <p>Este enlace caduca en 30 minutos.</p>
            <p>Si no has solicitado este cambio, puedes ignorar este mensaje.</p>
        ";

        try
        {
            await _emailService.EnviarEmailAsync(
                usuario.Email,
                "Recuperar contraseña - PadelRent",
                contenidoHtml
            );
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                mensaje = "No se pudo enviar el email de recuperación.",
                detalle = ex.Message
            });
        }

        return Ok(new
        {
            mensaje = "Si el email existe, recibirás instrucciones para recuperar tu contraseña."
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
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
            return BadRequest("El enlace no es válido o ha expirado.");
        }

        var mismaPassword = BCrypt.Net.BCrypt.Verify(nuevaPassword, usuario.PasswordHash);

        if (mismaPassword)
        {
            return BadRequest("La nueva contraseña no puede ser igual a la anterior.");
        }

        usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(nuevaPassword);
        usuario.PasswordResetToken = null;
        usuario.PasswordResetTokenExpiracion = null;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            mensaje = "Contraseña actualizada correctamente."
        });
    }
}