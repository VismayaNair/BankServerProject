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
    public class LoanRepaymentController : ControllerBase
    {
        private readonly ILoanRepaymentRepository _repository;

        public LoanRepaymentController(ILoanRepaymentRepository repository)
        {
            _repository = repository;
        }

        // GET all - Admin + User
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var repayments = await _repository.GetAllAsync();
            return Ok(repayments);
        }

        // GET by ID - Admin + User
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var repayment = await _repository.GetByIdAsync(id);
            if (repayment == null) return NotFound();
            return Ok(repayment);
        }

        // POST - Admin + User
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LoanRepayment repayment)
        {
            var created = await _repository.AddAsync(repayment);
            return CreatedAtAction(nameof(GetById), new { id = created.RepaymentId }, created);
        }

        // PUT - Admin only
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] LoanRepayment repayment)
        {
            if (id != repayment.RepaymentId) return BadRequest();
            await _repository.UpdateAsync(repayment);
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
