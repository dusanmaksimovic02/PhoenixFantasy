using System.Security.Claims;
using FantasyApi.Data;
using FantasyApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FantasyApi.Controllers;

[ApiController]
[Route("[controller]")]
public class FantasyRoundController : ControllerBase
{
    private FantasyDbContext context { get; set; }

    public FantasyRoundController(FantasyDbContext context)
    {
        this.context = context;
    }
}
