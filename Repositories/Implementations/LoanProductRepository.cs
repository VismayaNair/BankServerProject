using BankServer.Data;
using BankServer.Models;
using BankServer.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankServer.Repositories.Implementations
{
    public class LoanProductRepository : ILoanProductRepository
    {
        private readonly ApplicationDbContext _context;

        public LoanProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LoanProduct>> GetAllAsync() => await _context.LoanProducts.ToListAsync();

        public async Task<LoanProduct> GetByIdAsync(int id) => await _context.LoanProducts.FindAsync(id);

        public async Task<LoanProduct> AddAsync(LoanProduct product)
        {
            await _context.LoanProducts.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task UpdateAsync(LoanProduct product)
        {
            _context.LoanProducts.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _context.LoanProducts.FindAsync(id);
            if (product != null)
            {
                _context.LoanProducts.Remove(product);
                await _context.SaveChangesAsync();
            }
        }
    }
}
