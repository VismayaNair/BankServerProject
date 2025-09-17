using BankServer.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BankServer.Repositories.Interfaces
{
    public interface ILoanRepaymentRepository
    {
        Task<IEnumerable<LoanRepayment>> GetAllAsync();
        Task<LoanRepayment> GetByIdAsync(int id);
        Task<LoanRepayment> AddAsync(LoanRepayment repayment); // returns created entity
        Task UpdateAsync(LoanRepayment repayment);
        Task DeleteAsync(int id);
    }
}
