using BankServer.Models;
using BankServer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BankServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints require authentication
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _repository;

        public CustomerController(ICustomerRepository repository)
        {
            _repository = repository;
        }

        // GET all - Admin only
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _repository.GetAllAsync();
            return Ok(customers);
        }

        // GET by ID - Admin + User
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Customer")]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _repository.GetByIdAsync(id);
            if (customer == null) return NotFound();

            // If logged in as Customer, only allow access to your own record
            if (User.IsInRole("Customer"))
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (customer.UserId != userId)
                {
                    return Forbid(); // 403 if trying to access another customer's data
                }
            }

            return Ok(customer);
        }


        // POST - Admin only
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Customer customer)
        {
            var created = await _repository.AddAsync(customer);
            return CreatedAtAction(nameof(GetById), new { id = created.CustomerId }, created);
        }

        // PUT - Admin only
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] Customer customer)
        {
            if (id != customer.CustomerId) return BadRequest();
            await _repository.UpdateAsync(customer);
            return NoContent();
        }

        // DELETE - Admin only
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
