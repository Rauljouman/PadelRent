using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;
using PadelRent.Api.DTOs;

namespace PadelRent.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PistasController : ControllerBase
{
    private readonly AppDbContext _context;

    public PistasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPistas()
    {
        var pistas = await _context.Pistas.Select(p => new PistaDto
        {
            Id = p.Id,
            Nombre = p.Nombre,
            Activa =p.Activa
        }).ToListAsync();

        return Ok(pistas);
    }
}