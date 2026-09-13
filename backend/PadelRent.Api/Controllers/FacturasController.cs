using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;
using System.Security.Claims;

namespace PadelRent.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FacturasController : ControllerBase
{
    private readonly AppDbContext _context;

    public FacturasController(AppDbContext context)
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

    [HttpGet("reserva/{reservaId}")]
    public async Task<IActionResult> GetFacturaPorReserva(int reservaId)
    {
        var usuarioId = GetUsuarioId();

        if (usuarioId == null)
        {
            return Unauthorized("No se pudo identificar al usuario.");
        }

        var factura = await _context.FacturasSimples
            .Include(f => f.Reserva)
            .FirstOrDefaultAsync(f => f.ReservaId == reservaId);

        if (factura == null)
        {
            return NotFound("No existe factura para esta reserva.");
        }

        if (factura.Reserva.UsuarioId != usuarioId.Value)
        {
            return Forbid();
        }

        return Ok(new
        {
            factura.Id,
            factura.ReservaId,
            factura.Numero,
            factura.FechaEmision,
            factura.ClienteNombre,
            factura.ClienteEmail,
            factura.Subtotal,
            factura.Iva,
            factura.Total,
            Estado = factura.Estado.ToString()
        });
    }
}