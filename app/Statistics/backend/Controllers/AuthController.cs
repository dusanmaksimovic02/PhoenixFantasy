using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StatsApi.Models;
using StatsApi.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace StatsApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<Person> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<Person> userManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByNameAsync(dto.UserName);
        if (existingUser != null)
            return BadRequest(new { message = "Username already exists" });

        var existingEmail = await _userManager.FindByEmailAsync(dto.Email);
        if (existingEmail != null)
            return BadRequest(new { message = "Email already exists" });

        var user = new Person
        {
            UserName = dto.UserName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, "Referee");
        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("RegisterWithRole")]
    public async Task<IActionResult> RegisterWithRole(RegisterWithRoleDto dto)
    {
        var existingUser = await _userManager.FindByNameAsync(dto.UserName);
        if (existingUser != null)
            return BadRequest(new { message = "Username already exists" });

        var existingEmail = await _userManager.FindByEmailAsync(dto.Email);
        if (existingEmail != null)
            return BadRequest(new { message = "Email already exists" });

        var user = new Person
        {
            UserName = dto.UserName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, dto.Role);
        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.UserName);
        if (user == null)
            return Unauthorized(new { message = "Invalid username" });

        var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordValid)
            return Unauthorized(new { message = "Invalid password" });

        var roles = await _userManager.GetRolesAsync(user);
        var token = GenerateJwtToken(user, roles);

        return Ok(new { token, roles, userId = user.Id, username = user.UserName });
    }

    [HttpPut("ChangeUserRole")]
    public async Task<IActionResult> ChangeUserRole([FromBody] ChangeUserRoleDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.UserId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var currentRoles = await _userManager.GetRolesAsync(user);
        if (currentRoles.Any())
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

        var result = await _userManager.AddToRoleAsync(user, dto.NewRole);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { message = $"Role successfully changed to {dto.NewRole}" });
    }

    [HttpPost("ForgotPassword")]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordDto dto,
        [FromServices] EmailService emailService)
    {
       
        var genericResponse = new { message = "If this email exists you will receive a reset link." };

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return Ok(genericResponse);

        
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        user.TokenForgotPassword = token;
        user.ForgotPasswordExp = DateTime.UtcNow.AddHours(1);
        await _userManager.UpdateAsync(user);

        var resetLink = $"https://localhost:5173/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(dto.Email)}";

       
        _ = Task.Run(async () =>
        {
            try
            {
                await emailService.SendResetPasswordEmailAsync(user.Email!, resetLink);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email ERROR] Failed to send reset email: {ex.Message}");
            }
        });

        return Ok(genericResponse);
    }

    [HttpPost("ResetPassword")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return BadRequest(new { message = "Invalid request." });

        if (user.TokenForgotPassword != dto.Token)
            return BadRequest(new { message = "Invalid or expired token." });

        if (user.ForgotPasswordExp < DateTime.UtcNow)
            return BadRequest(new { message = "Token has expired. Please request a new reset link." });

        var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, resetToken, dto.NewPassword);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

       
        user.TokenForgotPassword = null;
        user.ForgotPasswordExp = DateTime.MinValue;
        await _userManager.UpdateAsync(user);

        return Ok(new { message = "Password reset successfully." });
    }

    
    [HttpPost("VerifyPassword")]
    public async Task<IActionResult> VerifyPassword([FromBody] VerifyPasswordDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.UserId);
        if (user == null)
            return NotFound(new { message = "User not found." });

        var isValid = await _userManager.CheckPasswordAsync(user, dto.OldPassword);
        if (!isValid)
            return Unauthorized(new { message = "Old password is incorrect." });

        return Ok(new { message = "Password verified." });
    }

    
    [HttpPost("ChangePassword")]
    public async Task<IActionResult> ChangePassword(
        [FromBody] ChangePasswordDto dto,
        [FromServices] EmailService emailService)
    {
        var user = await _userManager.FindByIdAsync(dto.UserId);
        if (user == null)
            return NotFound(new { message = "User not found." });

       
        var isValid = await _userManager.CheckPasswordAsync(user, dto.OldPassword);
        if (!isValid)
            return Unauthorized(new { message = "Old password is incorrect." });

       
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        _ = Task.Run(async () =>
        {
            try
            {
                await emailService.SendPasswordChangedEmailAsync(user.Email!, user.FirstName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email ERROR] Failed to send change notification: {ex.Message}");
            }
        });

        return Ok(new { message = "Password changed successfully." });
    }

    private string GenerateJwtToken(Person user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim("id", user.Id),
            new Claim("username", user.UserName!),
            new Claim("email", user.Email!)
        };

        foreach (var role in roles)
            claims.Add(new Claim("role", role));

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

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