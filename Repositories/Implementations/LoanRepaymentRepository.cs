using BankServer.Data;
using BankServer.Models;
using BankServer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankServer.Repositories.Implementations
{
    public class LoanRepaymentRepository : ILoanRepaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public LoanRepaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LoanRepayment>> GetAllAsync() => await _context.LoanRepayments.ToListAsync();

        public async Task<LoanRepayment> GetByIdAsync(int id) => await _context.LoanRepayments.FindAsync(id);

        public async Task<LoanRepayment> AddAsync(LoanRepayment repayment)
        {
            await _context.LoanRepayments.AddAsync(repayment);
            await _context.SaveChangesAsync();
            return repayment;
        }

        public async Task UpdateAsync(LoanRepayment repayment)
        {
            _context.LoanRepayments.Update(repayment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var repayment = await _context.LoanRepayments.FindAsync(id);
            if (repayment != null)
            {
                _context.LoanRepayments.Remove(repayment);
                await _context.SaveChangesAsync();
            }
        }
    }
}
