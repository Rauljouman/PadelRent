using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;

namespace PadelRent.Api.Controllers;

[ApiController]
[Route("api/admin/pistas")]
[Authorize(Roles = "Admin")]
public class AdminPistasController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminPistasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPistas()
    {
        var pistas = await _context.Pistas
            .OrderBy(p => p.Id)
            .Select(p => new
            {
                p.Id,
                p.Nombre,
                p.Activa
            })
            .ToListAsync();

        return Ok(pistas);
    }

    [HttpPut("{id}/activar")]
    public async Task<IActionResult> ActivarPista(int id)
    {
        var pista = await _context.Pistas.FindAsync(id);

        if (pista == null)
        {
            return NotFound("La pista no existe.");
        }

        pista.Activa = true;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            pista.Id,
            pista.Nombre,
            pista.Activa
        });
    }

    [HttpPut("{id}/desactivar")]
    public async Task<IActionResult> DesactivarPista(int id)
    {
        var pista = await _context.Pistas.FindAsync(id);

        if (pista == null)
        {
            return NotFound("La pista no existe.");
        }

        pista.Activa = false;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            pista.Id,
            pista.Nombre,
            pista.Activa
        });
    }
}