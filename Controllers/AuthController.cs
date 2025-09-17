using BankServer.Authentication;
using BankServert.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BankServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register(RegisterModel registerModel)
        {
            try
            {
                if (registerModel == null)
                    return BadRequest("Register model is null");

                var userExists = await _userManager.FindByNameAsync(registerModel.FullName);
                if (userExists != null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = "User already exists!" });
                }

                ApplicationUser user = new ApplicationUser()
                {
                    UserName = registerModel.FullName,
                    Email = registerModel.Email,
                    FullName = registerModel.FullName,
                    Gender = registerModel.Gender,
                    DateOfBirth = registerModel.DateOfBirth,
                    ContactNumber = registerModel.ContactNumber,
                    SecurityStamp = Guid.NewGuid().ToString()
                };

                var result = await _userManager.CreateAsync(user, registerModel.Password);
                if (!result.Succeeded)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = "User creation failed!" });
                }

                // Assign role
                string roleName = registerModel.Role switch
                {
                    "Admin" => UserRoles.Admin,
                    "User" => UserRoles.User,
                    _ => UserRoles.User
                };

                if (!await _roleManager.RoleExistsAsync(roleName))
                    await _roleManager.CreateAsync(new IdentityRole(roleName));

                await _userManager.AddToRoleAsync(user, roleName);

                return Ok(new Response { Status = "Success", Message = "User created successfully!" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginModel loginModel)
        {
            try
            {
                if (loginModel == null)
                    return BadRequest("Login model is null");

                _logger.LogInformation("Login attempt for user: {UserName}", loginModel.UserName);

                var user = await _userManager.FindByNameAsync(loginModel.UserName);
                if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
                {
                    var userRoles = await _userManager.GetRolesAsync(user);

                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };

                    foreach (var role in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, role));
                    }

                    var authSigninKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["jwt:Secret"]));

                    var token = new JwtSecurityToken(
                        issuer: _configuration["jwt:ValidIssuer"],
                        audience: _configuration["jwt:ValidAudience"],
                        expires: DateTime.Now.AddHours(3),
                        claims: authClaims,

                        signingCredentials: new SigningCredentials(authSigninKey, SecurityAlgorithms.HmacSha256)
                    );

                    return Ok(new
                    {
                        username = user.UserName,
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        roles = userRoles,
                        expiration = token.ValidTo,
                    });
                }

                return Unauthorized("Invalid credentials");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }
    }
}
