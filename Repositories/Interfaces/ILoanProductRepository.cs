using BankServer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankServer.Repositories.Interfaces
{
    public interface ILoanProductRepository
    {
        Task<IEnumerable<LoanProduct>> GetAllAsync();
        Task<LoanProduct> GetByIdAsync(int id);
        Task<LoanProduct> AddAsync(LoanProduct product); // returns created entity
        Task UpdateAsync(LoanProduct product);
        Task DeleteAsync(int id);
    }
}
