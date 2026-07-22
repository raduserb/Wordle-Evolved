using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using WordleEvolved.Configurations;
using WordleEvolved.Dto;
using WordleEvolved.Interfaces;
using WordleEvolved.Models;

namespace WordleEvolved.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;

        public AuthenticationController(UserManager<User> userManager, IConfiguration configuration, IUserRepository userRepository)
        {
            _userManager = userManager;
            _configuration = configuration;
            _userRepository = userRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationRequestDto model)
        {
            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                return BadRequest("Email already exists");
            }

            var user = new User
            {
                UserId = _userRepository.GetNextUserId(),
                UserName = model.UserName,
                Email = model.Email,
                Password = model.Password,
                Role = "user",
                UserStatistics = new UserStatistics()
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim("UserId", user.UserId.ToString()),
                new Claim("UserRole", user.Role.ToString()),
                new Claim("Email", user.Email.ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtConfig:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiry = DateTime.Now.AddDays(Convert.ToInt32(_configuration["JwtConfig:ExpiryInDays"]));

            var token = new JwtSecurityToken(
                _configuration["JwtConfig:Issuer"],
                _configuration["JwtConfig:Audience"],
                claims,
                expires: expiry,
                signingCredentials: creds
            );

            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserSignInRequestDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var claims = new[]
                {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim("UserId", user.UserId.ToString()),
                new Claim("UserRole", user.Role.ToString()),
                new Claim("Email", user.Email.ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtConfig:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var expiry = DateTime.Now.AddDays(Convert.ToInt32(_configuration["JwtConfig:ExpiryInDays"]));

                var token = new JwtSecurityToken(
                    _configuration["JwtConfig:Issuer"],
                    _configuration["JwtConfig:Audience"],
                    claims,
                    expires: expiry,
                    signingCredentials: creds
                );

                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
            }

            return Unauthorized();
        }

        [HttpPost("forgotpassword")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return Ok();
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            // Send the token to the user via email, SMS, etc.
            // This is left as an exercise for the reader

            return Ok();
        }


        [HttpPost("update")]
        public async Task<IActionResult> Update(UserUpdateRequestDto model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user != null)
            {
                // Update the user properties
                user.Email = model.Email ?? user.Email;

                if (!string.IsNullOrEmpty(model.Password))
                {
                    // Change the password
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var result = await _userManager.ResetPasswordAsync(user, token, model.Password);

                    if (!result.Succeeded)
                    {
                        return BadRequest(result.Errors);
                    }
                }

                // Update the user
                var updateResult = await _userManager.UpdateAsync(user);

                if (updateResult.Succeeded)
                {
                    return Ok(new { Message = "User update successful" });
                }
                else
                {
                    return BadRequest(updateResult.Errors);
                }
            }

            return NotFound(new { Message = "User not found" });
        }

    }
}
