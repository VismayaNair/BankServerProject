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
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionRepository _repository;

        public TransactionController(ITransactionRepository repository)
        {
            _repository = repository;
        }

        // GET all transactions - Admin sees all, User sees their own
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var transactions = await _repository.GetAllAsync();
            return Ok(transactions);
        }

        // GET by ID - Admin can view any, User can view only their own
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var transaction = await _repository.GetByIdAsync(id);
            if (transaction == null) return NotFound();
            return Ok(transaction);
        }

        // POST - Admin only
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Transaction transaction)
        {
            var created = await _repository.AddAsync(transaction);
            return CreatedAtAction(nameof(GetById), new { id = created.TransactionId }, created);
        }

        // PUT - Admin only
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] Transaction transaction)
        {
            if (id != transaction.TransactionId) return BadRequest();
            await _repository.UpdateAsync(transaction);
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
