using BankServer.Data;
using BankServer.Models;
using BankServer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankServer.Repositories.Implementations
{
    public class LoanApplicationRepository : ILoanApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public LoanApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LoanApplication>> GetAllAsync() => await _context.LoanApplications.ToListAsync();

        public async Task<LoanApplication> GetByIdAsync(int id) => await _context.LoanApplications.FindAsync(id);

        public async Task<LoanApplication> AddAsync(LoanApplication application)
        {
            await _context.LoanApplications.AddAsync(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task UpdateAsync(LoanApplication application)
        {
            _context.LoanApplications.Update(application);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var application = await _context.LoanApplications.FindAsync(id);
            if (application != null)
            {
                _context.LoanApplications.Remove(application);
                await _context.SaveChangesAsync();
            }
        }
    }
}
