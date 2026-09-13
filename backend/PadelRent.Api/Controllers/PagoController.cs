using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;
using PadelRent.Api.Enums;
using PadelRent.Api.Models;
using Stripe.Checkout;
using System.Security.Claims;

namespace PadelRent.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PagosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public PagosController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
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

    [HttpPost("crear-checkout-session/{reservaId}")]
    public async Task<IActionResult> CrearCheckoutSession(int reservaId)
    {
        var usuarioId = GetUsuarioId();
        
        if (usuarioId == null)
        {
            return Unauthorized("No se ha podido identificar al usuario.");
        }
        
        var reserva = await _context.Reservas.FindAsync(reservaId);

        if(reserva == null)
        {
            return NotFound("La reserva no existe");
        }

        if (reserva.UsuarioId != usuarioId)
        {
            return Forbid();
        }

        if (reserva.Estado != EstadoReserva.Pendiente)
        {
            return BadRequest("Solo se pueden pagar reservas pendientes");
        }

        if (reserva.FechaExpiracionPago != null &&
            reserva.FechaExpiracionPago <= DateTime.UtcNow)
        {
            reserva.Estado = EstadoReserva.Cancelada;
            reserva.FechaCancelacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return BadRequest("El tiempo para pagar esta reserva ha expirado.");    
        }

        var pagoPendienteExiste = await _context.Pagos
            .AnyAsync(p =>
                p.ReservaId == reserva.Id &&
                p.Estado == EstadoPago.Pendiente
            );

        if (pagoPendienteExiste)
        {
            return BadRequest("Ya existe un pago pendiente para esta reserva.");
        }

        var importeCentimos = (long)(reserva.PrecioPista * 100);

        var successUrl = _configuration["Stripe:SuccessUrl"];
        var cancelUrl = _configuration["Stripe:CancelUrl"];

        if(string.IsNullOrWhiteSpace(successUrl) || string.IsNullOrWhiteSpace(cancelUrl))
        {
            return BadRequest("Las URL de stripe no están configuradas.");    
        }

        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            Mode = "payment",

            SuccessUrl = $"{successUrl}?session_id={{CHECKOUT_SESSION_ID}}",
            CancelUrl = $"{cancelUrl}?reservaId={reserva.Id}",

            Metadata = new Dictionary<string, string>
            {
                { "reservaId", reserva.Id.ToString() },
                { "usuarioId", usuarioId.Value.ToString() }
            },

            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Quantity = 1,
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "eur",
                        UnitAmount = importeCentimos,
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = $"Reserva pista {reserva.PistaId}",
                            Description = $"{reserva.Fecha} de {reserva.HoraInicio} a {reserva.HoraFin}"
                        }
                    }
                }
            }
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        var pago = new Pago
        {
            ReservaId = reserva.Id,
            StripeSessionId = session.Id,
            Importe = reserva.PrecioPista,
            Moneda = "eur",
            Estado = EstadoPago.Pendiente
        };

        _context.Pagos.Add(pago);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            SessionId = session.Id,
            Url = session.Url,
            PagoId = pago.Id,
            ReservaId = reserva.Id
        });
    }

    [HttpPost("confirmar-checkout-session/{sessionId}")]
    public async Task<IActionResult> ConfirmarCheckoutSession(string sessionId)
    {
        var usuarioId = GetUsuarioId();

        if (usuarioId == null)
        {
            return Unauthorized("No se ha podido identificar al usuario.");
        }

        var sessionService = new SessionService();
        var session = await sessionService.GetAsync(sessionId);

        if (session == null)
        {
            return NotFound("La sesión de Stripe no existe.");
        }

        if (session.PaymentStatus != "paid")
        {
            return BadRequest("El pago todavía no está completado.");
        }

        var pago = await _context.Pagos
            .Include(p => p.Reserva).ThenInclude(r => r.Usuario)
            .FirstOrDefaultAsync(p => p.StripeSessionId == sessionId);

        if (pago == null)
        {
            return NotFound("El pago no existe en la base de datos.");
        }

        if (pago.Reserva.UsuarioId != usuarioId)
        {
            return Forbid();
        }

        if (pago.Reserva.FechaExpiracionPago != null &&
            pago.Reserva.FechaExpiracionPago <= DateTime.UtcNow &&
            pago.Estado != EstadoPago.Completado)
        {
            pago.Estado = EstadoPago.Fallido;
            pago.Reserva.Estado = EstadoReserva.Cancelada;
            pago.Reserva.FechaCancelacion = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return BadRequest("El tiempo para confirmar el pago de esta reserva ha expirado.");
        }

        if (pago.Estado == EstadoPago.Completado)
        {
            return BadRequest("Este pago ya fue confirmado.");
        }

        pago.Estado = EstadoPago.Completado;
        pago.StripePaymentIntentId = session.PaymentIntentId;
        pago.FechaPago = DateTime.UtcNow;

        pago.Reserva.Estado = EstadoReserva.Pagada;

        var facturaExiste = await _context.FacturasSimples
    .AnyAsync(f => f.ReservaId == pago.ReservaId);

    if (!facturaExiste)
    {
        var total = pago.Importe;
        var subtotal = Math.Round(total / 1.21m, 2);
        var iva = total - subtotal;

        var factura = new FacturaSimple
        {
            ReservaId = pago.ReservaId,
            Numero = $"FAC-{DateTime.UtcNow:yyyyMMddHHmmss}-{pago.ReservaId}",
            FechaEmision = DateTime.UtcNow,
            ClienteNombre = pago.Reserva.Usuario.Nombre,
            ClienteEmail = pago.Reserva.Usuario.Email,
            Subtotal = subtotal,
            Iva = iva,
            Total = total,
            Estado = EstadoFactura.Emitida
        };

        _context.FacturasSimples.Add(factura);
    }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            pago.Id,
            pago.ReservaId,
            pago.Importe,
            pago.Moneda,
            EstadoPago = pago.Estado.ToString(),
            EstadoReserva = pago.Reserva.Estado.ToString(),
            pago.FechaPago
        });
    }
}