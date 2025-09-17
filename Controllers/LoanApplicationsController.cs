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
    public class LoanApplicationController : ControllerBase
    {
        private readonly ILoanApplicationRepository _repository;

        public LoanApplicationController(ILoanApplicationRepository repository)
        {
            _repository = repository;
        }

        // GET all - Admin only
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var applications = await _repository.GetAllAsync();
            return Ok(applications);
        }

        // GET by ID - Admin + User
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var application = await _repository.GetByIdAsync(id);
            if (application == null) return NotFound();
            return Ok(application);
        }

        // POST - Admin + User
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LoanApplication application)
        {
            var created = await _repository.AddAsync(application);
            return CreatedAtAction(nameof(GetById), new { id = created.ApplicationId }, created);
        }

        // PUT - Admin only
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] LoanApplication application)
        {
            if (id != application.ApplicationId) return BadRequest();
            await _repository.UpdateAsync(application);
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
