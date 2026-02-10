using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StatsApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StatsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<Person> _userManager;
    private readonly SignInManager<Person> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<Person> userManager,
        SignInManager<Person> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }


    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            return BadRequest(new { message = "User already exists" });
        }

        var user = new Referee
        {
            UserName = dto.Email,
            Email = dto.Email,

            FirstName = dto.FirstName,
            LastName = dto.LastName,
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        await _userManager.AddToRoleAsync(user, "Referee");

        return Ok(new
        {
            message = "User registered successfully"
        });
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var passwordValid = await _userManager
            .CheckPasswordAsync(user, dto.Password);

        if (!passwordValid)
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var token = GenerateJwtToken(user, roles);

        return Ok(new
        {
            token,
            roles
        });
    }


    private string GenerateJwtToken(
        IdentityUser user,
        IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim("id", user.Id),
            new Claim("email", user.Email!)
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim("role", role));
        }

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(
            key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["Jwt:ExpiresInMinutes"]!)
            ),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}


public class RegisterDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName {get;set;} = string.Empty;
    public string LastName {get;set;} = string.Empty;
}

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}