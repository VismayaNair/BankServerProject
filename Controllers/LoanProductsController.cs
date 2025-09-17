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
    public class LoanProductController : ControllerBase
    {
        private readonly ILoanProductRepository _repository;

        public LoanProductController(ILoanProductRepository repository)
        {
            _repository = repository;
        }

        // GET all - Admin + User
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _repository.GetAllAsync();
            return Ok(products);
        }

        // GET by ID - Admin + User
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        // POST - Admin only
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] LoanProduct product)
        {
            var created = await _repository.AddAsync(product);
            return CreatedAtAction(nameof(GetById), new { id = created.LoanProductId }, created);
        }

        // PUT - Admin only
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] LoanProduct product)
        {
            if (id != product.LoanProductId) return BadRequest();
            await _repository.UpdateAsync(product);
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
