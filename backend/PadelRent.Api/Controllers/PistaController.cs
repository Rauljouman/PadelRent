using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PadelRent.Api.Data;

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
        var pistas = await _context.Pistas.ToListAsync();

        return Ok(pistas);
    }
}