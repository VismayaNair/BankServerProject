using BankServer.Models;
using BankServer.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BankServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository _repository;

        public AccountController(IAccountRepository repository)
        {
            _repository = repository;
        }

        // ✅ GET all accounts
        [HttpGet]
        public async Task<IActionResult> GetAllAccounts()
        {
            var isAdmin = User.IsInRole("Admin");
            var customerIdClaim = User.FindFirst("CustomerId")?.Value;

            var accounts = await _repository.GetAllAsync();

            // 👤 If User, only return their accounts
            if (!isAdmin && customerIdClaim != null)
            {
                accounts = accounts.Where(a => a.CustomerId.ToString() == customerIdClaim);
            }

            return Ok(accounts);
        }

        // ✅ GET by Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccountById(int id)
        {
            var isAdmin = User.IsInRole("Admin");
            var customerIdClaim = User.FindFirst("CustomerId")?.Value;

            var account = await _repository.GetByIdAsync(id);
            if (account == null)
                return NotFound($"Account with ID {id} not found");

            // 👤 User can only access their own account
            if (!isAdmin && (customerIdClaim == null || account.CustomerId.ToString() != customerIdClaim))
                return Forbid();

            return Ok(account);
        }

        // ✅ POST - Only Admin can create accounts
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateAccount([FromBody] Account account)
        {
            var created = await _repository.AddAsync(account);
            return CreatedAtAction(nameof(GetAccountById), new { id = created.AccountId }, created);
        }

        // ✅ PUT - Only Admin can update
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAccount(int id, [FromBody] Account account)
        {
            if (account == null || account.AccountId != id)
                return BadRequest("Invalid account data");

            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return NotFound($"Account with ID {id} not found");

            // ✅ Update fields that admin can change
            existing.Balance = account.Balance;
            existing.AccountType = account.AccountType;
            existing.Status = account.Status;
            existing.CustomerId = account.CustomerId; // Admin can reassign if needed
                                                      // add other fields as required

            await _repository.UpdateAsync(existing);
            return NoContent();
        }


        // ✅ DELETE - Only Admin can delete
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return NotFound($"Account with ID {id} not found");

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
