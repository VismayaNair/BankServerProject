using BankServer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankServer.Repositories.Interfaces
{
    public interface ILoanApplicationRepository
    {
        Task<IEnumerable<LoanApplication>> GetAllAsync();
        Task<LoanApplication> GetByIdAsync(int id);
        Task<LoanApplication> AddAsync(LoanApplication application); // returns created entity
        Task UpdateAsync(LoanApplication application);
        Task DeleteAsync(int id);
    }
}
